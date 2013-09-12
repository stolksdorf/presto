Presto.registerModule({
	name   : 'outputs',
	global : 'Outputs',

	order : 300,

	initialize : function()
	{
		this.outputContainer = new XO.Block();
		return this;
	},

	render : function(moduleData)
	{
		var self = this;
		this.outputContainer.schematic = 'outputContainer';
		this.outputContainer.injectInto($('#leftSide')); //<-- fix this later

		this.outputs = Presto.createBlocks({
			data      : moduleData,
			block     : this.OutputBlock,
			container : this.outputContainer.dom.block
		});

		return this;
	},

	update : function()
	{
		_.each(this.outputs, function(output){
			output.update();
		});
		return this;
	},

	remove : function()
	{
		this.outputContainer.remove();
		return this;
	},


	/**
	 * Module Blocks
	 */
	OutputBlock : XO.Block.extend({
		schematic : 'output',
		render : function()
		{
			var self = this;

			if(!this.model.get('description')){
				this.dom.description.hide();
			}
			return this;
		},
		update : function()
		{
			var outputValue = _.evalue(this.model.get('value'));

			this.dom.title.text(_.evalue(this.model.get('title')));
			this.dom.description.text(_.evalue(this.model.get('description')));

			this.model.get('type').renderer(outputValue, this.dom.value);
			Outputs[this.name] = outputValue;
			return this;
		},
	}),

});




