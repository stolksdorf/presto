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

		this.block = Presto_Block_Home.create();
		this.block.bindToView();
		return this;
	},


}


Presto_Block_Home = xo.view.extend({
	view : 'home',

	render : function()
	{
		var self = this;


		this.calculators = xo.collection.extend({model : Presto_Calculator });

		this.calculators.on('add', function(calc){
			self.addCalculator(calc);
		});



		if(this.dom.newCalculatorButton){
			this.dom.newCalculatorButton.click(function(){
				self.calculators.add().save();
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


					self.search(self.dom.search.val().split(' '));
			}, 500);
		});

		this.dom.container.isotope({
			itemSelector : '.calculator',
			layoutMode : 'fitRows'
		});


		this.calculators.fetch();
		return this;
	},

	search : function(terms)
	{
		var matchedItems = _.filter(this.calculators, function(calc){
			return calc.search(terms);
		});

		console.log(matchedItems);

		this.dom.container.isotope({ filter: '.matched' });

		return this;
	},

	addCalculator : function(calculatorModel)
	{
		var self = this;
		//var newBlock = new Presto_Block_CalculatorOption(calculatorModel);
		var newCalc = Presto_Block_CalculatorOption.create(calculatorModel);


		console.log(newCalc);

		newCalc.on('remove', function(){
			self.dom.container.isotope( 'remove', newCalc.dom.block);
		})

		newCalc.injectInto(this.dom.container);


		this.dom.container.isotope( 'addItems', newCalc.dom.block);
		this.dom.container.isotope({
		  itemSelector : '.calculator',
		  layoutMode : 'fitRows'
		});

		return this;


	},


});

Presto_Block_CalculatorOption = xo.view.extend({
	schematic : 'calculator',

	render : function()
	{
		var self = this;

		this.model.onChange({
			color : function(color){
				self.dom.block.addClass(color);
			},
			title : function(title){
				self.dom.title.text(title);
			},
			description : function(description){
				self.dom.description.text(description);
			},
			icon : function(icon){
				self.dom.icon.find('i').addClass(icon);
			},
			id : function(id){
				self.dom.link.attr('href', '/calc/' + id);
			},
		});

		if(this.dom.deleteBtn){
			this.dom.deleteBtn.click(function(event){
				event.preventDefault();
				var temp = confirm("Are you sure you want to delete this calculator?");
				if(temp){
					self.model.delete();
					self.remove();
				}
			});
		}

		this.model.on('isMatched', function(isMatched){
			if(isMatched){
				self.dom.block.addClass('matched');
			} else {
				self.dom.block.removeClass('matched');
			}
		});

		return this;
	},

/*
	search : function(terms)
	{
		var self = this;

		if(typeof terms === 'string'){
			terms = [terms];
		}

		this.dom.block.removeClass('matched');

		var contains = function(str, target){
			if(typeof str !== 'string'){
				return false;
			}
			return str.toLowerCase().indexOf(target.toLowerCase()) !== -1;
		}

		var found = _.every(terms, function(term){
			//check title
			if(contains(self.model.get('title'), term)){
				return true;
			}

			//check description
			if(contains(self.model.get('description'), term)){
				return true;
			}

			//check group
			if(contains(self.model.get('group'), term)){
				return true;
			}

			//check keywords
			return _.some(self.model.get('keywords'), function(keyword){
				return contains(keyword, term);
			});
		});

		if(found){
			this.dom.block.addClass('matched');
		}


		return false;
	},
	*/


});
