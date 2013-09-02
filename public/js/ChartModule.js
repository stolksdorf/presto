Presto_Module_Chart = XO.Block.extend({
	schematic : 'chart',

	initialize : function(def, calcModel)
	{
		this.model = calcModel;
		this.def = def;

		Charts = {};

		this._setup();
		return this;
	},

	render : function()
	{
		var self = this;

		$.plot(this.dom.graph, [ [[0, 0], [1, 1]] ], { yaxis: { max: 1 } });

		return this;
	},

	//called whnever the calcualtor wants to update with new data
	update : function()
	{
		_.each(this.tables, function(table){
			table.update();
		});
		return this;
	},

});
