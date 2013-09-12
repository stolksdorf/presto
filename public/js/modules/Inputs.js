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

		console.log('rendering input', moduleData);

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
			console.log('rendering', this.model);
			var self = this;
			this.widget = this.dom.value.widget({
				value : this.model.get('initialValue'),
				renderer : this.model.get('type').renderer,
				onChange : function(newVal){
					if(self.model.get('type').isNumerical){
						newVal = newVal * 1;
					}
					Inputs[self.name] = newVal;
					Presto.update();
				},
			});

			this.dom.title.text(this.model.get('title'));
			this.dom.description.text(this.model.get('description'));
			if(!this.model.get('description')){
				this.dom.description.hide();
			}
			Inputs[self.name] = this.model.get('initialValue')
			return this;
		},
	}),


});
