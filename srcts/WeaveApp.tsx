import * as React from "react";
import * as _ from "lodash";
import WeaveMenuBar from "./WeaveMenuBar";
import Menu from "./react-ui/Menu/Menu";
import {REACT_COMPONENT} from "./react-ui/Menu/Menu";
import LayoutManager from "./WeaveLayoutManager";
import {MenuItemProps} from "./react-ui/Menu/MenuItem";
import VBox from "./react-ui/VBox";

import LinkableVariable = weavejs.core.LinkableVariable;

export interface WeaveAppProps extends React.Props<WeaveApp>
{
	layout:LinkableVariable
}

export interface WeaveAppState
{
	showContextMenu: boolean;
	contextMenuXPos?: number;
	contextMenuYPos?: number;
	contextMenuItems?: MenuItemProps[];
}

export default class WeaveApp extends React.Component<WeaveAppProps, WeaveAppState>
{
	constructor(props:WeaveAppProps)
	{
		super(props);
		this.state = {
			showContextMenu: false,
			contextMenuXPos: 0,
			contextMenuYPos: 0,
			contextMenuItems: []
		};
	}

	showContextMenu(event:React.MouseEvent)
	{
		// if context menu already showing do nothing
		var contextMenuItems = Menu.getMenuItems(event.target as HTMLElement);
		this.setState({
			showContextMenu: true,
			contextMenuItems,
			contextMenuXPos: event.clientX,
			contextMenuYPos: event.clientY
		});
		event.preventDefault();
	}
	
	handleRightClickOnContextMenu(event:React.MouseEvent)
	{
		event.stopPropagation();
		event.preventDefault();
	}
	
	hideContextMenu(event:React.MouseEvent)
	{
		this.setState({
			showContextMenu:false
		});
	}
	
	componentDidMount()
	{
		
	}
	
	render():JSX.Element
	{
		return (
			<VBox style={{width: "100%", height: "100%"}} onMouseDown={this.hideContextMenu.bind(this)} onContextMenu={this.showContextMenu.bind(this)}>
				<WeaveMenuBar/>
				<LayoutManager layout={this.props.layout} style={{flex: 1}}/>
				{
					this.state.showContextMenu ? 
					<div onContextMenu={this.handleRightClickOnContextMenu.bind(this)}>
						{<Menu xPos={this.state.contextMenuXPos} yPos={this.state.contextMenuYPos} menu={this.state.contextMenuItems}/>}
					</div>
					: null
				}
			</VBox>
		);
	}
	
}
