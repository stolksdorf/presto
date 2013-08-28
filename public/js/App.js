Presto = {
	start  : function()
	{
		var self = this;

		this.calculatorBlueprint = new Presto_Model_CalculatorBlueprint();
		this.calculatorModel     = new Presto_Model_Calculator();

		this.calcBlock = new Presto_Block_Calculator(this.calculatorModel);//this.calculatorBlueprint, this.calculatorModel);
		this.editor    = new Presto_Block_CodeEditor();






		//Events
		this.editor.on('change', function(newScript){

		});

		this.editor.on('run', function(){
			self.calculatorBlueprint.set('script', self.editor.getCode());
			self.calculatorModel.set(self.calculatorBlueprint.executeScript());
		});

		this.editor.on('upload', function(){
			self.calculatorBlueprint.set('script', self.editor.getCode());
			self.calculatorBlueprint.uploadToServer();
		});



		this.calcBlock.on('showEditor', function(){
			self.editor.show();
		});


		//?
		this.calculatorBlueprint.on('runScript', function(newBlueprint){
			self.calculatorModel.set(newBlueprint);
		});
		this.calculatorBlueprint.on('error', function(errors){
			self.editor.showErrors(errors);
		});

		this.calculatorBlueprint.onChange('script', function(newScript){
			self.editor.setCode(newScript);
		})




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
		this.calculatorModel.set(this.calculatorBlueprint.executeScript());
		return this;
	},


};