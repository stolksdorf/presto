

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
		var self = this;

		//listen for when the execute script fires,
		//update self with data model


		//set listeners for when inputs change

		return this;
	},



	//loops through all the inputs, builds all charts and tables and outputs, updates globals
	update : function()
	{

		this.trigger('update');

		return this;
	},


});