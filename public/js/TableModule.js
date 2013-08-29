Presto_Module_Table = XO.Block.extend({
	schematic : 'tableContainer',

	initialize : function(def, calcModel)
	{
		this.model = calcModel;
		this.def = def;

		Tables = {};

		this._setup();
		return this;
	},

	render : function()
	{
		var self = this;
		this.tables = makeViews(this.def, Presto_Block_Table, this.model, self.dom.block)
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


Presto_Block_Table = XO.Block.extend({
	schematic : 'table',

	render : function()
	{
		var self = this;
		this.dom.title.text(this.def.title);

		this.columns = makeViews(
			this.def.columns,
			Presto_Block_TableColumn,
			this.model,
			this.dom.columnContainer
		);
		this.addRows(this.def.rows || 20);
		return this;
	},

	addRows : function(count)
	{
		var self = this;
		_.each(this.columns, function(column){
			column.addCells(count);
		});
		return this;
	},

	update : function()
	{
		var self = this;
		Tables[self.name] = _.object(_.map(this.columns, function(column){
			column.update();
			return [column.name, column.cellValues];
		}));
		return this;
	},

});



Presto_Block_TableColumn = XO.Block.extend({
	schematic : 'tableColumn',

	render : function()
	{
		var self = this;
		self.cells = [];
		this.dom.title.text(this.def.title);
		return this;
	},

	addCells : function(count)
	{
		var self = this;
		_.times(count, function(index){
			self.cells.push($('<div></div>').addClass('table__cell').appendTo(self.dom.cellContainer));
		});
		return this;
	},

	update : function()
	{
		var self = this;
		var _val;
		this.cellValues = _.map(self.cells, function(cell, index){
			if(index === 0){
				_val = self.def.firstCell
				if(typeof self.def.firstCell === 'function'){
					_val = self.def.firstCell()
				}
			} else {
				_val = self.def.generator(_val, index);
			}
			self.def.type.renderer(_val, cell);
			return _val;
		});

		return this;
	},
});


