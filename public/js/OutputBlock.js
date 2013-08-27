Presto_Block_Output = XO.Block.extend({
	schematic : 'output',

	render : function()
	{
		var self = this;


/*
		this.model.onChange('value', function(){
			self.widget.value(self.model.get('value'));
		});
*/
		this.model.onChange('title', function(){
			self.dom.title.text(self.model.get('title'));
		});
		this.model.onChange('description', function(){
			if(!self.model.get('description')){
				self.dom.description.hide();
				return;
			}
			self.dom.description.text(self.model.get('description'));
		});



		return this;
	},

	update : function()
	{

		var val = this.model.get('value')();

		this.model.get('type').renderer(val, this.dom.value);


		return this;
	},

});

