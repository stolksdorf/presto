Presto_Block_CodeEditor = XO.Block.extend({

	block : 'codeEditor',

	initialize : function(code)
	{
		this._code = code || "";
		this._setup();
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
			try{
				self.trigger('run');
				self.showMessage('Updated calculator', 'success');
			}catch(error){
				self.showMessage('ERROR: ' + error.message, 'error');
			}
		});

		this.dom.uploadButton.click(function(){
			try{
				self.showMessage('Uploading to server...', 'info');
				self.trigger('upload');
			}catch(error){
				self.showMessage(error.message, 'error');
			}
		});


		this.addWindowTraits(this.dom.block, this.dom.topbar)
		this.showMessage('Rendered Code Editor!', 'success');
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

	getCode : function()
	{
		return this.editor.getValue();
	},

	show : function()
	{
		this.dom.block.show();
		return this;
	},

	showMessage : function(msgText, msgType)
	{
		this.dom.success.hide();
		this.dom.error.hide();
		this.dom.info.hide();
		this.dom[msgType].show().find('span').text(msgText);
		return this;
	},


	addWindowTraits : function(target, topbar)
	{

		var topOffset,
			leftOffset,
			heightOffset,
			widthOffset;

		//Add dragging
		var dragging;
		topbar.on('mousedown', function(event){
			event.preventDefault();
			dragging = true;
			topOffset  = target.offset().top - event.pageY;
			leftOffset = target.offset().left - event.pageX;
		});

		//Add global mouse watcher
		$('body').on("mousemove", function(event) {
			if (dragging) {
				target.offset({
					top : event.pageY + topOffset,
					left: event.pageX + leftOffset
				});
			}
			if(resizingLeft){
				//check for min dimensions
				if(parseInt(target.css('min-height')) <= event.pageY - heightOffset){
					target.height(event.pageY - heightOffset);
				}
				if(parseInt(target.css('min-width')) <= widthOffset - event.pageX){
					target.width(widthOffset - event.pageX);
					target.offset({left: event.pageX + leftOffset});
				}
			}
			if(resizingRight){
				//check for min dimensions
				if(parseInt(target.css('min-height')) <= event.pageY - heightOffset){
					target.height(event.pageY - heightOffset);
				}
				//if(parseInt(target.css('min-width')) <= widthOffset - event.pageX){
					target.width(event.pageX - widthOffset);
					//target.offset({left: event.pageX + leftOffset});
				//}
			}
		}).on('mouseup', function(){
			dragging = false;
			resizingLeft = false;
			resizingRight = false;
		});

		//Add resizing
		var resizingLeft;
		var leftResize = $('<div></div>').appendTo(target).css({
			position: 'absolute',
			bottom  : 0,
			left    : 0,
			height  :'15px',
			width   :'15px',
			cursor  : 'sw-resize',
		});
		leftResize.on('mousedown', function(event){
			event.preventDefault()
			resizingLeft = true;
			heightOffset = event.pageY - target.height();
			widthOffset  = target.width() + event.pageX;
			leftOffset   = target.offset().left - event.pageX;
		});

		var resizingRight;
		var rightResize = $('<div></div>').appendTo(target).css({
			position: 'absolute',
			bottom  : 0,
			right   : 0,
			height  :'15px',
			width   :'15px',
			cursor  : 'se-resize',
		});
		rightResize.on('mousedown', function(event){
			event.preventDefault()
			resizingRight = true;
			heightOffset = event.pageY - target.height();
			widthOffset  = event.pageX - target.width();
			leftOffset   = target.offset().left - event.pageX;
		});
		return this;
	},


});