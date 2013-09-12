Presto = {
	modules : {},
	defaultOptions : {
		disabled_modules : []
	},

	start  : function(opts)
	{
		var self = this;
		this.options = _.extend(this.defaultOptions, opts);

		this.calculatorModel     = new XO.Model();
		this.calculatorBlueprint = new Presto_Model_CalculatorBlueprint({
			id : document.URL.split('/').last()
		});

		//When the page loads render the calculator
		$(document).ready(function(){
			self.render();
		});
		return this;
	},

	render : function()
	{
		var self = this;
		this.overlayBlock = new Presto_Block_Overlay(this.calculatorModel);
		this.codeEditor   = new Presto_Block_CodeEditor(this.calculatorBlueprint);

		this.setupEvents();

		//get the blueprint from the server
		this.calculatorBlueprint.retrieve();
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
		//Check for disabled
		if(_.contains(Presto.options.disabled_modules, moduleObject.name)){
			return this;
		}

		//TODO: Add a name/global collision check
		var newModule = Presto_Module.extend(moduleObject);
		newModule.initialize();
		//TODO: Maybe add global init here as well?
		this.modules[newModule.name] = newModule;


		//Sort modules


		console.log("SORTED", this.sortModules());

		return this;
	},

	/**
	 * Takes the blueprint, executes it, then renders the calculator using the model
	 */
	renderModules : function()
	{
		var self = this;
		this.removeModules(); //remove any old modules first

		_.each(this.sortModules(), function(module){
			if(module.global){
				window[module.global] = {};
			}
			if(self.calculatorModel.has(module.name)){
				module.render(self.calculatorModel.get(module.name));
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
		_.each(this.sortModules(), function(module){
			module.update();
		});
		return this;
	},

	sortModules : function()
	{
		return _.sortBy(this.modules, function(module){
			return module.order || 100000; //TODO: Fix later
		});
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


	//Utility Functions

	/**
	 * takes data, block, and container to create a new block for each bit of data
	 */
	createBlocks : function(args)
	{
		console.log('args', args);
		return _.map(args.data, function(data, dataName){
			var newBlock = new args.block(data);
			newBlock.name = dataName;
			return newBlock.injectInto(args.container);
		});
	},

	/**
	 * Takes a value, if a function, executes, and returns value
	 * if not function, returns value
	 */
	evalue : function(val)
	{
		if(typeof val === 'function'){
			return val();
		}
		return val;
	},



};


