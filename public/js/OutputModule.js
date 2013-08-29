Presto_Module_Output = XO.Block.extend({
	schematic : 'outputContainer',

	initialize : function(subModel, calcModel)
	{
		this.model = calcModel;
		this.def = subModel;

		Outputs = {};

		this._setup();
		return this;
	},

	render : function()
	{
		var self = this;
		this.outputs = makeViews(this.def, Presto_Block_Output, this.model, self.dom.block);
		return this;
	},

	//called whnever the calcualtor wants to update with new data
	update  : function()
	{
		_.each(this.outputs, function(output){
			output.update();
		});
		return this;
	},

});



Presto_Block_Output = XO.Block.extend({
	schematic : 'output',

	render : function()
	{
		var self = this;

		this.dom.title.text(this.def.title);

		this.dom.description.text(this.def.description);
		if(!this.def.description){
			this.dom.description.hide();
		}
		return this;
	},

	update : function()
	{
		var val = this.def.value();
		this.def.type.renderer(val, this.dom.value);
		Outputs[this.name] = val;
		return this;
	},

});

