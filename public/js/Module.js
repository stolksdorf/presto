/*
`
	This is where I'm keeping all my ideas for the module object


	addViewPort
		Decide tile size here

	addView({
		html : html to inject
		render : fn that fires after the view has been added
		update : fn that fire whenever the calc wants to update
	})


	addGlobal
		add/updates a the alloted Global for this module

	moduleDefinition
		Raw object from the PML



*/

Presto_Module = Archetype.extend({

	//Called when the module is registered
	initialize : function()
	{

		return this;
	},

	//Called when the calculator definition has been updated
	render : function()
	{

		return this;
	},


	//Called when the calculator data has been updated
	update : function()
	{

		return this;
	},

/*
	addViews : function(collection, Block, Model, injectionPoint){
		return _.map(collection, function(def, name){
			var newView = new Block(Model);
			newView.name = name;
			newView.def = def;
			newView.injectInto(injectionPoint);
			return newView;
		});
	},
*/


	//Cleans up all globals and UI
	remove : function()
	{
		return this;
	},





});


/**
 * Adding a new module test
 *

Presto.addModule('tables', {
	global : 'tables',

	initialize : function()
	{

		this.addView({
			name : 'newView',
			injectionPoint : Presto.views.left,
			html : link_to_schematic,
			render : function(model)
			{

				return this;
			}
		});



		return this;
	},



})

*/