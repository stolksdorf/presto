/*

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




	/**
	 * Called whenever the module needs to update it's global references
	 * @return {[type]} [description]
	 */
	update : function()
	{

		return this;
	},


	addViews : function(collection, Block, Model, injectionPoint){
		return _.map(collection, function(def, name){
			var newView = new Block(Model);
			newView.name = name;
			newView.def = def;
			newView.injectInto(injectionPoint);
			return newView;
		});
	},





});