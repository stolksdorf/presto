Presto.registerModule({
	name      : 'inputs',
	global    : 'Inputs',

	schematic : 'inputContainer',
	target    : $('.staticContainer'), //expose global thigny


	initialize : function()
	{
		this.inputs = this.createComponents({
			definition : this.definition,
			component  : this.components.input,
			target     : this.dom.block
		});

		return this;
	},

	generate : function()
	{
		return _.keymap(this.inputs, function(input){
			return input.generate();
		});
	},

	draw : function(data)
	{
		_.each(this.inputs, function(input){
			input.draw(data[input.name]);
		});
	},

	registerComponents : function(module){
		return {
			input : Presto_Component.extend({
				schematic : 'input',

				initialize : function()
				{
					var self = this;
					this.widget = this.dom.value.widget({
						value    : _.evalue(this.definition.initialValue),
						renderer : this.definition.type.renderer,
						onChange : function(newVal){
							Presto.update();
						},
					});

					return this;
				},

				generate : function()
				{
					if(this.definition.type.isNumerical){
						return this.widget.value() * 1;
					}
					return this.widget.value();
				},

				draw : function(data)
				{
					this.widget.value(data, true);

					if(!_.evalue(this.definition.description)){
						this.dom.description.hide();
					}

					this.dom.description.text(_.evalue(this.definition.description));
					this.dom.title.text(_.evalue(this.definition.title));
				},
			})
		}
	}

});
