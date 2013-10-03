Presto.registerModule({
	name      : 'inputs',
	global    : 'Inputs',

	schematic : 'inputContainer',
	target    : $('.staticContainer'), //expose global thigny


	initialize : function(def)
	{
		this.inputs = this.createComponents(def, this.components.input, this.dom.block);


		return this;
	},

	generate : function(def)
	{
		/*
		return _.keymap(this.inputs, function(input, inputName){
			return input.generate(def[inputName]);
		})
		*/

		return this.generateComponents(this.inputs);
	},

	draw : function(def, data)
	{
		return this.drawComponents(this.inputs, data);
/*
		return _.keymap(this.inputs, function(input, inputName){
			return input.draw(def[inputName], data[inputName]);
		});
*/
	},

	registerComponents : function(module){
		return {
			input : Presto_Component.extend({
				schematic : 'input',

				initialize : function(def)
				{
					var self = this;
					this.widget = this.dom.value.widget({
						value : def.initialValue,
						renderer : def.type.renderer,
						onChange : function(newVal){
							Presto.update();
						},
					});

					if(!def.description){
						this.dom.description.hide();
					}

					this.dom.description.text(def.description);
					this.dom.title.text(def.title);

					return this;
				},

				generate : function(def)
				{
					if(def.type.isNumerical){
						return this.widget.value() * 1;
					}
					return this.widget.value();
				},

				draw : function(def, data)
				{
					this.widget.value(data, true);
					return this;
				},
			})
		}
	}

});





/*

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
		this.inputContainer.injectInto(Presto.getStaticPanel());

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
*/