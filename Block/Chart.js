Presto_Block_Chart = XO.Block.extend({
	schematic : 'chart',


	render : function()
	{
		var self = this;

		this.columns = [];


		this.model.onChange('title', function(){
			self.dom.title.text(self.model.get('title'));
		});

		_.each(this.model.get('columns'), function(columnData, columnName){

			var tempModel = new XO.Model(columnData);
			tempModel.set('name', columnName);


			var newColumn = new Presto_Block_ChartColumn(tempModel);
			newColumn.injectInto(self.dom.columnContainer);
			self.columns.push(newColumn);

		});


		return this;
	},


	makeRows : function(count)
	{
		_.each(this.columns, function(columnBlock){
			columnBlock.makeRows(count);
		});

		this.genEnvrio();
		return this;
	},

	genEnvrio : function()
	{
		var self = this;
		Chart = {};
		_.each(this.columns, function(columnBlock){
			Chart[columnBlock.model.get('name')] = columnBlock.rowVals;

			//Modify the array prototype instead
			Chart[columnBlock.model.get('name')].sum = function(){
				var result = 0;
				for(var i = 0; i<this.length;i++){
					result += this[i];
				}
				return result;
			};
			Chart[columnBlock.model.get('name')].find = function(fn){
				for(var i = 0; i<this.length;i++){
					if(fn(i, this[i])) return this[i];
				}
			};
		});
		return this;
	}


});


Presto_Block_ChartColumn = XO.Block.extend({

	schematic : 'chartColumn',


	render : function()
	{
		var self = this;

		this.model.onChange('title', function(){
			self.dom.title.text(self.model.get('title'));
		});

		return this;
	},

	makeRows : function(numOfRows)
	{
		var self = this;
		self.dom.cellContainer.html("");

		this.rowVals = [];


		//Add the rendering to this
		var makeCell = function(value){
			var temp = $('<div></div>').addClass('chart__cell');
			return temp.html(self.model.get('type').renderer(value, temp));
		};

		var val = this.model.get('value');

		if(typeof val === 'function'){
			val = val();
		}

		var fn = this.model.get('fn');

		//generate the first cell
		self.dom.cellContainer.append(makeCell(val));

		this.rowVals.push(val);

		_.times(numOfRows, function(index){
			val = fn(index,val);
			self.rowVals.push(val);
			self.dom.cellContainer.append(makeCell(val));
		});




		return this;
	},


});






