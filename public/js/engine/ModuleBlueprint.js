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

	//Cleans up all globals and UI
	remove : function()
	{
		return this;
	},

	/**
	 * takes data, block, and container to create a new block for each bit of data
	 */
	createBlocks : function(args)
	{
		return _.map(args.data, function(data, dataName){
			var newBlock = new args.block(data);
			newBlock.name = dataName;
			return newBlock.injectInto(args.container);
		});
	},

});
