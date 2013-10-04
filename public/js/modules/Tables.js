Presto.registerModule({
	name      : 'tables',
	global    : 'Tables',

	initialize : function(def)
	{
		this.tables =  this.createComponents({
			definition : def,
			component  : this.components.table,
			target     : Presto.getFlowPanel()  //TODO: Fix this
		});
		return this;
	},

	generate : function(def)
	{
		return _.keymap(this.tables, function(table){
			return table.generate();
		});
	},

	draw : function(def, data)
	{
		_.each(this.tables, function(table){
			table.draw(data[table.name]);
		});
	},

	registerComponents : function(module){
		return {
			table : Presto_Component.extend({
				schematic : 'table',

				initialize : function()
				{
					var self = this;
					this.columns = this.createComponents({
						definition : this.definition.columns,
						component  : module.components.column,
						target     : this.dom.columnContainer,
						as_array   : true
					});
					return this;
				},

				generate : function()
				{
					var rowCount = _.evalue(this.definition.rows);
					return _.reduce(this.columns, function(result, column){
						column.rowCount = rowCount;
						result[column.name] = column.generate();
						return result;
					}, {});
				},

				draw : function(data)
				{
					this.dom.title.text(_.evalue(this.definition.title));
					_.each(this.columns, function(column){
						column.draw(data[column.name]);
					});
				},
			}),


			column : Presto_Component.extend({
				schematic : 'tableColumn',

				initialize : function()
				{
					return this;
				},

				generate : function(numCells)
				{
					var self = this;
					numCells = numCells || this.rowCount;
					var result =[_.evalue(this.definition.firstCell)];
					_.times(numCells - 1, function(index){
						result.push(self.definition.generator(result[index], index + 1));
					});
					return makeGeneratorArray(result);
				},

				draw : function(data)
				{
					var self = this;
					this.clearCells();

					_.each(data, function(val){
						self.addCell(val);
					})

					this.dom.title.text(_.evalue(this.definition.title));

					return this;
				},

				clearCells : function()
				{
					this.cells = [];
					this.dom.cellContainer.html("");
					return this;
				},

				addCell : function(val)
				{
					var newCell = $('<div></div>').addClass('table__cell').appendTo(this.dom.cellContainer);
					this.definition.type.renderer(val, newCell);

					//Highlight Cell
					newCell.click(function(){
						newCell.toggleClass('highlight');
					});

					this.cells.push(newCell);
					return this;
				}
			})
		}
	}

});

