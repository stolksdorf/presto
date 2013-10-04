xo_view = Archetype.extend({
	schematic : undefined,

	injectInto : function(target, options)
	{
		var self = this;
		options = options || {};
		this.dom = this.dom || {};
		if(target.length === 0 ){throw 'XO: Could not find the injection point';}
		if(this.schematic === ''){throw 'XO: Schematic name not set' ;}
		if(options.at_top){
			this.dom.block = $.getSchematic(this.schematic).prependTo(target);
		} else {
			this.dom.block = $.getSchematic(this.schematic).appendTo(target);
		}
		//build internal dom object
		this.dom.block.find('[xo-element]').each(function(index, element){
			self.dom[jQuery(element).attr('xo-element')] = jQuery(element);
		});
		this.render();
		return this;
	},

	remove : function()
	{
		this.dom = this.dom || {};
		if(this.dom.block) this.dom.block.remove();
		this.off();
		return this;
	},

	render : function()
	{
		return this;
	},
});






Presto_Module = Archetype.extend({
	name      : undefined,
	global    : undefined,

	schematic : undefined,
	target    : undefined,

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

			newComponent.definition = def;
			newComponent.initialize();
			return newComponent;
		});
	},

	registerComponents : function(module)
	{
		return {};
	},

/*
	generateComponents : function(components, def)
	{
		return _.keymap(components, function(component, componentName){
			return component.generate(_.evalueObj(def[componentName]));
		});
	},

	drawComponents : function(components, def, data)
	{
		return _.keymap(components, function(component, componentName){
			return component.draw(_.evalueObj(def[componentName]), data[componentName]);
		});
	},
*/

}).mixin(xo_view);

Presto_Component = Presto_Module.extend({

});