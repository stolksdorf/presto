Presto_Model_Calculator = xo.model.extend({
	URL : '/api/calculators',

	initialize : function()
	{
		var self = this;

		this.onChange('script', _.async(function(){
			self.execute();
		}));
		return this;
	},

	execute : function()
	{
		var self = this,
			result = {};
		if(!this.script) return;

		eval("with (this) {var result = (" + this.script + ")}");

		//Extract the calculator info from the script and update the model
		_.each(result.info, function(value, keyName){
			self.set(keyName, value);
		});

		if(result.info){
			if(!result.info.url){
				//default the url of the calculator to the id
				this.set('url', self.id);
			}
			if(!result.info.dev){
				self.set('dev', false);
			}
		}

		//this.trigger('execute', result);
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

		//Search through the title, description, group and keywords to match each term
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



