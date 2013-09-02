Presto = {
	start  : function()
	{
		var self = this;



		this.calculatorModel     = new Presto_Model_Calculator();
		this.calculatorBlueprint = new Presto_Model_CalculatorBlueprint();

		this.calcBlock = new Presto_Block_Calculator(this.calculatorModel);

		//

		//get Calcualtor ID from URL
		var calcId = document.URL.split('/').last();
		this.fetchCalculatorData(calcId);

		return this;
	},


	fetchCalculatorData : function(calculatorId)
	{
		var self = this;
		$.get('/api/calculator/' + calculatorId, function(response){
			self.setupEditor();
			//TODO: check for errors later
			self.loadCalculator(response);



		});
		return this;
	},


	loadCalculator : function(calcBlueprint)
	{
		this.calculatorBlueprint.set(calcBlueprint);
		this.calculatorBlueprint.run();
		return this;
	},

	setupEditor : function()
	{
		var self = this;

		this.editor    = new Presto_Block_CodeEditor();

		this.calcBlock.on('showEditor', function(){
			self.editor.show();
		});


		return this;
	},

	addModule : function(moduleName, moduleDefinition)
	{
		this.modules[moduleName] = Presto_Module.extend(moduleDefinition);
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