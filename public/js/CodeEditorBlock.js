Presto_Block_CodeEditor = XO.Block.extend({

	schematic : 'codeEditor',

	initialize : function(code)
	{
		this._code = code || "";
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

		this.editor.on('change', function(){
			self.trigger('change', self.editor.getValue());
		})

		this.dom.closeButton.click(function(){
			self.dom.block.hide();
		});

		this.dom.runButton.click(function(){
			self.dom.errors.hide();
			self.trigger('run');
		});

		this.dom.uploadButton.click(function(){
			self.trigger('upload');
		});






		//TODO: Turn Dragging and resizing and show/hide into a window trait, mk?
		//grab the additioanl css needed to make arbitary divs windows

		//Add dragging
		var dragging;
		this.dom.topbar.on('mousedown', function(e){
			dragging = true;

			mouseTop = self.dom.block.offset().top - e.pageY;
			mouseLeft = self.dom.block.offset().left - e.pageX;

		});


		this.dom.topbar.attr('unselectable','on')
     .css({'-moz-user-select':'-moz-none',
           '-moz-user-select':'none',
           '-o-user-select':'none',
           '-khtml-user-select':'none', /* you could also put this in a class */
           '-webkit-user-select':'none',/* and add the CSS class here instead */
           '-ms-user-select':'none',
           'user-select':'none'
     }).bind('selectstart', function(){ return false; });

		$('body').on("mousemove", function(e) {
			if (dragging) {

				self.dom.block.offset({
					top: e.pageY + mouseTop,
					left: e.pageX + mouseLeft
				});
			}

			if(resizing){
				self.dom.block.offset({
					left: e.pageX + testLeft
				});
				//self.dom.block.height(testHeight + e.pageY);
				self.dom.block.width(testWidth - e.pageX);

				self.editor.setSize(self.dom.block.width(), testHeight + e.pageY);
			}
		}).on('mouseup', function(){
			dragging = false;
			resizing = false;
		});




		//Add resizing
		var resizing;
		this.dom.resize.on('mousedown', function(e){
			resizing = true;

/*
			height = self.dom.block.height();


			mouseTop = self.dom.block.offset().top - e.pageY;
			mouseLeft = self.dom.block.offset().left - e.pageX;

			startTop = e.pageY
*/
			testHeight = self.dom.editor.height() - e.pageY;
			testWidth = self.dom.block.width() + e.pageX;
			testLeft = self.dom.block.offset().left - e.pageX;



		});

		this.dom.block.hide();

		return this;
	},

	setCode : function(code)
	{
		var isVisible = this.dom.block.is(':visible');
		code = code || "";
		this.dom.block.show();
		if(typeof code !== 'string'){
			code = JSON.stringify(code, null, '  ');
		}
		this.editor.setValue(code);
		if(!isVisible) this.dom.block.hide();
		return this;
	},

	show : function()
	{
		this.dom.block.show();
		return this;
	},

	showErrors : function(errors)
	{
		this.dom.errors.show();
		this.dom.errorMsg.html(errors);
		return this;
	}

});