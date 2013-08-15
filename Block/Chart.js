Presto_Block_Chart = XO.Block.extend({
	schematic : 'chart',


	render : function()
	{
		var self = this;

		console.log('working');

		this.model.onChange('title', function(){
			self.dom.title.text(self.model.get('title'));
		});

		_.each(this.model.get('columns'), function(columnData, columnName){
			console.log(columnData, columnName);

			var newColumn = new Presto_Block_ChartColumn(new XO.Model(columnData));
			newColumn.injectInto(self.dom.columnContainer);


		});


		return this;
	},









});


Presto_Block_ChartColumn = XO.Block.extend({

	schematic : 'chartColumn',


	render : function()
	{

		var self = this;

		this.model.onChange('title', function(){
			self.dom.title.text(self.model.get('title'));
		});

		var firstcell = $('<div></div>').appendTo(self.dom.cellContainer);

		firstcell.addClass('chart__cell');

		this.model.onChange('value', function(){
			firstcell.text(self.model.get('type').renderer(self.model.get('value'), firstcell));
		});




		return this;
	},


});