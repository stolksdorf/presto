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


Presto_Component = Archetype.extend({
	generate : function(defintion, data)
	{
		return;
	},

	draw : function(defintion, data)
	{
		return this;
	}
}).mixin(xo_view);



Presto_Module = Archetype.extend({
	name      : undefined,
	global    : undefined,

	schematic : undefined,
	target    : undefined,

	generate : function(defintion, data)
	{
		return;
	},

	draw : function(defintion, data)
	{
		return this;
	},

	createComponents : function(defintion, component, target)
	{
		return _.keymap(defintion, function(def, name){
			var newComponent = component.create();

			newComponent.name = name;
			if(target){
				newComponent.injectInto(target);
			}

			newComponent.definition = def;
			newComponent.def = def;
			newComponent.initialize(_.evalueObj(newComponent.def));
			return newComponent;
		});
	},

	registerComponents : function(module)
	{
		return {};
	},

	generateComponents : function(components)
	{
		var self = this;
		return _.keymap(components, function(component, componentName){
			return component.generate(_.evalueObj(self.def[componentName]));
		});
	},

	drawComponents : function(components, data)
	{
		var self = this;
		return _.keymap(components, function(component, componentName){
			return component.draw(_.evalueObj(self.def[componentName]), data[componentName]);
		});
	},


}).mixin(xo_view);