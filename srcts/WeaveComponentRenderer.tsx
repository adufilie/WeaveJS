import ILinkableObject = weavejs.api.core.ILinkableObject;
import LinkablePlaceholder = weavejs.core.LinkablePlaceholder;
import WeavePath = weavejs.path.WeavePath;

import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import reactUpdate from "react-addons-update";
import {CSSProperties} from "react";
import ReactUtils from "./utils/ReactUtils";
import {HBox, VBox} from "./react-ui/FlexBox";
import SmartComponent from "./ui/SmartComponent";
import LinkableWatcher = weavejs.core.LinkableWatcher;

export interface IWeaveComponentRendererProps extends React.HTMLProps<WeaveComponentRenderer>
{
	weave:Weave,
	path:typeof LinkableWatcher.prototype.targetPath,
	defaultType?:React.ComponentClass<any>,
	requestType?:React.ComponentClass<any>,
	props?:any
}

export interface IWeaveComponentRendererState
{
	actualType?:React.ComponentClass<any>;
	target?:ILinkableObject;
}

export default class WeaveComponentRenderer extends SmartComponent<IWeaveComponentRendererProps, IWeaveComponentRendererState>
{
	generatedComponent:React.Component<any, any>;
	watcher:LinkableWatcher;
	key:number = 0;
	
	constructor(props:IWeaveComponentRendererProps)
	{
		super(props);
		this.state = {};
		this.componentWillReceiveProps(props);
	}
	
	componentWillReceiveProps(props:IWeaveComponentRendererProps):void
	{
		var weaveChanged = this.props.weave != props.weave;
		var pathChanged = !_.isEqual(this.props.path, props.path);
		
		// force React to create a new component if weave instance or renderPath changes
		if (weaveChanged || pathChanged)
			this.key++;
		
		// create a new watcher when weave instance changes
		if (weaveChanged || !this.watcher)
		{
			if (this.watcher)
			{
				// replace the component with a placeholder before it gets unmounted and disposed due to the key changing
				LinkablePlaceholder.replaceInstanceWithPlaceholder(this.watcher.target);
				Weave.dispose(this.watcher);
			}
			
			if (props.weave)
			{
				this.watcher = Weave.disposableChild(props.weave, LinkableWatcher);
				Weave.getCallbacks(this.watcher).addGroupedCallback(this, this.handleWatcher);
			}
			else
			{
				this.watcher = null;
			}
		}
		
		// update watcher with new path
		if (this.watcher)
		{
			this.watcher.targetPath = props.path;
			if (props != this.props)
				this.handleWatcher(props);
		}
	}

	handleWatcher(props:IWeaveComponentRendererProps = null):void
	{
		if (!props)
			props = this.props;
		if (props.requestType)
			props.weave.requestObject(props.path, props.requestType);
		else if (props.defaultType && !this.watcher.target)
			props.weave.requestObject(props.path, props.defaultType);
		
		var ComponentClass = LinkablePlaceholder.getClass(this.watcher.target) as React.ComponentClass<any> & typeof ILinkableObject;
		if (!React.Component.isPrototypeOf(ComponentClass))
			ComponentClass = null;

		// To force React to create a new component
		if (Weave.wasDisposed(this.state.target))
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
	
	componentWillUnmount():void
	{
		Weave.dispose(this.watcher);
		this.watcher = null;
	}

	render():JSX.Element
	{
		var content:JSX.Element = null;
		
		// if the watcher finds a component that was not generated by us, display an error message
		if (this.watcher && this.watcher.target instanceof React.Component && this.watcher.target != this.generatedComponent)
		{
			content = (
				<VBox style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
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
		props.style = _.merge({flex: 1}, props.style);
		delete props.weave;
		delete props.path;
		delete props.props;

		return <VBox {...props}>{ content }</VBox>
	}
}
