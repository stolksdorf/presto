Presto.registerModule({
	name      : 'charts',
	global    : 'Charts',

	drawOrder : 100,

	start : function()
	{
		this.charts =  this.createComponents({
			definition : this.definition,
			component  : this.components.chart,
			target     : Presto.getFlowPanel()  //TODO: Fix this
		});
		return this;
	},

	generate : function()
	{
		return _.keymap(this.charts, function(chart){
			return chart.generate();
		});
	},

	draw : function(data)
	{
		_.each(this.charts, function(chart){
			chart.draw(data[chart.name]);
		});
	},

	remove : function()
	{
		_.each(this.charts, function(chart){
			chart.remove();
		});
		return this;
	},

	registerComponents : function(module){
		return {
			chart : Presto_Component.extend({
				schematic : 'chart',

				start : function()
				{
					var self = this;
					if(this.definition.type === 'bar'){
						this.options = _.extend(module.options.bar, module.options.default);
					} else{
						this.options = _.extend(module.options.line, module.options.default);
					}

					this.tooltip = $('#chart__tooltip');


					//Resizing buttons
					this.dom.small.click(function(){
						self.dom.small.hide();
						self.dom.mini.show();
						self.dom.big.show();

						self.dom.graph.removeClass('mini');
						self.dom.graph.addClass('small_chart');
						self.draw();
					});

					this.dom.mini.click(function(){
						self.dom.small.show();
						self.dom.mini.hide();
						self.dom.big.show();

						self.dom.graph.toggleClass('mini');
					});

					this.dom.big.click(function(){
						self.dom.small.show();
						self.dom.mini.show();
						self.dom.big.hide();

						self.dom.graph.removeClass('mini');
						self.dom.graph.removeClass('small_chart');
						self.draw();
					}).hide();



					return this;
				},

				generate : function()
				{
					var self = this;
					var result = {}

					if(this.definition.table){
						result = this.getDataFromTable();
					}

					if(this.definition.series){
						result = _.keymap(this.definition.series, function(series, seriesName){
							return {
								label : _.evalue(series.label),
								data  : _.map(_.evalue(series.data), function(point, index){
									return [index, point];
								})
							}
						});
					}

					result.intercept = function(){
						return self.calculateIntercept.apply(self, arguments);
					};
					return result;
				},

				draw : function()
				{
					var self = this;
					this.dom.title.text(_.evalue(this.definition.title));


					if(this.definition.hover){
						this.addHover();
					}

					if(this.definition.breakeven){
						this.drawBreakevenLines(this.data);
					}

					//create flot data from data
					var chartData = _.reduce(this.data, function(result, series){
						if(series.label && series.data){
							result.push(series);
						}
						return result;
					}, []);
					$.plot(this.dom.graph, chartData, this.options);
				},

				getDataFromTable : function()
				{
					var tableValues = Presto.modules.tables.tables[this.definition.table].columns;
					var result = {};
					var xaxis = tableValues[0].generate();
					for(var i = 1; i< tableValues.length; i++){
						result[tableValues[i].name] = {
							label : _.evalue(tableValues[i].definition.title),
							data : _.map(tableValues[i].generate(), function(point, index){
								return [xaxis[index], point];
							})
						};
					}
					return result;
				},

				addHover : function()
				{
					var self = this;
					this.options.grid.hoverable = true;
					this.dom.graph.bind("plothover", function (event, pos, item) {
						if(item){
							var x  = Math.round(item.datapoint[0]);
							var y  = Math.round(item.datapoint[1]);
							var label  = item.series.label;

							self.tooltip
								.html(self.definition.hover(x,y,label))
								.css({
									top: item.pageY -25,
									left: item.pageX + 25
								})
								.show();
						} else {
							self.tooltip.hide();
						}
					});
					return this;
				},

				drawBreakevenLines : function(data)
				{
					var lines = _.evalue(this.definition.breakeven);
					var markings = [];
					_.each(lines, function(seriesPair){
						var intercepts = data.intercept(seriesPair[0], seriesPair[1]);
						_.each(intercepts, function(intercept){
							markings.push({ color: '#000', lineWidth: 2, yaxis: { from: intercept.y, to: intercept.y } })
						});
					});
					this.options.grid.markings = markings;
					return this;
				},

				calculateIntercept : function(seriesName1, seriesName2){
					if( (!this.data[seriesName1] && typeof seriesName1 === 'string') ||
						(!this.data[seriesName2] && typeof seriesName2 === 'string')) return [];

					var series1 = this.data[seriesName1],
						series2 = this.data[seriesName2];

					//Creates a static dataset from a single number
					var makeNumberedDataSet = function(series, num){
						series1 = series;
						series2 = {
							label : 'Intercept ' + num,
							data : []
						};
						_.times(series1.data.length, function(idx){
							series2.data.push([series1.data[idx][0], num]);
						});
					}

					//check for number only series
					if(typeof seriesName1 !== 'number' && typeof seriesName2 === 'number'){
						makeNumberedDataSet(series1, seriesName2);
					}

					if(typeof seriesName2 !== 'number' && typeof seriesName1 === 'number'){
						makeNumberedDataSet(series2, seriesName1);
					}

					var smallSetLength = series1.data.length > series2.data.length ? series2.data.length : series1.data.length;
					var fp1 = series1.data[0];
					var fp2 = series2.data[0];
					var result = [];
					for(var i = 1; i < smallSetLength; i++){
						var lp1 = series1.data[i];
						var lp2 = series2.data[i];
						var x=((fp1[0]*lp1[1]-fp1[1]*lp1[0])*(fp2[0]-lp2[0])-(fp1[0]-lp1[0])*(fp2[0]*lp2[1]-fp2[1]*lp2[0]))/((fp1[0]-lp1[0])*(fp2[1]-lp2[1])-(fp1[1]-lp1[1])*(fp2[0]-lp2[0]));
						var y=((fp1[0]*lp1[1]-fp1[1]*lp1[0])*(fp2[1]-lp2[1])-(fp1[1]-lp1[1])*(fp2[0]*lp2[1]-fp2[1]*lp2[0]))/((fp1[0]-lp1[0])*(fp2[1]-lp2[1])-(fp1[1]-lp1[1])*(fp2[0]-lp2[0]));
						if( (x >= fp1[0] && x >= fp2[0]) && (x <= lp1[0] && x <= lp2[0] ) ){
							result.push({x:x,y:y});
						}
						fp1 = lp1;
						fp2 = lp2;
					};
					return result;
				}
			})
		}
	},


	//Flot Options
	options : {
		default : {
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

		line : {
			series: {
				lines : { show: true },
				points: { show: false }
			}
		},

		bar : {
			series: {
				stack : true,
				bars : {
					show: true,
					barWidth : 0.6
				},
				points: { show: false }
			}
		}
	},

});

