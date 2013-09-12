Presto = {
	modules : {},
	start  : function()
	{
		var self = this;

		this.calculatorModel     = new XO.Model();
		this.calculatorBlueprint = new Presto_Model_CalculatorBlueprint({
			id : document.URL.split('/').last()
		});
		this.overlayBlock = new Presto_Block_Overlay(this.calculatorModel);
		this.codeEditor  = new Presto_Block_CodeEditor(this.calculatorBlueprint);

		this.setupEvents();

		this.calculatorBlueprint.retrieve(); //get the blueprint from the server
		return this;
	},

	setupEvents : function()
	{
		var self = this;
		//Whenever the blueprint is executed, update the model with changes
		this.calculatorBlueprint.on('execute', function(newCalcModel){
			self.calculatorModel.set(newCalcModel);
		});

		//whenever the model updates, re-render the modules
		this.calculatorModel.on('change', function(){
			self.renderModules()
		});

		this.overlayBlock.on('showEditor', function(){
			self.codeEditor.show();
		});

		return this;
	},

	/**
	 * A facade for modules to call to update all other modules
	 */
	update : function()
	{
		this.updateModules();
		return this;
	},



	//
	// MODULE JUNK
	//


	/**
	 * Creates a new module and adds it to the list
	 */
	registerModule : function(moduleObject)
	{
		//TODO: Add a name/global collision check
		var newModule = Presto_Module.extend(moduleObject);
		newModule.initialize();
		//TODO: Maybe add global init here as well?
		this.modules[moduleObject.name] = newModule;
		return this;
	},

	/**
	 * Takes the blueprint, executes it, then renders the calculator using the model
	 */
	renderModules : function()
	{
		var self = this;

		//remove any old modules first
		this.removeModules();

		_.each(this.modules, function(module, moduleName){
			if(module.global){
				window[module.global] = {};
			}
			if(self.calculatorModel.has(moduleName)){
				self.modules[moduleName].render(self.calculatorModel.get(moduleName));
			}
		});
		this.update();
		return this;
	},

	/**
	 * When called updates each module, utilizing the updated Globals
	 */
	updateModules : function()
	{
		console.log('Upating Presto');
		_.each(this.modules, function(module){
			module.update();
		});
		return this;
	},

	removeModules : function()
	{
		_.each(this.modules, function(module){
			if(module.global){
				delete window[module.global];
			}
			module.remove();
		});
		return this;
	},
};




//TODO: move to modules later
makeViews = function(collection, Block, Model, target){
	return _.map(collection, function(def, name){

		var newView = new Block(Model);

		newView.name = name;
		newView.def = def;


		newView.injectInto(target);
		return newView;
	});
}