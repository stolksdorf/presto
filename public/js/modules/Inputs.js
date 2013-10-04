Presto.registerModule({
	name      : 'inputs',
	global    : 'Inputs',

	schematic : 'inputContainer',
	target    : $('.staticContainer'), //expose global thigny


	initialize : function(def)
	{
		//this.inputs = this.createComponents(def, this.components.input, this.dom.block);


		this.inputs = this.createComponents({
			definition : this.definition,
			component  : this.components.input,
			target     : this.dom.block
		});

		return this;
	},

	generate : function(def)
	{
		return _.keymap(this.inputs, function(input){
			return input.generate();
		});
	},

	draw : function(def, data)
	{
		_.each(this.inputs, function(input){
			input.draw(data[input.name]);
		});
	},

	registerComponents : function(module){
		return {
			input : Presto_Component.extend({
				schematic : 'input',

				initialize : function(def)
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

				generate : function(def)
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
