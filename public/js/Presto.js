Presto = Archetype.extend({
	modules : {},
	defaultOptions : {
		//disabled_modules : [],
		show_errorbar : true,
		is_beta       : false,
		show_editor   : true,
		max_update_iterations : 5
	},

	start  : function(opts)
	{
		var self = this;
		this.options = _.extend(this.defaultOptions, opts);

		this.calculatorModel     = new XO.Model();
		this.calculatorBlueprint = new Presto_Model_CalculatorBlueprint({
			id : this.options.calcId
		});

		console.log(this.options.calc);


		this.calculatorBlueprint = new Presto_Model_CalculatorBlueprint(this.options.calc);

		//When the page loads render the calculator
		$(document).ready(function(){
			console.log('READY');
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
		//this.calculatorBlueprint.retrieve();
		this.calculatorBlueprint.execute();
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


	update : function()
	{
		if(this._updating) return;
		this._updating = true;

		this.updateModules();
		this.drawModules();

		this._updating = false;
		return this;
	},


	/**
	 * Creates a new module and adds it to the list
	 */
	registerModule : function(moduleObject)
	{
		//Check for disabled
		/*
		if(_.contains(Presto.options.disabled_modules, moduleObject.name)){
			return this;
		}
		*/
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

		this.removeModules();

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

		//Now try to initialize each
		_.each(this.sortedModules(), function(module){

			var def = self.calculatorModel.get(module.name);

			if(module.schematic){
				module.injectInto(module.target.call(self));
			}

			module.components = module.registerComponents(module);

			module.definition = def;
			module.def = def;
			module.initialize();

			window[module.name] = def;
		});


		this.update();
		return this;
	},

	updateModules : function()
	{
		var self = this;
		this.globals = {};
		var iterationCount = 0;
		while(1){
			var newGlobals = {},
				thrownError = false;
			_.each(self.modules, function(module){
				try{
					var temp = module.generate();
				}catch(e){
					thrownError = true;
					if(iterationCount > Presto.options.max_update_iterations){
						module.generate(); //Just cause the error again
					}
				}
				if(module.global){
					newGlobals[module.global] = temp;
					window[module.global] = temp;
				}
			});

			if(iterationCount > Presto.options.max_update_iterations){
				throw 'Circular dependacy';
			}
			if(!thrownError){//} && _.compare(newGlobals, this.globals)){
				break;
			}

			this.globals = newGlobals;
			iterationCount++;
		}

		return this;
	},


	/**
	 * When called updates each module, utilizing the updated Globals
	 */
	drawModules : function()
	{
		_.each(this.sortedModules(), function(module){
			module.draw(window[module.global]);
		});
		return this;
	},



	sortedModules : function()
	{
		return _.sortBy(this.modules, function(module){
			return module.drawOrder || 100000; //TODO: Fix later
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
