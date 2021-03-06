import * as React from "react";
import * as weavejs from "weavejs";
import * as _ from "lodash";
import * as c3 from "c3";
import * as d3 from "d3";
import {Weave} from "weavejs";
import {WeaveAPI} from "weavejs";

import ChartConfiguration = c3.ChartConfiguration;
import ChartAPI = c3.ChartAPI;
import MouseEvent = React.MouseEvent;
import ToolTip = weavejs.ui.ToolTip;
import HBox = weavejs.ui.flexbox.HBox;
import VBox = weavejs.ui.flexbox.VBox;
import ComboBox = weavejs.ui.ComboBox;
import Accordion = weavejs.ui.Accordion;
import WeaveReactUtils = weavejs.util.WeaveReactUtils
import IQualifiedKey = weavejs.api.data.IQualifiedKey;
import IAttributeColumn = weavejs.api.data.IAttributeColumn;
import ILinkableHashMap = weavejs.api.core.ILinkableHashMap;
import FilteredKeySet = weavejs.data.key.FilteredKeySet;
import LinkableHashMap = weavejs.core.LinkableHashMap;
import LinkableString = weavejs.core.LinkableString;
import DynamicColumn = weavejs.data.column.DynamicColumn;
import IColumnWrapper = weavejs.api.data.IColumnWrapper;
import LinkableNumber = weavejs.core.LinkableNumber;

import ColumnUtils = weavejs.data.ColumnUtils;
import ISelectableAttributes = weavejs.api.data.ISelectableAttributes;
import ILinkableObjectWithNewProperties = weavejs.api.core.ILinkableObjectWithNewProperties;
import AbstractC3Tool from "weaveapp/tool/c3tool/AbstractC3Tool";
import SolidLineStyle from "weaveapp/plot/SolidLineStyle";
import FormatUtils from "weaveapp/util/FormatUtils";
import ChartUtils from "weaveapp/util/ChartUtils";
import IVisTool from "weaveapp/api/ui/IVisTool";
import IAltText from "weaveapp/api/ui/IAltText";
import {IVisToolProps} from "weaveapp/api/ui/IVisTool";

declare type Record = {
	id: IQualifiedKey,
	columns: IAttributeColumn[],
	line: {color: string }
};

export default class C3LineChart extends AbstractC3Tool
{
	static WEAVE_INFO = Weave.setClassInfo(C3LineChart, {
		id: "weavejs.tool.c3tool.C3LineChart",
		label: "Line Chart",
		interfaces: [
			IVisTool,
			ILinkableObjectWithNewProperties,
			ISelectableAttributes,
			IAltText
		],
		deprecatedIds: ["weave.visualization.tools::LineChartTool"]
	});

	columns = Weave.linkableChild(this, new LinkableHashMap(IAttributeColumn));
	line = Weave.linkableChild(this, SolidLineStyle);
	curveType = Weave.linkableChild(this, LinkableString);
	xAxisLabelAngle = Weave.linkableChild(this, new LinkableNumber(-45));

	private RECORD_FORMAT = {
		id: IQualifiedKey,
		columns: [] as any[],
		line: { color: this.line.color }
	};

	private RECORD_DATATYPE = {
		columns: Number,
		line: { color: String }
	};

	private keyToIndex:{[key:string]: number};
	private yAxisValueToLabel:{[value:number]: string};

	private records:Record[];
	private columnLabels:string[];
	private chartType:string;

	protected c3ConfigYAxis:c3.YAxisConfiguration;

	constructor(props:IVisToolProps)
	{
		super(props);


		this.line.color.internalDynamicColumn.targetPath = ["defaultColorColumn"];
		this.filteredKeySet.keyFilter.targetPath = ['defaultSubsetKeyFilter'];
		this.selectionFilter.targetPath = ['defaultSelectionKeySet'];
		this.probeFilter.targetPath = ['defaultProbeKeySet'];

		this.keyToIndex = {};
		this.yAxisValueToLabel = {};

		this.c3ConfigYAxis = {
			show: true,
			label: {
				text: "",
				position: "outer-middle"
			},
			tick: {
				multiline: true,
				format: (num:number):string => {
					var columns = this.columns.getObjects(IAttributeColumn);
					if (columns[0] && columns[0].getMetadata('dataType') !== "number")
					{
						return Weave.lang(this.yAxisValueToLabel[num]) || "";
					}
					else
					{
						return String(FormatUtils.defaultNumberFormatting(num));
					}
				}
			}
		};

		this.mergeConfig({
			data: {
				columns: [],
				xSort: false,
				selection: {
					enabled: true,
					multiple: true,
					draggable: true
				}
			},
			grid: {
				x: {
					show: true
				},
				y: {
					show: true
				}
			},
			point: {
				focus: {
					expand: {
						enabled: false
					}
				},
				select: {
					r: 3.5
				}
			},
			axis: {
				x: {
					label: {
						text: "",
						position: "outer-center"
					},
					tick: {
						culling: {
							max: null
						},
						multiline: false,
						rotate: this.xAxisLabelAngle.value,
						format: (d:number):string => {
							if (WeaveAPI.Locale.reverseLayout)
							{
								//handle case where labels need to be reversed
								var temp:number = this.columnLabels.length-1;
								return this.formatXAxisLabel(Weave.lang(this.columnLabels[temp-d]),this.xAxisLabelAngle.value);
							}
							else
							{
								return this.formatXAxisLabel(Weave.lang(this.columnLabels[d]),this.xAxisLabelAngle.value);
							}
						}
					}
				}
			},
			legend: {
				show: false
			}
		});
	}

