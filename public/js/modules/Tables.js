Presto.registerModule({
	name   : 'tables',
	global : 'Tables',

	order : 200,

	initialize : function()
	{
		return this;
	},

	render : function(moduleData)
	{
		var self = this;

		this.tables = Presto.createBlocks({
			data      : moduleData,
			block     : this.TableBlock,
			container : $('#rightSide')
		});

		return this;
	},

	update : function()
	{
		_.each(this.tables, function(table){
			table.update();
		});
		return this;
	},

	remove : function()
	{
		_.each(this.tables, function(table){
			table.remove();
		})
		return this;
	},



	/**
	 * Blocks
	 */
	TableBlock : XO.Block.extend({
		schematic : 'table',

		render : function()
		{
			var self = this;


			this.dom.moreRowsButton.click(function(event){
				//if the user clicks on the textbox, doesn't fire the add rows event
				if(event.target.type === 'text'){
					event.stopPropagation();
					return false;
				}
				self.addRows(self.dom.moreRowsInput.val());
				self.update();
				//Scroll to bottom of table
				self.dom.columnContainer.scrollTop(self.dom.columnContainer[0].scrollHeight);
			});

			//Create Columns
			this.columns = Presto.createBlocks({
				data      : this.model.get('columns'),
				block     : Presto.modules.tables.ColumnBlock, //TODO: OH God fix this....
				container : this.dom.columnContainer
			});


			//BOTTOM VALUE
			/*
			var hasBottomGenerator = _.some(this.columns, function(column){
					return column.def.bottom; //FIX
			});
			if(hasBottomGenerator){
				_.each(this.columns, function(column){
					column.dom.bottom.show();
				});
			}
			*/

			this.addRows(this.model.get('rows') || 20);
			return this;
		},

		update : function()
		{
			var self = this;
			//update all the cells first
			Tables[this.name] = _.object(_.map(this.columns, function(column){
				column.update();
				return [column.name, column.cellValues];
			}));

			this.dom.title.text(_.evalue(this.model.get('title')));

			//then update the bottom values
			/*
			_.each(this.columns, function(column){
				Tables[self.name][column.name].bottom = column.updateBottom();
			});
			*/
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

	}),


	ColumnBlock : XO.Block.extend({
		schematic : 'tableColumn',
		render : function()
		{
			var self = this;
			this.cells = [];

			//this.dom.bottom.hide()
			//if(this.def.bottom) this.dom.bottom.show();
			return this;
		},

		addCells : function(count)
		{
			var self = this;
			_.times(count, function(index){
				//TODO : Create Cell block later
				var newCell = $('<div></div>').addClass('table__cell').appendTo(self.dom.cellContainer);

				//Highlight Cell
				newCell.click(function(){
					if(newCell.hasClass('highlight')){
						newCell.removeClass('highlight');
						return;
					}
					newCell.addClass('highlight');
				});
				self.cells.push(newCell);
			});
			return this;
		},

		update : function()
		{
			var self = this;
			var cellValue;
			this.cellValues = _.map(self.cells, function(cell, index){
				if(index === 0){
					cellValue = _.evalue(self.model.get('firstCell'));
				} else {
					cellValue = self.model.get('generator')(cellValue, index);
				}
				self.model.get('type').renderer(cellValue, cell);
				return cellValue;
			});

			this.dom.title.text(_.evalue(this.model.get('title')));

			return this;
		},
		/*
		updateBottom : function(){
			var self = this;
			var _val = typeof this.def.bottom === 'function' ? this.def.bottom() : this.def.bottom;

			self.def.type.renderer(_val, self.dom.bottom);
			return _val;
		},
		*/

	}),
});
