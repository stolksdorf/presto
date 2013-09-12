var Presto_CodeEditor_ErrorMap = {
	"Uncaught SyntaxError: Unexpected token ILLEGAL" : "Finish ya quotes man!",
	"Uncaught SyntaxError: Unexpected identifier" : "Yo bro, you're missing a comma on the previous line"
};


Presto_Block_CodeEditor = XO.Block.extend({
	block : 'codeEditor',

	render : function()
	{
		var self = this;
		this.editor = CodeMirror(this.dom.editor[0],
		{
			value          : "",
			mode           : 'javascript',
			viewportMargin : Infinity,
			lineNumbers    : true,
			matchBrackets  : true,
			tabMode        : 'indent'
		});

		this.dom.closeButton.click(function(){
			self.dom.block.hide();
		});

		this.dom.runButton.click(function(){
			self.model.set('script', self.getCode());
			self.model.execute();
			self.showMessage('Updated calculator', 'success');
		});

		this.dom.uploadButton.click(function(){
			self.showMessage('Uploading to server...', 'info');
			self.model.set('script', self.getCode());
			self.model.upload(function(){
				self.showMessage('Upload Successful!', 'success');
				alert('Uploaded');
			});
		});

		this.model.onChange('script', function(newScript){
			self.setCode(newScript);
		});

		//Catches any eval errors
		window.onerror = function(error, fileName, lineNumber){
			if(Presto_CodeEditor_ErrorMap[error]){
				error = Presto_CodeEditor_ErrorMap[error];
			}
			if(lineNumber){
				self.editor.addLineClass(
					self.editor.getLineHandle(lineNumber-1),
					'background',
					'codeEditor__editor__errorLine');
				self.showMessage('line ' + lineNumber + ' : ' + error, 'error');
				return;
			}
			self.showMessage(error, 'error');
			return;
		};


		this.addWindowTraits(this.dom.block, this.dom.topbar)
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
	hide : function()
	{
		this.dom.block.hide();
		return this;
	},

	showMessage : function(msgText, msgType)
	{
		this.dom.success.hide();
		this.dom.error.hide();
		this.dom.info.hide();
		this.dom[msgType].stop().show().find('span').text(msgText);
		if(msgType==='success') this.dom[msgType].delay(3000).fadeOut(1200);
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
				target.height(event.pageY - heightOffset);
				target.width(event.pageX - widthOffset);
			}
		}).on('mouseup', function(){
			dragging = false;
			resizingLeft = false;
			resizingRight = false;
		});


		return this;
	},


});