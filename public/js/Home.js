PrestoHome = {

	start : function(opts)
	{
		var self = this;

		this.options = opts;
		$(document).ready(function(){
			self.render();
		});
		return this;
	},

	render : function()
	{
		var self = this;

		this.block = Presto = new Presto_Block_Home();
		return this;
	},


}


Presto_Block_Home = XO.Block.extend({
	block : 'home',

	render : function()
	{
		var self = this;

		this.calculatorCollection = new XO.Collection([],{
			url   : '/api/calculator',
			model : Presto_Model_CalculatorBlueprint
		});

		this.calculatorCollection.on('add', function(calc) {
			self.addCalculator(calc);
		});


		if(this.dom.newCalculatorButton){
			this.dom.newCalculatorButton.click(function(){
				self.calculatorCollection.addNew();
			});
		}

		this.calculatorCollection.fetch();
		return this;
	},

	addCalculator : function(calculatorModel)
	{
		var newBlock = new Presto_Block_CalculatorOption(calculatorModel);
		newBlock.injectInto(this.dom.container);
		return this;
	},


});



Presto_Block_CalculatorOption = XO.Block.extend({
	schematic : 'calculator',

	render : function()
	{
		var self = this;

		this.model.onChange('color', function(){
			self.dom.block.addClass(self.model.get('color'));
		});
		this.model.onChange('title', function(){
			self.dom.title.text(self.model.get('title'));
		});
		this.model.onChange('description', function(){
			self.dom.description.text(self.model.get('description'));
		});
		this.model.onChange('icon', function(){
			self.dom.icon.find('i').addClass(self.model.get('icon'));
		});
		this.model.onChange('url', function(){
			self.dom.link.attr('href', self.model.get('url'));
		});

		if(this.dom.deleteBtn){
			this.dom.deleteBtn.click(function(event){
				event.preventDefault();
				var temp = confirm("Are you sure you want to delete this calculator?");
				if(temp){
					self.model.destroy();
					self.remove();
				}
			});
		}

		return this;
	},


});
