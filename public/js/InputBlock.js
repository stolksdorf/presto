Presto_Block_Input = XO.Block.extend({
	schematic : 'input',

	render : function()
	{
		var self = this;


		this.widget = this.dom.value.widget({
			value : this.model.get('value'),
			renderer : this.model.get('type').renderer,
			onChange : function(newVal){
				if(self.model.get('type').isNumerical){
					newVal = newVal * 1;
				}
				self.model.set('value', newVal);
			},
		});


		this.model.onChange('value', function(){
			self.widget.value(self.model.get('value'));
		});

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

});




Presto_Block_Input_Text = XO.Block.extend({
	schematic : 'input_text',

	render : function()
	{
		var self = this;
		this.dom.title.text('whatever');
		this.dom.value.val('whatever');

		this.dom.value.change(function(){
			console.log(self.dom.value.val());
		})

		return this;
	},

});

