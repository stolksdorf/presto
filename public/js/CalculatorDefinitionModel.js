Presto_Model_CalcDefinition = XO.Model.extend({
	/* Attributes
		id
		title
		description
		icon
		color
		script
		url
	*/

	initialize : function()
	{
		var self = this;

		//whenever the script uploads, run script to model to update self
		//fire execute script exposes to new data object


		return this;
	},

	uploadToServer : function()
	{

		return this;
	},


	/**
	 * Executes the current script and triggers out the resultant object
	 * @return {[type]} [description]
	 */
	executeScript : function()
	{
		var self = this;
		eval("with (this) {var result = (" + this.get('script') + ")}");

		//update model from result
		_.each(['title','description', 'color', 'icon'], function(modelAttributeName){
			if(typeof result[modelAttributeName] !== 'undefined'){
				self.set(modelAttributeName, result[modelAttributeName]);
			}
		});



		//fire event with result
		this.trigger('runScript', result);
		return this;
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
Presto_Model_CalcBlueprint = XO.Model.extend({


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