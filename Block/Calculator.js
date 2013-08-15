Presto_Block_Calculator = XO.Block.extend({
	block : 'calculator',

	initialize : function(calcGenerator)
	{
		this.calcGenerator = calcGenerator

		this._setup();


		return this;
	},

	render : function(calcGenerator)
	{

		var self = this;

		this.InputCollection = new XO.Collection();
		this.OutputCollection = new XO.Collection();


		this.InputCollection.on('change', function(){
			self.genEnviro();
			self.myChart.makeRows(17);
			_.each(self.outputBlocks, function(outputBlock){
				outputBlock.update();
			});
		})




		/*Editor junk*/


		this.editor = new Presto_Block_CodeEditor();

		this.dom.launchEditorButton.click(function(){
			self.editor.show();
		});

		this.editor.injectInto(this.dom.block);
		this.editor.setCode(this.calcGenerator.toString());

		this.makeCalc(this.calcGenerator());


		return this;
	},

	makeCalc : function(calcData)
	{
		self = this;



		//Reset everything
		this.dom.inputContainer.html("");
		this.dom.outputContainer.html("");
		this.dom.chartContainer.html("");
		this.InputCollection.reset();
		this.OutputCollection.reset();







		this.dom.title.text(calcData.title);
		this.dom.logo.addClass('icon-' + calcData.icon);

		self.outputBlocks = [];

		//Make inputs
		_.each(calcData.inputs, function(inputData, inputName){

			var inputModel = new XO.Model(inputData);
			inputModel.set('name', inputName);

			self.InputCollection.add(inputModel);
			var newInputblock = new Presto_Block_Input(inputModel);
			newInputblock.injectInto(self.dom.inputContainer);
		});

		self.genEnviro();



		//create dat chart
		this.myChart = new Presto_Block_Chart(new XO.Model(calcData.chart));

		this.myChart.injectInto(self.dom.chartContainer);

		self.myChart.makeRows(17);


		//make Outputs
		_.each(calcData.outputs, function(outputData, outputName){

			var outputModel = new XO.Model(outputData);
			outputModel.set('name', outputName);

			self.OutputCollection.add(outputModel);
			var newOutputblock = new Presto_Block_Output(outputModel);
			newOutputblock.injectInto(self.dom.outputContainer);

			self.outputBlocks.push(newOutputblock);

		});


		_.each(self.outputBlocks, function(outputBlock){
			outputBlock.update();
		});


		return this;
	},


	update : function()
	{



		return this;
	},


	genEnviro : function(){

		Inputs = {};

		this.InputCollection.each(function(inputModel){
			Inputs[inputModel.get('name')] = inputModel.get('value');
		});




		return this;
	}

})