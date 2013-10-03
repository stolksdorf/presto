Presto = Archetype.extend({
	modules : {},
	defaultOptions : {
		disabled_modules : [],
		show_errorbar : true,
		is_beta       : false,
		show_editor   : true,
	},

	start  : function(opts)
	{
		var self = this;
		this.options = _.extend(this.defaultOptions, opts);

		this.calculatorModel     = new XO.Model();
		this.calculatorBlueprint = new Presto_Model_CalculatorBlueprint({
			id : this.options.calcId
		});



		this.globalScope = {};

		//When the page loads render the calculator
		$(document).ready(function(){
			console.log('UI DRAWN');
			self.render();
		});
		return this;
	},

	render : function() //rename to draw
	{
		console.log('Modules', this.modules);


		var self = this;
		this.overlayBlock = new Presto_Block_Overlay(this.calculatorModel);

		if(typeof Presto_Block_CodeEditor !== 'undefined'){
			this.codeEditor   = new Presto_Block_CodeEditor(this.calculatorBlueprint);
		}

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
			self.initializeModules()
		});

		this.overlayBlock.on('showEditor', function(){
			self.codeEditor.show();
		});

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
		this.modules[moduleObject.name] = Presto_Module.extend(moduleObject);

		console.log('ADDED:', moduleObject.name);

		return this;
	},

	/**
	 * Takes the blueprint, executes it, then renders the calculator using the model
	 */
	initializeModules : function()
	{
		var self = this;

		//dump defintion into global
		_.each(this.modules, function(module){
			var def = self.calculatorModel.get(module.name);
			try{
				if(module.global){
					window[module.global] = module.generate(def);
				}
			}catch(e){
				//nuhing
			}
		});

		console.log('loaded globals');

		//Now try to initialize each
		_.each(this.modules, function(module){

			var def = self.calculatorModel.get(module.name);

			if(module.schematic){
				module.injectInto(module.target);
			}

			module.components = module.registerComponents(module);

			module.definition = def;
			module.def = def;
			module.initialize(_.evalueObj(module.def));

			window[module.name] = def;
		});


		this.update();
		return this;
	},

	/**
	 * A facade for modules to call to update all other modules
	 */
	update : function()
	{
		if(this._updating) return;
		this._updating = true;
		console.log('---------');
		var newGlobalScope = {},
			iterationCount = 0,
			error;
		while(1){
			console.log('running update', iterationCount);
			error = undefined;

			_.each(this.modules, function(module){
				try{
					var temp = module.generate(module.def);
					if(module.global){
						newGlobalScope[module.global] = temp;
						window[module.global] = temp;
					}
				}catch(e){
					console.error('caught an error');
					error = e;
				}
			});

			if(_.compare(this.globalScope, newGlobalScope) || error || iterationCount > 5){
				break;
			}
			this.globalScope = newGlobalScope;
			iterationCount++;
		}

		console.log('Update finish', iterationCount, this.globalScope);
		if(error){
			throw error;
		}

		this.drawModules();
		this._updating = false;
		return this;
	},


	/**
	 * When called updates each module, utilizing the updated Globals
	 */
	drawModules : function()
	{
		console.log('drawing');
		var self = this;
		_.each(this.modules, function(module){
			module.draw(module.def, self.globalScope[module.global]);
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
		return _.map(args.data, function(data, dataName){
			var newBlock = new args.block(data);
			newBlock.name = dataName;
			return newBlock.injectInto(args.container, {at_top : args.prepend});
		});
	},

	getStaticPanel : function()
	{
		return this.overlayBlock.dom.staticContainer;
	},

	getFlowPanel : function()
	{
		return this.overlayBlock.dom.flowContainer;
	},

});

window.onerror = function(error, fileName, lineNumber){
	Presto.trigger('error', error, fileName, lineNumber);
};
