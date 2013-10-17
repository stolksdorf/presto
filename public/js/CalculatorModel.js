Presto_Model_Calculator = xo.model.extend({
	urlRoot : '/api/calculators',

	initialize : function()
	{
		var self = this;

		this.onChange('script', function(){
			self.execute();
		});
		return this;
	},

	execute : function()
	{
		var self = this;
		if(!this.script) return;

		eval("with (this) {var result = (" + this.script + ")}");

		_.each(['title','description', 'color', 'icon', 'group', 'keywords', 'id'], function(modelAttributeName){
			if(typeof result[modelAttributeName] !== 'undefined'){
				self.set(modelAttributeName, result[modelAttributeName]);
			}
		});

		this.trigger('execute', result);
		return result;
	},

	search : function(terms)
	{
		var self = this;
		if(typeof terms === 'string'){
			terms = [terms];
		}

		var contains = function(str, target){
			if(typeof str !== 'string'){ return false;}
			return str.toLowerCase().indexOf(target.toLowerCase()) !== -1;
		}

		var found = _.every(terms, function(term){
			return _.some(self.keywords, function(keyword){
				return contains(keyword, term);
			})	|| contains(self.title, term)
				|| contains(self.description, term)
				|| contains(self.group, term);
		});

		this.trigger('isMatched', found);
		return found;
	},

});