	private getQKey(datum:any):IQualifiedKey
	{
		if (!datum)
			return null;
		var record = this.records[this.keyToIndex[datum.id]];
		return record ? record.id : null;
	}

	protected handleC3MouseOver(d:any):void
	{
		var key = this.getQKey(d);
		if (this.probeKeySet)
			this.probeKeySet.replaceKeys([key]);
		this.toolTip.show(this, this.chart.internal.d3.event, [key], this.columns.getObjects(IAttributeColumn));
	}

	protected handleC3Selection():void
	{
		if (!this.selectionKeySet)
			return;

		var set_selectedKeys = new Set<IQualifiedKey>();
		var selectedKeys:IQualifiedKey[] = [];
		for (var d of this.chart.selected())
		{
			var key = this.getQKey(d);
			if (key && !set_selectedKeys.has(key))
			{
				set_selectedKeys.add(key);
				selectedKeys.push(key);
			}
		}
		this.selectionKeySet.replaceKeys(selectedKeys);
	}

	protected validate(forced:boolean = false):boolean
	{
		var changeDetected:boolean = false;
		var axisChange:boolean = Weave.detectChange(this, this.columns, this.overrideBounds, this.xAxisName, this.yAxisName, this.margin, this.xAxisLabelAngle);
		var dataChanged:boolean = axisChange || Weave.detectChange(this, this.curveType, this.line, this.filteredKeySet);
		if (dataChanged)
		{
			changeDetected = true;
			this.columnLabels = [];

			var columns = this.columns.getObjects(IAttributeColumn);
			this.filteredKeySet.setColumnKeySources(columns);

			if (WeaveAPI.Locale.reverseLayout)
				columns.reverse();
			this.RECORD_FORMAT.columns = [IQualifiedKey as any].concat(columns);

			for (let idx in columns)
			{
				let child = columns[idx];
				let title = child.getMetadata('title');
				this.columnLabels.push(title);
			}

			this.records = ColumnUtils.getRecords(this.RECORD_FORMAT, this.filteredKeySet.keys, this.RECORD_DATATYPE);
			this.records = _.sortBy(this.records, [0, "id"]);

			this.keyToIndex = {};
			this.yAxisValueToLabel = {};

			this.records.forEach((record:Record, index:number) => {
				this.keyToIndex[record.id as any] = index;
				this.yAxisValueToLabel[record.id as any] = record.id.toString();
			});

			var colors:{[key:string]: string} = {};
			this.records.forEach((record:Record) => {
				colors[record.id as any] = record.line.color || "#000000";
			});

			this.c3Config.data.type = this.curveType.value === "double" ? "spline" : "line";
			this.c3Config.data.columns = _.map(this.records, 'columns') as any;
			this.c3Config.data.colors = colors;
		}
		if (axisChange)
		{
			changeDetected = true;
			var xLabel:string = this.xAxisName.value;
			var yLabel:string = this.yAxisName.value;

			if (this.records)
			{
				var axes:any =  {};
				if (WeaveAPI.Locale.reverseLayout)
				{
					this.records.forEach( (record:Record) => {
						axes[record.id as any] = 'y2';
					});
					this.c3Config.data.axes = axes;
					this.c3Config.axis.y2 = this.c3ConfigYAxis;
					this.c3Config.axis.y = {show: false};
					this.c3Config.axis.x.tick.rotate = -1*this.xAxisLabelAngle.value;
				}
				else
				{
					this.records.forEach( (record:Record) => {
						axes[record.id as any] = 'y';
					});
					this.c3Config.data.axes = axes;
					this.c3Config.axis.y = this.c3ConfigYAxis;
					delete this.c3Config.axis.y2;
					this.c3Config.axis.x.tick.rotate = this.xAxisLabelAngle.value;
				}
			}

			this.c3Config.axis.x.label = {text:xLabel, position:"outer-center"};
			this.c3ConfigYAxis.label = {text:yLabel, position:"outer-middle"};

			this.updateConfigMargin();
			this.updateConfigAxisY();
		}

		if (changeDetected || forced)
			return true;

		// update c3 selection
		if (this.selectionKeySet)
			this.chart.select(this.selectionKeySet.keys.map(key => key.toString()), null, true);

		// update style
		let selectionEmpty: boolean = !this.selectionKeySet || this.selectionKeySet.keys.length === 0;
		d3.select(this.element)
			.selectAll("circle.c3-shape")
			.style("stroke",
				(d: any, i:number, oi:number): string => {
					let key = this.getQKey(d);
					let selected = this.isSelected(key);
					let probed = this.isProbed(key);
					if (probed && selected)
						return "white";
					else
						return "black";
				})
			.style("opacity",
				(d: any, i: number, oi: number): number => {
					let key = this.getQKey(d);
					let selected = this.isSelected(key);
					let probed = this.isProbed(key);
					return (selectionEmpty || selected || probed) ? 1.0 : 0.3;
				})
			.style("stroke-opacity",
				(d: any, i: number, oi: number): number => {
					let key = this.getQKey(d);
					let selected = this.isSelected(key);
					let probed = this.isProbed(key);
					if (probed)
						return 1.0;
					if (selected)
						return 0.5;
					if (!selectionEmpty && !selected)
						return 0;
					return 0.0;
				})
			.style("stroke-width",
				(d: any, i: number, oi: number): number => {
					let key = this.getQKey(d);
					let selected = this.isSelected(key);
					let probed = this.isProbed(key);
					if (probed && selected)
						return 1.0;
					return probed ? 2.0 : 1.0;
				});

		d3.select(this.element)
			.selectAll("path.c3-shape.c3-line")
			.style("opacity",
				(d: any, i: number, oi: number): number => {
					let key = this.records[i].id;
					let selected = this.isSelected(key);
					let probed = this.isProbed(key);
					return (selectionEmpty || selected || probed) ? 1.0 : 0.3;
				})
			.style("stroke-width",
				(d: any, i: number, oi: number): number => {
					let key = this.records[i].id;
					let selected = this.isSelected(key);
					let probed = this.isProbed(key);
					return probed ? 3 : (selected ? 2 : 1);
				});

		//handle selected circles
		d3.select(this.element)
			.selectAll("circle.c3-selected-circle")
			.attr("r", (d:any, i:number, oi:number): number => {
				//we don't set a radius in the config, so this is the default c3 r value + 1.
				return 3.5;
			})
			.style("stroke", "black")
			.style("stroke-opacity",
				(d: any, i: number, oi: number): number => {
					let key = this.getQKey(d);
					let selected = this.isSelected(key);
					let probed = this.isProbed(key);
					if (probed && selected)
						return 1.0;
					else
						return 0.0;
				})
			.style("stroke-width", "1px");

		return false;
	}

