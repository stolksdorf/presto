Presto_Module_Global = XO.Block.extend({
	initialize : function(subModel, calcModel)
	{

		this.model = calcModel;
		this.def = subModel;

		this.update();
		return this;
	},

	update : function()
	{

		var self = this;
		_.each(this.def, function(fn, fnName){
			window[fnName] = fn;
		});
		return this;
	},

	injectInto : function()
	{

		return this;
	},

	remove : function()
	{

		return this;
	},



});