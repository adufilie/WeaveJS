import * as React from "react";
import * as lodash from "lodash";
import StatefulTextField from "../ui/StatefulTextField";
import {linkReactStateRef} from "../utils/WeaveReactUtils";
import ReactUtils from "../utils/ReactUtils";
import WeaveTree from "../ui/WeaveTree";
import {HBox, VBox} from "../react-ui/FlexBox";
import HelpIcon from "../react-ui/HelpIcon";
import SelectableAttributeComponent from "../ui/SelectableAttributeComponent";
import SelectableAttributesList from "../ui/SelectableAttributesList";
import DataSourceEditor from "./DataSourceEditor";
import {IDataSourceEditorProps, IDataSourceEditorState} from "./DataSourceEditor";
import KeyTypeInput from "../ui/KeyTypeInput";

import GroupedDataTransform = weavejs.data.source.GroupedDataTransform;
import URLRequestUtils = weavejs.api.data.IWeaveTreeNode;
import ILinkableHashMap = weavejs.api.core.ILinkableHashMap;
import LinkableHashMap = weavejs.core.LinkableHashMap;
import IColumnWrapper = weavejs.api.data.IColumnWrapper;

export default class ForeignDataMappingTransformEditor extends DataSourceEditor
{
	get editorFields():[React.ReactChild, React.ReactChild][]
	{
		let ds = (this.props.dataSource as GroupedDataTransform);

		let groupByMap = new Map<string, (IColumnWrapper|LinkableHashMap)>();
		groupByMap.set("Group by", ds.groupByColumn as IColumnWrapper);

		let editorFields:[React.ReactChild, React.ReactChild][] = [

			[
				<HBox className="weave-padded-hbox" style={{alignItems: "center", justifyContent: "flex-end"}}>
					{Weave.lang("Group by")}
					<HelpIcon>
						{Weave.lang('The keyType of the "Group by" column should match the keyType of each column to be transformed. The values in this column will be treated as foreign keys which map to aggregated values in the transformed columns.')}
					</HelpIcon>
				</HBox>, 
				<SelectableAttributeComponent attributeName="Group by" attributes={ groupByMap }/>
			],
			[
				<HBox className="weave-padded-hbox" style={{alignItems: "center", justifyContent: "flex-end"}}>
					{Weave.lang("Group keyType")}
					<HelpIcon>
						{Weave.lang('Specifies the keyType of the foreign keys referenced by the "Group by" column. By default, the dataType of the "Group by" column is used as the foreign keyType.')}
					</HelpIcon>
				</HBox>,
				<KeyTypeInput keyTypeProperty={ds.groupKeyType}/>
			],
			[
				Weave.lang("Data to transform"),
				<SelectableAttributesList label="Data to transform" showAsList={true} columns={ds.dataColumns as LinkableHashMap}/>
			]
		];
		return super.editorFields.concat(editorFields)
	}
}
