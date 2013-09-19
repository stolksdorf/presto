Presto.registerModule({
	name   : 'charts',
	global : 'Charts',

	order : 250,

	defaultOptions : {
		xaxis:{
			font : {
				weight: "300",
				family: "Lato",
				color: "#000"
			}
		},
		yaxis: {
			font : {
				weight: "300",
				family: "Lato",
				color: "#000"
			}
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
	},

	lineOptions : {
		series: {
			lines : { show: true },
			points: { show: true }
		},
	},

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







//////////////////////////////////

	ChartBlock : XO.Block.extend({
		schematic : 'chart',
		render : function()
		{
			var self = this;
			if(!this.model.get('description')){
				this.dom.description.hide();
			}


			if(this.model.get('size') === 'big'){
				this.dom.graph.addClass('big_chart');
			}


			this.options = _.extend(Presto.modules.charts.defaultOptions, Presto.modules.charts.lineOptions);

			return this;
		},
		update : function()
		{
			var self = this;


			this.dom.title.text(_.evalue(this.model.get('title')));
			this.dom.description.text(_.evalue(this.model.get('description')));


			Charts[this.name] = {};
			this.data = {};


			var chartData = _.map(this.model.get('series'), function(series, seriesName){
				var result = {};
				var data = _.evalue(series.data);
				result.data = _.map(data, function(point, index){
					return [index, point];
				});
				result.label = series.label;

				Charts[self.name][seriesName] = data;
				self.data[seriesName] = result.data;
				return result;
			});


			this.addFuncsToGlobal();


			// Add breakeven line
			if(this.model.get('breakeven')){
				var markings = [];
				_.each(this.model.get('breakeven'), function(seriesPair){
					var intercepts = Charts[self.name].intercept(seriesPair[0], seriesPair[1]);
					_.each(intercepts, function(intercept){
						markings.push({ color: '#000', lineWidth: 2, yaxis: { from: intercept[1], to: intercept[1] } })
					});
				});
				this.options.grid.markings = markings;
			}

			//Draw that plot!
			$.plot(this.dom.graph, chartData, this.options);
			return this;
		},

		addFuncsToGlobal : function()
		{
			var self = this;
			//Update Global with Functions
			Charts[self.name].intercept = function(series1, series2){
				var smallSetLength = self.data[series1].length > self.data[series2].length ? self.data[series2].length : self.data[series1].length;
				var fp1 = self.data[series1][0];
				var fp2 = self.data[series2][0];

				var result = [];

				for(var i = 1; i < smallSetLength; i++){

					var lp1 = self.data[series1][i];
					var lp2 = self.data[series2][i];


					var x=((fp1[0]*lp1[1]-fp1[1]*lp1[0])*(fp2[0]-lp2[0])-(fp1[0]-lp1[0])*(fp2[0]*lp2[1]-fp2[1]*lp2[0]))/((fp1[0]-lp1[0])*(fp2[1]-lp2[1])-(fp1[1]-lp1[1])*(fp2[0]-lp2[0]));
					var y=((fp1[0]*lp1[1]-fp1[1]*lp1[0])*(fp2[1]-lp2[1])-(fp1[1]-lp1[1])*(fp2[0]*lp2[1]-fp2[1]*lp2[0]))/((fp1[0]-lp1[0])*(fp2[1]-lp2[1])-(fp1[1]-lp1[1])*(fp2[0]-lp2[0]));


					if( (x >= fp1[0] && x >= fp2[0]) && (x <= lp1[0] && x <= lp2[0] ) ){
						result.push([x,y]);
					}

					fp1 = lp1;
					fp2 = lp2;
				};

				return result;
			};
			return this;
		},

	}),

});


