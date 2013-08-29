Presto_Module_Input = XO.Block.extend({
	schematic : 'inputContainer',

	initialize : function(subModel, calcModel)
	{
		this.model = calcModel;
		this.def = subModel;

		Inputs = {};

		this._setup();
		return this;
	},

	render : function()
	{
		var self = this;
		this.inputs = makeViews(this.def, Presto_Block_Input, this.model, self.dom.block);
		return this;
	},


	//called whnever the calcualtor wants to update with new data
	update  : function()
	{

		return this;
	},

});





Presto_Block_Input = XO.Block.extend({
	schematic : 'input',

	render : function()
	{
		var self = this;
		this.widget = this.dom.value.widget({
			value : this.def.initialValue,
			renderer : this.def.type.renderer,
			onChange : function(newVal){
				if(self.def.type.isNumerical){
					newVal = newVal * 1;
				}
				Inputs[self.name] = newVal;
				self.model.update();
			},
		});

		this.dom.title.text(this.def.title);

		this.dom.description.text(this.def.description);
		if(!this.def.description){
			this.dom.description.hide();
		}


		Inputs[self.name] = this.def.initialValue;
		return this;
	},

	update : function()
	{
		return this;
	},

});

