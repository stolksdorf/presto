Presto = {
	start  : function()
	{
		var self = this;





		//create definition and data model

		this.calcDefinition = new Presto_Model_CalcDefinition();
		this.calcBlueprint = new Presto_Model_CalcBlueprint();



		//this.codeEditor = etc.


		//create event listeners to tie both models together

		this.calcDefinition.on('runScript', function(newBlueprint){
			self.calcBlueprint.set(newBlueprint);
		});



		this.calcBlock = new Presto_Block_Calculator(this.calcDefinition, this.calcBlueprint);




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


	loadCalculator : function(calcDefObj)
	{
		console.log('set calculator', calcDefObj);
		this.calcDefinition.set(calcDefObj);
		this.calcDefinition.executeScript();
		return this;
	},


};