PrestoHome = {

	start : function()
	{
		var self = this
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


		this.dom.newCalculatorButton.click(function(){
			self.calculatorCollection.addNew();
		});
		if(document.URL.indexOf('beta') !== -1){
			this.dom.newCalculatorButton.hide();
		}

		this.calculatorCollection.fetch();
		return this;
	},

	addCalculator : function(calculatorModel)
	{
		//TODO: Remove later out of beta
		if(document.URL.indexOf('beta') !== -1){
			calculatorModel.set('url', calculatorModel.get('url') + '?beta');
		}
		var newBlock = new Presto_Block_CalculatorOption(calculatorModel);
		newBlock.injectInto(this.dom.container, {at_top:true});
		return this;
	},


});



Presto_Block_CalculatorOption = XO.Block.extend({
	schematic : 'calculator',

	render : function()
	{
		var self = this;
		console.log('model', this.model);

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

		this.dom.deleteBtn.click(function(event){
			event.preventDefault();
			var temp = confirm("Are you sure you want to delete this calculator?");
			if(temp){
				self.model.destroy();
				self.remove();
			}
		});

		//TODO: Remove later out of beta
		if(document.URL.indexOf('beta') !== -1){
			this.dom.deleteBtn.hide()
		}

		return this;
	},


});
