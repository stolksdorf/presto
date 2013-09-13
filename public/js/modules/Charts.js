Presto.registerModule({
	name   : 'charts',
	global : 'Charts',

	order : 250,

	initialize : function()
	{
		return this;
	},

	render : function(moduleData)
	{
		this.charts = Presto.createBlocks({
			data      : moduleData,
			block     : this.ChartBlock,
			container : Presto.getFlowPanel()
		});
		return this;
	},

	update : function()
	{
		_.each(this.charts, function(chart){
			chart.update();
		});
		return this;
	},

	remove : function()
	{
		_.each(this.charts, function(chart){
			chart.remove();
		})
		return this;
	},

	ChartBlock : XO.Block.extend({
		schematic : 'chart',
		render : function()
		{
			var self = this;


			if(!this.model.get('description')){
				this.dom.description.hide();
			}


			return this;
		},
		update : function()
		{
			var self = this;

			this.dom.title.text(_.evalue(this.model.get('title')));
			this.dom.description.text(_.evalue(this.model.get('description')));



			var chartData = _.map(this.model.get('series'), function(series, seriesName){
				var result = {};
				var data = _.evalue(series.data);
				result.data = _.map(data, function(point, index){
					return [index, point];
				});
				result.label = series.label;
				return result;
			});



			$.plot(this.dom.graph, chartData, flotOptions);

			return this;
		},
	}),

});


flotOptions = {


	xaxis:{
		font : {
			//size: 11,
			//lineHeight: 13,
			//style: "italic",
			weight: "300",
			family: "Lato",
			//variant: "small-caps",
			color: "#000"
		}
	},
	yaxis: {
		font : {
			//size: 11,
			//lineHeight: 13,
			//style: "italic",
			weight: "300",
			family: "Lato",
			//variant: "small-caps",
			color: "#000"
		}
	},
	series: {
	    lines: { show: true },
	    points: { show: true }
	},
	grid: {
		/*
	    show: boolean
	    aboveData: boolean
	    color: color
	    backgroundColor: color/gradient or null
	    margin: number or margin object
	    labelMargin: number
	    axisMargin: number
	    markings: array of markings or (fn: axes -> array of markings)
	    borderWidth: number or object with "top", "right", "bottom" and "left" properties with different widths
	    borderColor: color or null or object with "top", "right", "bottom" and "left" properties with different colors
	    minBorderMargin: number or null
	    clickable: boolean
	    hoverable: boolean
	    autoHighlight: boolean
	    mouseActiveRadius: number
	    */
	},

	colors: ['#16A085','#C0392B','#27AE60','#D35400','#2980B9','#8E44AD','#2C3E50','#F39C12','#BDC3C7','#7F8C8D']
}

