Presto_Block_Calculator = XO.Block.extend({
	block : 'calculator',

	render : function()
	{

		var self = this;

		this.InputCollection = new XO.Collection();


		this.InputCollection.on('change', function(){
			self.genEnviro();
		})





		/*Editor junk*/

		var editor = new Presto_Block_CodeEditor(LTCPriceComparison);

		this.dom.launchEditorButton.click(function(){

			console.log('not working?', editor);

			editor.show();

		});

		editor.injectInto(this.dom.block);


		return this;
	},

	makeCalc : function(calcData)
	{
		self = this;

		this.dom.title.text(calcData.title);
		this.dom.logo.addClass('icon-' + calcData.icon);

		_.each(calcData.inputs, function(inputData, inputName){

			var inputModel = new XO.Model(inputData);
			inputModel.set('name', inputName);

			self.InputCollection.add(inputModel);
			var newInputblock = new Presto_Block_Input(inputModel);
			newInputblock.injectInto(self.dom.inputContainer);
		});


		//create dat chart
		console.log('asdsad');
		var myChart = new Presto_Block_Chart(new XO.Model(calcData.chart));

		myChart.injectInto(self.dom.chartContainer);


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