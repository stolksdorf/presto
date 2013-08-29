var mod_map = {
	inputs  : Presto_Module_Input,
	tables  : Presto_Module_Table,
	outputs : Presto_Module_Output,
};

Presto_Block_Calculator = XO.Block.extend({
	block : 'calculator',

	render : function()
	{
		var self = this;

		//Setup Topbar
		this._topbarClasses = this.dom.topbar.attr('class');
		this.model.onChange('color', function(newColor){
			self.dom.topbar
				.removeClass()
				.attr('class', self._topbarClasses)
				.addClass(newColor);
		});
		this.model.onChange('icon', function(newIcon){
			self.dom.icon
				.removeClass()
				.addClass(newIcon);
		});
		this.model.onChange('title', function(newTitle){
			self.dom.title.text(newTitle);
		});

		this.dom.launchEditorButton.click(function(){
			self.trigger('showEditor');
		});


		//Model events
		this.model.on('change', function(){
			self.gen();
		});

		this.model.on('update', function(){
			self.update();
		});


		return this;
	},

	gen : function()
	{
		var self = this;
		console.log('---firing gen---');

		_.each(this.modules, function(module){
			module.remove();
		});
		this.modules = {};

		_.each(mod_map, function(module, moduleName){
			var temp = new module(self.model.get(moduleName), self.model);
			temp.injectInto(self.dom.container);
			self.modules[moduleName] = temp;
		});

		this.update();

		return this;
	},

	update : function()
	{
		console.log('---updating---');
		_.each(this.modules, function(module){
			module.update();
		});

		return this;
	},

})