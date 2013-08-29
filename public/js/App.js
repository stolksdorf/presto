Presto = {
	start  : function()
	{
		var self = this;

		this.calculatorBlueprint = new Presto_Model_CalculatorBlueprint();
		this.calculatorModel     = new Presto_Model_Calculator();

		this.calcBlock = new Presto_Block_Calculator(this.calculatorModel);



		this.setupEditor();

		//get Calcualtor ID from URL
		var calcId = document.URL.split('/').last();
		this.fetchCalculatorData(calcId);

		return this;
	},


	fetchCalculatorData : function(calculatorId)
	{
		var self = this;
		$.get('/api/calculator/' + calculatorId, function(response){
			//TODO: check for errors later
			self.loadCalculator(response);
		});
		return this;
	},


	loadCalculator : function(calcBlueprint)
	{
		this.calculatorBlueprint.set(calcBlueprint);
		this.calculatorModel.clear().set(this.calculatorBlueprint.executeScript());
		return this;
	},

	setupEditor : function()
	{
		var self = this;

		this.editor    = new Presto_Block_CodeEditor();
		this.editor.on('run', function(){
			self.calculatorBlueprint.set('script', self.editor.getCode());
			self.calculatorModel.set(self.calculatorBlueprint.executeScript());
		});

		this.editor.on('upload', function(){
			self.calculatorBlueprint.set('script', self.editor.getCode());
			self.calculatorBlueprint.uploadToServer();
		});
		this.calculatorBlueprint.on('uploaded', function(){
			self.editor.showMessage('Upload Successful!', 'success');
		});
		this.calculatorBlueprint.onChange('script', function(newScript){
			self.editor.setCode(newScript);
		});
		this.calcBlock.on('showEditor', function(){
			self.editor.show();
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