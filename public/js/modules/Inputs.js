Presto.registerModule({
	name   : 'inputs',
	global : 'Inputs',

	order : 100,

	initialize : function()
	{
		this.inputContainer = new XO.Block();
		return this;
	},

	render : function(moduleData)
	{
		var self = this;

		this.inputContainer.schematic = 'inputContainer';
		this.inputContainer.injectInto($('#leftSide')); //<-- fix this later

		this.inputs = this.createBlocks({
			data      : moduleData,
			block     : this.InputBlock,
			container : this.inputContainer.dom.block
		});

		return this;
	},

	update : function()
	{
		_.each(this.inputs, function(input){
			input.update();
		})
		return this;
	},

	remove : function()
	{
		this.inputContainer.remove();
		return this;
	},


	/**
	 * Module Blocks
	 */
	InputBlock : XO.Block.extend({
		schematic : 'input',
		render : function()
		{
			var self = this;
			this.widget = this.dom.value.widget({
				value : _.evalue(this.model.get('initialValue')),
				renderer : this.model.get('type').renderer,
				onChange : function(newVal){
					if(self.model.get('type').isNumerical){
						newVal = newVal * 1;
					}
					Inputs[self.name] = newVal;
					Presto.update();
				},
			});

			if(!this.model.get('description')){
				this.dom.description.hide();
			}

			Inputs[self.name] = _.evalue(this.model.get('initialValue'));
			return this;
		},

		update : function()
		{
			var self = this;

			this.dom.title.text(_.evalue(this.model.get('title')));
			this.dom.description.text(_.evalue(this.model.get('description')));

			return this;
		},
	}),


});
