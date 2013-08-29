
/**
 * This is what get fecthed and uploaded to the server
 * contains the blueprint for generating the actual Calculator Model
 */
Presto_Model_CalculatorBlueprint = XO.Model.extend({
	urlRoot : '/api/calculator',
	defaults : {
		title       : 'New Calculator',
		description : 'Click here to edit',
		icon        : 'icon-question',
		color       : 'silver',
		script      : "{\n  title       : 'New Calculator',\n  description : 'Click to edit',\n  icon        : 'icon-question',\n  color       : 'silver',\n\n  inputs : {\n    capital : {\n      title : 'Capital',\n      description : 'How much money ya got',\n      type  : Type.Money,\n      initialValue : 500\n    },\n    age : {\n      title : 'Age',\n      type  : Type.Number,\n      initialValue : 25\n    }\n  },\n\n  tables : {\n    sample : {\n      title : 'Sample Chart',\n      columns : {\n        age : {\n          title : 'Age',\n          type : Type.Number,\n          firstCell : function(){\n            return Inputs.age;\n          },\n          generator : function(index, previousCellValue){\n            return previousCellValue + 1;\n          }\n        },\n        capitalDelta : {\n          title : 'Capital Change',\n          type  : Type.Money,\n          firstCell : function(){\n            return Inputs.capital;\n          },\n          generator : function(index, previousCellValue){\n            return previousCellValue + Math.random()*100;\n          }\n        },\n      }\n    }\n  },\n  outputs : {\n    breakeven : {\n      title : 'Break-even Age',\n      description : 'Age at which you made 10% of your initial capital',\n      type : Type.Number,\n      value : function(){\n        var breakEvenAge = Tables.sample.age.find(function(index, age){\n          if(Tables.sample.capitalDelta[index] > Inputs.capital * 1.10){\n            return true;\n          }\n          return false;\n        });\n        return breakEvenAge;\n      }\n    }\n  }\n}\n"
	},

	initialize : function()
	{
		var self = this;

		//whenever script change, pull out new changes?

		//OR whenever upload, pull out the new changes


		return this;
	},

	uploadToServer : function()
	{
		var self = this;
		//make sure the model is updated
		this.executeScript(function(){
			self.save({},{
				success  : function(model, response, options){
					self.trigger('uploaded', response);
				},
				error : function(model, response, options){
					throw response;
				}
			});
		});
		return this;
	},


	/**
	 * Executes the current script and triggers out the resultant object
	 * @return {[type]} [description]
	 */
	executeScript : function(callback)
	{
		var self = this;
		eval("with (this) {var result = (" + this.get('script') + ")}");

		//update model from result
		_.each(['title','description', 'color', 'icon'], function(modelAttributeName){
			if(typeof result[modelAttributeName] !== 'undefined'){
				self.set(modelAttributeName, result[modelAttributeName]);
			}
		});

		if(typeof callback === 'function'){
			callback(result);
		}

		return result;
	},


});



