Presto.registerModule({
	name   : 'outputs',
	global : 'Outputs',

	initialize : function()
	{
		this.outputContainer = new XO.Block();
		return this;
	},

	render : function(moduleData)
	{
		var self = this;

		console.log('rendering output module', moduleData);

		this.outputContainer.schematic = 'outputContainer';
		this.outputContainer.injectInto($('#leftSide')); //<-- fix this later

		this.outputs = _.map(moduleData, function(outputData, outputName){
			var newOutput = new self.OutputBlock(outputData);
			newOutput.name = outputName;
			return newOutput.injectInto(self.outputContainer.dom.block);
		});

		return this;
	},

	update : function()
	{
		console.log('updating all outputs');
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
			console.log('rendering output');
			var self = this;
			this.dom.title.text(this.model.get('title'));
			this.dom.description.text(this.model.get('description'));
			if(!this.model.get('description')){
				this.dom.description.hide();
			}
			return this;
		},
		update : function()
		{
			var outputValue = this.model.get('value');
			if(typeof outputValue === 'function'){
				outputValue = outputValue();
			}
			console.log('Updating output', outputValue);
			this.model.get('type').renderer(outputValue, this.dom.value);
			Outputs[this.name] = val;
			return this;
		},
	}),

});




