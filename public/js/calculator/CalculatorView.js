Presto_View_Calculator = xo.view.extend({
	view : 'calculator',

	render : function()
	{
		var self = this;

		//Setup Topbar
		this._topbarClasses = this.dom.topbar.attr('class');
		this.model.onChange({
			color : function(newColor){
				self.dom.topbar
					.removeClass()
					.attr('class', self._topbarClasses)
					.addClass(newColor);
			},
			icon : function(newIcon){
				self.dom.icon
					.removeClass()
					.addClass(newIcon);
			},
			title : function(newTitle){
				self.dom.title.text(newTitle);
				self.dom.windowTitle.text(newTitle);
			}
		});


		Presto.on('error', function(error, fileName, lineNumber){
			if(Presto.options.show_errorbar){
				self.dom.errorBar.show();
				self.dom.errorBar.find('span').text('line ' + lineNumber + ' : ' + error);
			}
		});
		Presto.on('render', function(){
			self.dom.errorBar.hide();
		});

		this.dom.refreshButton.click(function(){
			Presto.update();
		});

		this.createCodeEditor();
		return this;
	},

	createCodeEditor : function()
	{
		if(typeof Presto_View_CodeEditor === 'undefined') return;
		var self = this;

		this.codeEditor = Presto_View_CodeEditor.create(this.model);

		if(this.dom.launchEditorButton){
			this.dom.launchEditorButton.click(function(){
				self.codeEditor.show();
			});
		}

		return this;
	},

});


