PrestoHome = xo.view.extend({
	view : 'home',

	render : function()
	{
		var self = this;

		this.calculatorCollection = xo.collection.extend({model : Presto_Model_Calculator });

		this.calculatorCollection.on('add', function(calc){
			var newCalc = Presto_Block_CalculatorOption.create(calc);
			newCalc.on('remove', function(){
				self.dom.container.isotope( 'remove', newCalc.dom.view);
			});

			newCalc.injectInto(self.dom.container);
			self.dom.container.isotope('addItems', newCalc.dom.view);
			self.dom.container.isotope({
				itemSelector : '.calculator',
				layoutMode : 'masonry'
			});
		});

		if(this.dom.newCalculatorButton){
			this.dom.newCalculatorButton.click(function(){
				self.calculatorCollection.add().save();
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

		this.calculatorCollection.fetch();

		this.dom.container.isotope({
			itemSelector : '.calculator',
			layoutMode : 'masonry'
		});

		return this;
	},

	search : function(terms)
	{
		var matchedItems = _.filter(this.calculatorCollection.models, function(calc){
			return calc.search(terms);
		});

		this.dom.container.isotope({ filter: '.matched' });
		return this;
	},

});

Presto_Block_CalculatorOption = xo.view.extend({
	schematic : 'calculator',

	initialize : function()
	{
		var self = this;
		return this;
	},

	render : function()
	{
		var self = this;

		this.model.onChange({
			color : function(color){
				self.dom.view.addClass(color);
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
			url : function(url){
				self.dom.link.attr('href', '/calc/' + url);
			},

			dev : function(){
				self.renderBadges()
			},
			tiers : function(){
				self.renderBadges()
			},
		});

		this.model.on('isMatched', function(isMatched){
			if(isMatched){
				self.dom.view.addClass('matched');
			} else {
				self.dom.view.removeClass('matched');
			}
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

		return this;
	},

	renderBadges : function(){
		if(this.model.dev){                         return this.dom.devBadge.show(); }
		if(_.contains(this.model.tiers, 'beta')){   return this.dom.betaBadge.show(); }
		if(_.contains(this.model.tiers, 'gold')){   return this.dom.goldBadge.show(); }
		if(_.contains(this.model.tiers, 'silver')){ return this.dom.silverBadge.show(); }
		return this;
	},

});
