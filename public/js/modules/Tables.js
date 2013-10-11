Presto.registerModule({
	name      : 'tables',
	global    : 'Tables',

	drawOrder : 200,

	start : function()
	{
		this.tables =  this.createComponents({
			definition : this.definition,
			component  : this.components.table,
			target     : Presto.getFlowPanel()  //TODO: Fix this
		});
		return this;
	},

	generate : function()
	{
		return _.keymap(this.tables, function(table){
			return table.generate();
		});
	},

	draw : function(data)
	{
		_.each(this.tables, function(table){
			table.draw(data[table.name]);
		});
	},

	remove : function()
	{
		_.each(this.tables, function(table){
			table.remove();
		});
		return this;
	},

	registerComponents : function(module){
		return {
			table : Presto_Component.extend({
				schematic : 'table',

				start : function()
				{
					var self = this;
					this.columns = this.createComponents({
						definition : this.definition.columns,
						component  : module.components.column,
						target     : this.dom.columnContainer,
						as_array   : true
					});

					this.definition.rows = this.definition.rows || 20;


					this.dom.moreRowsButton.click(function(event){
						//if the user clicks on the textbox, doesn't fire the add rows event
						if(event.target.type === 'text'){
							event.stopPropagation();
							return false;
						}
						self.generate(self.rowCount + self.dom.moreRowsInput.val()*1);
						self.draw();
						//Scroll to bottom of table
						self.dom.columnContainer.scrollTop(self.dom.columnContainer[0].scrollHeight);
					});


					this.dom.downloadCSV.click(function(){
						window.location = '/csv/' + self.definition.title +
							 '.csv?data=' + JSON.stringify(self.getCSV());
					});


					return this;
				},

				generate : function(rowCount)
				{
					var self = this;
					this.rowCount = Math.ceil(rowCount || _.evalue(this.definition.rows));
					return _.reduce(this.columns, function(result, column){
						column.rowCount = self.rowCount;
						result[column.name] = column.generate();
						return result;
					}, {});
				},

				draw : function()
				{
					var self = this;
					this.dom.title.text(_.evalue(this.definition.title));
					_.each(this.columns, function(column){
						column.draw(self.data[column.name]);
					});

					if(this.dom.columnContainer.height() < this.columns[0].dom.block.height()){
						this.dom.columnContainer.css({"overflow-y" : "scroll"});
					} else {
						this.dom.columnContainer.css({"overflow-y" : "hidden"});
					}
				},

				getCSV : function()
				{
					return _.zip.apply(_, _.map(this.columns, function(column){
						return _.flatten([column.definition.title, column.data], true);
					}));
				},
			}),


			column : Presto_Component.extend({
				schematic : 'tableColumn',

				start : function()
				{
					return this;
				},

				generate : function(numCells)
				{
					var self = this;
					numCells = Math.ceil(numCells || this.rowCount);
					var result =[_.evalue(this.definition.firstCell)];
					_.times(numCells - 1, function(index){
						result.push(self.definition.generator(result[index], index + 1));
					});
					return makeGeneratorArray(result);
				},

				draw : function()
				{
					var self = this;
					this.clearCells();

					_.each(this.data, function(val){
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

