
/**
 * This is what get fecthed and uploaded to the server
 * contains the blueprint for generating the actual Calculator Model
 * @type {[type]}
 */
Presto_Model_CalculatorBlueprint = XO.Model.extend({
	/* Attributes
		id
		title
		description
		icon
		color
		script
		url
	*/

	urlRoot : '/api/calculator',
	defaults : {
		title       : 'Cool newness',
		description : 'Click here to edit the calculator',
		icon        : 'icon-question',
		color       : 'silver',
		script      : "{title:'test'}",
		url         : ''
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
		//make sure the model is updated
		this.executeScript();

		this.log();

		this.save({
			success  : function(model, response, options){
				console.log('ah yis', response);
			},
			error : function(model, response, options){
				console.log('oh no!', response);
			},
		});
		return this;
	},


	/**
	 * Executes the current script and triggers out the resultant object
	 * @return {[type]} [description]
	 */
	executeScript : function()
	{
		var self = this;
		try{
			eval("with (this) {var result = (" + this.get('script') + ")}");
		} catch(e){
			console.log('ERROR');
			self.trigger('error', e.toString());
			return '';
		}


		//update model from result
		_.each(['title','description', 'color', 'icon'], function(modelAttributeName){
			if(typeof result[modelAttributeName] !== 'undefined'){
				self.set(modelAttributeName, result[modelAttributeName]);
			}
		});

		return result;
	},


});





/**
 * Contains the definitions for the various Presto modules to run
 * also contains the current live data
 * should have triggers for when inputs change
 * should have a update function to update the calculator view
 *
 * contains sub-models and collections for inputs, charts, tables, outputs.
 *
 * @type {[type]}
 */
Presto_Model_Calculator = XO.Model.extend({


	initialize : function()
	{

		//listen for when the execute script fires,
		//update self with data model


		//set listeners for when inputs change

		return this;
	},



	//loops through all the inputs, builds all charts and tables and outputs, updates globals
	update : function()
	{

		return this;
	},


});