


Presto_Block_Overlay = XO.Block.extend({
	block : 'calculator', //TODO update to overlay

	render : function()
	{
		var self = this;

		//Setup Topbar
		this._topbarClasses = this.dom.topbar.attr('class');
		this.model.onChange('color', function(newColor){
			self.dom.topbar
				.removeClass()
				.attr('class', self._topbarClasses)
				.addClass(newColor);
		});
		this.model.onChange('icon', function(newIcon){
			self.dom.icon
				.removeClass()
				.addClass(newIcon);
		});
		this.model.onChange('title', function(newTitle){
			self.dom.title.text(newTitle);
		});

		if(this.dom.launchEditorButton){
			this.dom.launchEditorButton.click(function(){
				self.trigger('showEditor');
			});
		}


		if(!Presto.options.show_editor){
			this.dom.launchEditorButton.hide();
		}

		Presto.on('error', function(error, fileName, lineNumber){
			if(Presto.options.show_errorbar){
				self.dom.errorBar.show();
				self.dom.errorBar.find('span').text('line ' + lineNumber + ' : ' + error);
			}
		});

		Presto.on('render', function(){
			self.dom.errorBar.hide();
		});

		return this;
	},

	showError : function(erorrObj)
	{

		return this;
	},

});


