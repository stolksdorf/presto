Presto = Archetype.extend({
	modules : {},
	defaultOptions : {
		show_editor   : true,
		max_update_iterations : 10
	},

	start  : function(opts)
	{
		var self = this;
		this.options = _.extend(this.defaultOptions, opts);

		this.model = xo.model.create();
		this.blueprint = Presto_Model_Calculator.create({
			id : this.options.calcId
		});

		this.blueprint.fetch();

		this.blueprint.on('error:fetch', function(data){
			alert('Could not load Calculator');
		})

		$(document).ready(function(){
			console.log('READY');
			self.render();
		});
		return this;
	},

	render : function() //rename to draw
	{
		var self = this;

		this.view = Presto_View_Calculator.create(this.blueprint);

		this.blueprint.on('change:script', _.async(function(newModel){
			self.model.set(self.blueprint.execute());
		}));

		this.model.on('change', function(){
			self.initializeModules();
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
		this.modules[moduleObject.name] = Presto_Module.create().mixin(moduleObject);
		return this;
	},

	initializeModules : function()
	{
		var self = this;

		this.removeModules();
		try{
			_.each(this.sortedModules(), function(module){
				module.definition = self.model[module.name];
				if(module.schematic){
					module.injectInto(module.target.call(self));
				}
				module.components = module.registerComponents(module);
				module.start();
			});
		}catch(e){
			console.error('Tried using module data before modules were generated');
		}
		this.update();
		return this;
	},

	updateModules : function()
	{
		var self = this;
		this.globals = {};
		var iterationCount = 0;
		while(1){
			//console.log('----START', iterationCount);
			var newGlobals = {},
				thrownError = false;
			_.each(self.modules, function(module){
				try{
					//console.log("  " + module.name);
					var temp = module.generate();
				}catch(e){
					//console.log('err - '+ module.name, e.message);
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

				//throw 'Circular dependacy';
				//console.error('System Oscillating: No saddlepoint found');
				break;
			}
			//Trying fix
			if(!thrownError && _.compare(newGlobals, this.globals)){
				break;
			}

			this.globals = newGlobals;
			iterationCount++;
		}

		//console.log('----END');

		return this;
	},


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
			return module.drawOrder || 100000;
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
		return this.view.dom.staticContainer;
	},

	getFlowPanel : function()
	{
		return this.view.dom.flowContainer;
	},

});


window.onerror = function(error, fileName, lineNumber){
	Presto.trigger('error', error, fileName, lineNumber);
	if(!fileName.endsWith('.js')) return true;
};
