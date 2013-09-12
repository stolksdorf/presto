Presto.registerModule({
	name   : 'global',
	global : 'Global',
	order : 010,

	render : function(moduleData)
	{
		_.extend(Global, moduleData);
		return this;
	},


});