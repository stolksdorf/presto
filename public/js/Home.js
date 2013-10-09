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


		this.calculators = [];

		this.calculatorCollection = new XO.Collection([],{
			url   : '/api/calculator',
			model : Presto_Model_CalculatorBlueprint
		});

		this.calculatorCollection.on('add', function(calc) {
			self.addCalculator(calc);


			self.dom.container.isotope({
			  itemSelector : '.calculator',
			  layoutMode : 'fitRows'
			});
		});


		if(this.dom.newCalculatorButton){
			this.dom.newCalculatorButton.click(function(){
				self.calculatorCollection.addNew();
			});
		}


		var typingTimeout;
		this.dom.search.keydown(function(){
			self.dom.container.stop().fadeTo(300, 0.4)
			clearTimeout(typingTimeout);
			self.dom.searchIcon.hide();
			self.dom.searchingIcon.show();
			typingTimeout = setTimeout(function(){
					self.dom.container.stop().fadeTo(100, 1.0);
					self.dom.searchIcon.show();
					self.dom.searchingIcon.hide();


					self.search(self.dom.search.val());
			}, 500);
		});

		this.dom.container.isotope({
			itemSelector : '.calculator',
			layoutMode : 'fitRows'
		});

/*
		$.get('/api/calculator', function(result){
			console.log('yo', result);

			_.each(result, function(model){
				var newCalc = Presto_View_Calculator.create(model)
				self.calculators.push()


			});


		})
*/


		this.calculatorCollection.fetch(function(){
			console.log('finished fetch');
		});
		return this;
	},

	search : function(term)
	{
		var matchedItems = _.filter(this.calculators, function(calc){
			return calc.search(term);
		});

		this.dom.container.isotope({ filter: '.searched' });

		return this;
	},

	addCalculator : function(calculatorModel)
	{
		var newBlock = new Presto_Block_CalculatorOption(calculatorModel);
		newBlock.injectInto(this.dom.container);

		this.calculators.push(newBlock);

		//TODO: Do I need this?
		this.dom.container.isotope( 'addItems', newBlock.dom.block);

		this.dom.container.isotope({
		  itemSelector : '.calculator',
		  layoutMode : 'fitRows'
		});

		return this;


	},


});


/*
Presto_View_Calculator = xo_view.extend({
	schematic : 'calculator',

	initialize : function(model)
	{
		this.model = model;
		return this;
	},

	render : function()
	{

		this.dom.block.addClass(this.model.color);
		this.dom.title.text(this.model.title);
		this.dom.description.text(this.model.description);
		this.dom.icon.find('i').addClass(this.model.icon);
		this.dom.link.attr('href', this.model.url);

	},



	search : function(term)
	{
		if(Math.random() > 0.5){
			return true;
		}
		return false;
	},

});

*/


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

	search : function(term)
	{
		var self = this;
		this.dom.block.removeClass('searched');

		var contains = function(str, target){
			if(typeof str !== 'string'){
				return false;
			}
			return str.toLowerCase().indexOf(target.toLowerCase()) !== -1;
		}



		//check title
		if(contains(this.model.get('title'), term)){
			this.dom.block.addClass('searched');
			return true;
		}

		//check description
		if(contains(this.model.get('description'), term)){
			this.dom.block.addClass('searched');
			return true;
		}

		//check group
		if(contains(this.model.get('group'), term)){
			this.dom.block.addClass('searched');
			return true;
		}

		//check keywords
		_.each(this.model.get('keywords'), function(keyword){
			if(contains(keyword, term)){
				self.dom.block.addClass('searched');
			}
		});


		return false;
	},


});