	get selectableAttributes()
	{
		return super.selectableAttributes
			.set("Color", this.line.color)
			.set("Y columns", this.columns);
	}


	get defaultPanelTitle():string
	{
		var columns = this.columns.getObjects() as IAttributeColumn[];
		if (columns.length == 0)
			return Weave.lang('Line chart');

		return Weave.lang("Line chart of {0}", columns.map(column=>ColumnUtils.getTitle(column)).join(Weave.lang(", ")));
	}

	//todo:(pushCrumb)find a better way to link to sidebar UI for selectbleAttributes
	renderEditor =(pushCrumb:(title:string,renderFn:()=>JSX.Element , stateObject:any )=>void):JSX.Element=> {
		return Accordion.render(
			[Weave.lang("Data"), this.getSelectableAttributesEditor(pushCrumb)],
			[
				Weave.lang("Display"),
				[
					[
						Weave.lang("X axis label angle"),
						<ComboBox style={{width:"100%"}} ref={WeaveReactUtils.linkReactStateRef(this, { value: this.xAxisLabelAngle })} options={ChartUtils.getAxisLabelAngleChoices()}/>
					]
				]
			],
			[Weave.lang("Titles"), this.getTitlesEditor()],
			[Weave.lang("Margins"), this.getMarginEditor()],
			[Weave.lang("Accessibility"), this.getAltTextEditor()]
		);
	};

	get deprecatedStateMapping()
	{
		return [super.deprecatedStateMapping, {
			"children": {
				"visualization": {
					"plotManager": {
						"plotters": {
							"plot": {
								"filteredKeySet": this.filteredKeySet,
								"columns": this.columns,
								"curveType": this.curveType,
								"lineStyle": this.line,

								"enableGroupBy": false,
								"groupKeyType": "",
								"normalize": false,
								"shapeBorderAlpha": 0.5,
								"shapeBorderColor": 0,
								"shapeBorderThickness": 1,
								"shapeSize": 5,
								"shapeToDraw": "Solid Circle",
								"zoomToSubset": false
							}
						}
					}
				}
			}
		}];
	}
}
