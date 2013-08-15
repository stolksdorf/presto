Presto_Block_Input = XO.Block.extend({
	schematic : 'input',

	render : function()
	{
		var self = this;


		this.widget = this.dom.value.widget({
			value : this.model.get('value'),
			renderer : this.model.get('type').renderer,
			onChange : function(newVal){
				if(self.model.get('type').isNumerical){
					newVal = newVal * 1;
				}
				self.model.set('value', newVal);
			},
		});


		this.model.onChange('value', function(){
			self.widget.value(self.model.get('value'));
		});

		this.model.onChange('title', function(){
			self.dom.title.text(self.model.get('title'));
		});
		this.model.onChange('description', function(){
			if(!self.model.get('description')){
				self.dom.description.hide();
				return;
			}
			self.dom.description.text(self.model.get('description'));
		});



		return this;
	},

});




Presto_Block_Input_Text = XO.Block.extend({
	schematic : 'input_text',

	render : function()
	{
		var self = this;
		this.dom.title.text('whatever');
		this.dom.value.val('whatever');

		this.dom.value.change(function(){
			console.log(self.dom.value.val());
		})

		return this;
	},

});




Presto_Block_Chart = XO.Block.extend({
	block : 'chart',

	render : function()
	{
		this.columns = [];


		return this;
	},

	addColumn : function(columnModel)
	{


		var newColumn = new Presto_Block_Column(columnModel);
		newColumn.start($('<th></th>').appendTo(this.dom.head),
						$('<td></td>').appendTo(this.dom.foot));


		this.columns.push(newColumn);

		return this;
	},

	addRow : function(number)
	{
		var self = this;
		_.times(number||1, function(){
			var newRowElement = $('<tr></tr>').appendTo(self.dom.body);
			_.each(self.columns, function(column){
				column.addCell($('<td></td>').appendTo(newRowElement));
			});
		});

		return this;
	},


})


Presto_Block_Column = XO.Block.extend({

	start : function(headCell, footCell)
	{
		var self = this;

		this.dom.cells = [];
		this.values = [this.model.get('start')];

		this.model.onChange('start', function(){
			self.reset();
		});
		this.model.onChange('fn', function(){
			self.reset();
		});

		this.dom.headCell = headCell;
		this.model.onChange('name', function(){
			self.dom.headCell.text(self.model.get('name'));
		});

		this.dom.footCell = footCell;
		this.model.onChange('foot', function(){
			if(!self.model.get('foot')) {
				//self.dom.footCell.hide();
			} else {
				self.dom.footCell.text(self.model.get('foot')).show();
			}

		});

		return this;
	},

	addCell : function(cellElement)
	{
		if(this.dom.cells.length === 0){
			cellElement.text(this.model.get('start'));
			this.dom.cells.push(cellElement)
			return this;
		}
		this.values.push(this.model.get('fn')(this.values.last()));

		cellElement.text(this.values.last());
		this.dom.cells.push(cellElement)

		return this;
	},

	reset : function()
	{
		if(!this.dom.cells.length) return;
		this.dom.cells[0].text(this.model.get('start'));
		var prev = this.model.get('start');
		for(var i = 1; i<this.dom.cells.length; i++){
			prev = this.model.get('fn')(prev);
			this.dom.cells[i].text(prev);
		}
		return this;
	},


})