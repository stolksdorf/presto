Presto.registerModule({
	name      : 'outputs',
	global    : 'Outputs',

	schematic : 'outputContainer',
	target    : Presto.getStaticPanel,


	start : function()
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

				start : function()
				{
					return this;
				},

				generate : function()
				{
					return _.evalue(this.definition.value);
				},

				draw : function()
				{
					this.definition.type.renderer(this.data, this.dom.value);

					if(!_.evalue(this.definition.description)){
						this.dom.description.hide();
					}
					this.dom.description.text(_.evalue(this.definition.description));
					this.dom.title.text(_.evalue(this.definition.title));

					if(!_.evalue(this.definition.hideDelta)){
						this.drawDelta();
					}
					return this;
				},

				drawDelta : function()
				{
					this.dom.deltaNeg.hide();
					this.dom.deltaPos.hide();
					if(typeof this.data !== 'number' || typeof this.old_data !== 'number'){
						this.old_data = this.data;
						return this;
					}

					var delta = this.data - this.old_data;
					var displayValue = this.definition.type.renderer(delta)

					if(delta > 0){
						this.dom.deltaPos.show()
						this.dom.deltaPos.attr('data-hint', "+"+displayValue);
					} else if(delta < 0){
						this.dom.deltaNeg.show()
						this.dom.deltaNeg.attr('data-hint', displayValue);
					}

					this.old_data = this.data;
					return this;
				},
			})
		}
	}

});








