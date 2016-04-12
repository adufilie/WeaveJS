import * as React from "react";
import * as ReactDOM from "react-dom";
import $ from "../modules/jquery";

export interface DropdownProps extends React.HTMLProps<Dropdown>
{
	options: {
		value: any,
		label?: string
	}[];
	onChange?:(value:any)=>void;
}

export interface DropdownState
{
}

export default class Dropdown extends React.Component<DropdownProps, DropdownState>
{
	element:Element;
	constructor(props:DropdownProps)
	{
		super(props);
	}
	
	componentDidMount()
	{
		this.element = ReactDOM.findDOMNode(this);
		($(this.element) as any).dropdown({
			onChange: (value:any) => {
				this.props.onChange && this.props.onChange(value)
			}
		});
	}
	
	
	componentDidUpdate()
	{
		($(this.element) as any).dropdown("set selected", this.props.value);
	}
	
	render()
	{
		return (
			<div className={"ui selection dropdown " + (this.props.className || "")}>
				<input type="hidden"/>
				<i className="dropdown icon"/>
				<div className="default text">{this.props.placeholder}</div>
				<div className="menu">
				{
					this.props.options.map((option, index) => <div className="item" data-value={option.value} key={index}>{option.label || option.value}</div>)
				}
				</div>
			</div>
		);
	}
}