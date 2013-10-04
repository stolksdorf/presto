Presto.registerModule({
	name      : 'outputs',
	global    : 'Outputs',

	schematic : 'outputContainer',
	target    : $('.staticContainer'), //expose global thigny


	initialize : function()
	{
		this.outputs = this.createComponents({
			definition : this.definition,
			component  : this.components.output,
			target     : this.dom.block
		});

		return this;
	},

	generate : function()
	{
		return _.keymap(this.outputs, function(output){
			return output.generate();
		});
	},

	draw : function(data)
	{
		_.each(this.outputs, function(output){
			output.draw(data[output.name]);
		});
	},

	registerComponents : function(module){
		return {
			output : Presto_Component.extend({
				schematic : 'output',

				initialize : function()
				{
					return this;
				},

				generate : function()
				{
					return _.evalue(this.definition.value);
				},

				draw : function(data)
				{
					this.definition.type.renderer(data, this.dom.value);

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








