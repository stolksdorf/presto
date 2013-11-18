Presto.registerModule({
	name      : 'inputs',
	global    : 'Inputs',

	schematic : 'inputContainer',
	target    : Presto.getStaticPanel,


	start : function()
	{
		this.inputs = this.createComponents({
			definition : this.definition,
			component  : this.components.input,
			target     : this.dom.view
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

				start : function()
				{
					var self = this;
					this.widget = this.dom.value.widget({
						value    : undefined,
						renderer : this.definition.type.renderer,
						onChange : function(newVal){
							Presto.update();
						},
					});

					return this;
				},

				generate : function()
				{
					if(typeof this.widget.value() === 'undefined'){
						this.widget.value(_.evalue(this.definition.initialValue));
					}


					if(this.definition.type.isNumerical){
						return this.widget.value() * 1;
					}
					return this.widget.value();
				},

				draw : function()
				{
					this.widget.value(this.data, true);

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
