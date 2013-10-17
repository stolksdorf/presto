
/**
 * This is what get fecthed and uploaded to the server
 * contains the blueprint for generating the actual Calculator Model

Presto_Model_CalculatorBlueprint = XO.Model.extend({
	urlRoot : '/api/calculators',

	upload : function(callback)
	{
		var self = this;
		//make sure the model is updated
		this.execute(function(){
			self.save({},{
				success  : function(model, response, options){
					if(callback){
						callback(response);
					}
				},
				error : function(model, response, options){
					throw 'Error uploading to server';
				}
			});
		});
		return this;
	},

	retrieve : function(callback)
	{
		var self = this;
		console.log('retrieve');
		$.get(this.urlRoot + '/' + this.get('id'), function(response){
			self.set(response);
			self.execute();
		});
		return this;
	},


	execute : function(callback)
	{
		var self = this;

		eval("with (this) {var result = (" + this.get('script') + ")}");

		//update from result
		_.each(['title','description', 'color', 'icon', 'group', 'keywords'], function(modelAttributeName){
			if(typeof result[modelAttributeName] !== 'undefined'){
				self.set(modelAttributeName, result[modelAttributeName]);
			}
		});

		if(typeof callback === 'function'){
			callback(result);
		}

		this.trigger('execute', result);
		return result;
	},

});
*/



























Presto_Model_Blueprint = xo.model.extend({
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

		_.each(['title','description', 'color', 'icon', 'group', 'keywords'], function(modelAttributeName){
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



