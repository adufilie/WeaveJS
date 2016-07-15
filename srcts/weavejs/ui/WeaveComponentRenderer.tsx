namespace weavejs.ui
{
	import ILinkableObject = weavejs.api.core.ILinkableObject;
	import LinkablePlaceholder = weavejs.core.LinkablePlaceholder;
	import ReactUtils = weavejs.util.ReactUtils;
	import VBox = weavejs.ui.flexbox.VBox;
	import SmartComponent = weavejs.ui.SmartComponent;
	import LinkableWatcher = weavejs.core.LinkableWatcher;

	export interface IWeaveComponentRendererProps extends React.HTMLProps<WeaveComponentRenderer>
	{
		weave:Weave,
		path:typeof LinkableWatcher.prototype.targetPath,
		defaultType?:React.ComponentClass<any>,
		requestType?:React.ComponentClass<any>,
		onCreate?:(instance:ILinkableObject) => void,
		props?:any
	}

	export interface IWeaveComponentRendererState
	{
		actualType?:React.ComponentClass<any>;
		target?:ILinkableObject;
	}

	export class WeaveComponentRenderer extends SmartComponent<IWeaveComponentRendererProps, IWeaveComponentRendererState>
	{
		watcher:LinkableWatcher = Weave.disposableChild(this, new LinkableWatcher(null, null, this.handleWatcher.bind(this)));
		generatedComponent:React.Component<any, any> & ILinkableObject;
		key:number = 0;
		
		constructor(props:IWeaveComponentRendererProps)
		{
			super(props);
			this.state = {};
			this.handleProps(props);
		}
		
		componentWillReceiveProps(props:IWeaveComponentRendererProps):void
		{
			this.handleProps(props);
		}
		
		handleProps(props:IWeaveComponentRendererProps):void
		{
			var weaveChanged = this.props.weave != props.weave;
			var pathChanged = !_.isEqual(this.props.path, props.path);
			if (weaveChanged || pathChanged)
			{
				// force React to create a new component
				this.key++;
				// replace the generated component with a placeholder before it gets unmounted and disposed due to the key changing
				LinkablePlaceholder.replaceInstanceWithPlaceholder(this.generatedComponent);
			}
			this.watcher.root = props.weave && props.weave.root;
			this.watcher.targetPath = props.path;
			this.handleWatcher(props);
		}
		
		requestObject(weave:Weave, path:typeof LinkableWatcher.prototype.targetPath, type:React.ComponentClass<any>):void
		{
			var oldObject = weave.getObject(path);
			weave.requestObject(path, type);
			var newObject = weave.getObject(path);
			var lp = Weave.AS(newObject, LinkablePlaceholder);
			if (oldObject != newObject && lp)
			{
				Weave.getCallbacks(lp).addDisposeCallback(this, () => {
					if (this.props.onCreate && lp.getInstance() == this.generatedComponent)
						this.props.onCreate(this.generatedComponent);
				});
			}
		}

		handleWatcher(props:IWeaveComponentRendererProps = null):void
		{
			if (!props)
				props = this.props;
			
			if (props.weave)
			{
				if (props.requestType)
					this.requestObject(props.weave, props.path, props.requestType);
				else if (props.defaultType && !this.watcher.target)
					this.requestObject(props.weave, props.path, props.defaultType);
			}
			
			var ComponentClass = LinkablePlaceholder.getClass(this.watcher.target) as React.ComponentClass<any> & typeof ILinkableObject;
			if (!React.Component.isPrototypeOf(ComponentClass))
				ComponentClass = null;

			// make sure React unmounts disposed component
			if (Weave.wasDisposed(this.generatedComponent))
				this.key++;

			this.setState({
				actualType: ComponentClass,
				target: this.watcher.target
			});
		}
		
		handleGeneratedComponent=(component:React.Component<any, any>):void=>
		{
			if (component)
			{
				this.generatedComponent = component;
				LinkablePlaceholder.setInstance(this.watcher.target, component);
			}
			
			ReactUtils.updateState(this, {target: component});
		}
		
		render():JSX.Element
		{
			var content:JSX.Element = null;
			
			// if the watcher finds a component that was not generated by us, display an error message
			if (this.watcher.target instanceof React.Component && this.watcher.target != this.generatedComponent)
			{
				content = (
					<VBox style={{flex: 1, justifyContent: "center", alignItems: "center", padding: 10}}>
						<span>{Weave.lang('This component was already mounted elsewhere in the DOM')}</span>
					</VBox>
				);
			}
			else if (this.state.actualType)
			{
				content = React.createElement(this.state.actualType, _.merge({key: this.key, ref: this.handleGeneratedComponent}, this.props.props));
			}
			else
			{
				this.generatedComponent = null;
			}
			
			var props = _.clone(this.props);
			props.style = _.merge(
				{ flex: 1 },
				props.style
			);
			delete props.weave;
			delete props.path;
			delete props.defaultType;
			delete props.requestType;
			delete props.props;

			return <VBox {...props}>{ content }</VBox>;
		}
	}

	weavejs.WeaveAPI.ClassRegistry.registerClass(WeaveComponentRenderer, 'weavejs.ui.WeaveComponentRenderer');
}