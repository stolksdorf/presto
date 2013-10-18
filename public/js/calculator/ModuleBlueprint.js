Presto_Module = xo.view.extend({
	name      : undefined,
	global    : undefined,

	schematic : undefined,
	target    : undefined,

	start : function()
	{
		return this;
	},

	generate : function(definition, data)
	{
		return;
	},

	draw : function(definition, data)
	{
		return this;
	},

	createComponents : function(args)
	{
		var iterator = _.keymap;
		if(args.as_array) iterator = _.map
		return iterator(args.definition, function(def, name){
			var newComponent = args.component.create();

			newComponent.name = name;
			if(args.target){
				newComponent.injectInto(args.target);
			}

			var genStore = newComponent.generate;
			newComponent.generate = function(){
				var result = genStore.apply(newComponent, arguments);
				newComponent.data = result;
				return result;
			};

			newComponent.definition = def;
			newComponent.start();
			return newComponent;
		});
	},

	registerComponents : function(module)
	{
		return {};
	},


});

Presto_Component = Presto_Module;