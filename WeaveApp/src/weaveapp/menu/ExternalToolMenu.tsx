import * as weavejs from "weavejs";
import {WeaveAPI} from "weavejs";
import AbstractVisTool from "weaveapp/tool/AbstractVisTool";
import IWeaveMenus from "weaveapp/menu/IWeaveMenus";
import MenuItemProps = weavejs.ui.menu.MenuItemProps;
import MenuBarItemProps = weavejs.ui.menu.MenuBarItemProps;
import {AbstractVisToolImpl} from "weaveapp/tool/AbstractVisTool";

export default class ExternalToolMenu implements MenuBarItemProps  {

	tools:AbstractVisToolImpl[];
	owner:IWeaveMenus;
	label = "External Tools";
	constructor(owner:IWeaveMenus, tools:AbstractVisToolImpl[])
	{
		this.owner = owner;
		this.tools = tools;
	}

	get menu():MenuItemProps[]
	{
		return this.tools.map((tool) => {
			return {
				label: Weave.lang(WeaveAPI.ClassRegistry.getDisplayName(tool)),
				click: this.owner.createObject.bind(this, tool)
			}
		});
	}
}
