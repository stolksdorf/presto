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

		//check for bottom value definitions
		hasBottom = _.reduce(this.columns, function(memo, column){
				if(column.def.bottom) return true;
				return memo;
		}, false);
		if(hasBottom){
			_.each(this.columns, function(column){
				column.dom.bottom.show();
			});
		}

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

		//update all the cells first
		Tables[self.name] = _.object(_.map(this.columns, function(column){
			column.update();
			return [column.name, column.cellValues];
		}));

		//then update the bottom values
		_.each(this.columns, function(column){
			Tables[self.name][column.name].bottom = column.updateBottom();
		});

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

		//this.dom.bottom.hide()
		//if(this.def.bottom) this.dom.bottom.show();
		return this;
	},

	addCells : function(count)
	{
		var self = this;
		_.times(count, function(index){
			var newCell = $('<div></div>').addClass('table__cell').appendTo(self.dom.cellContainer);
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

	updateBottom : function(){
		var self = this;
		var _val = typeof this.def.bottom === 'function' ? this.def.bottom() : this.def.bottom;

		self.def.type.renderer(_val, self.dom.bottom);
		return _val;
	}
});


