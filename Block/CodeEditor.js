Presto_Block_CodeEditor = XO.Block.extend({

	schematic : 'codeEditor',

	initialize : function(calcCode)
	{

		this._code = calcCode
		if(typeof calcCode !== 'string'){
			this._code = JSON.stringify(calcCode, null, '  ');
		}


		if(this.block !== ''){
			this.dom.block = jQuery('[xo-block="' + this.block + '"]');
			this.getElements();
			this.render();
		}

		return this;
	},


	render : function()
	{
		var self = this;
		this.editor = CodeMirror(this.dom.editor[0],
		{
			value          : self._code,
			mode           : 'javascript',
			viewportMargin : Infinity,
			lineNumbers    : true,
			matchBrackets  : true,
			tabMode        : 'indent'
		});

		this.dom.block.hide();

		this.dom.closeButton.click(function(){
			self.dom.block.hide();
		});

		this.dom.runButton.click(function(){
			self.executeCodeBlock();
		});


		return this;
	},

	show : function()
	{
		console.log('showing?');
		this.dom.block.show();
		return this;
	},



	executeCodeBlock : function()
	{
		var self = this;
		this.dom.errors.hide();

		try{
			eval('(function(){makeCalc('+self.editor.getValue()+')})();');
		}catch(e){
			self.dom.errors.show();
			self.dom.errorMsg.html(e.toString());
		}

		return this;
	},



});