;(function($){

	/**
	 * Shim for Object.create, in case the browser doesn't support it
	 */
	if (typeof Object.create === 'undefined') {
		Object.create = function (o) {
			function F() {};
			F.prototype = o;
			return new F();
		};
	}

	var inputHTML    = '<input type="text" class="widget__control"/>';
	var textareaHTML = '<textarea class="widget__control"></textarea>';

	var Widget = {
		initialize : function(target, options)
		{
			var self = this;
			options = options || {};
			this._enabled = false;
			this._events  = [];

			this.view    = target.addClass('widget__view');


			//Options
			if(typeof options.renderer === 'function'){
				this.renderer = options.renderer;
			}
			if(options.use_textarea){
				this.control = $(textareaHTML).insertAfter(target);
			} else {
				this.control = $(inputHTML).insertAfter(target);
			}
			if(typeof options.value !== 'undefined'){
				this.value(options.value)
			} else {
				this.value(this.view.html());
			}

			if(typeof options.event === 'undefined'){
				this.interactionEvent = 'click';
			} else {
				this.interactionEvent = options.event;
			}


			if(typeof options.onChange === 'function'){
				this.onChange(options.onChange);
			}

			//setup events
			this.control
				.val(this.value())
				.hide();

			//User clicks on text
			this.view.on(this.interactionEvent, function() {
				if(self._enabled) {
					self.showControl();
				}
			});

			//Lose Focus on textbox
			this.control.blur(function() {
				self.showView();
			});

			//Press enter on textbox
			this.control.keyup(function(event) {
				if(event.keyCode === 13 && !options.use_textarea) {
					self.showView();
				}
			});

			this.enable();
			return this;
		},

		showControl : function()
		{
			if(!this._enabled) { return this; }
			this.view.hide();
			this.control.width(this.view.width());

			if(this.view.height() > this.control.height()){
				this.control.height(this.view.height())
			}
			this.control.css('font-size', this.view.css('font-size'));

			this.control.show().focus();
			return this;
		},

		showView : function()
		{
			this.value(this.control.val());
			this.view.show();
			this.control.hide();
			return this;
		},

		enable : function()
		{
			if(!this._enabled){
				this._enabled = true;
				this.view.addClass('widget__view');
			}
			return this;
		},

		disable : function()
		{
			if(this._enabled){
				this._enabled = false;
				this.view.removeClass('widget__view');
			}
			return this;
		},

		isEnabled : function()
		{
			return this._enabled;
		},

		value : function(newValue)
		{
			if(typeof newValue === 'undefined'){
				return this._value;
			}
			if(this._value !== newValue){
				this._value = newValue;
				for(var i=0; i < this._events.length; i++){
					this._events[i](this._value, this);
				}
				this.renderer(this._value, this.view);
			}
			return this;
		},

		onChange : function(fn)
		{
			if(typeof fn === 'function'){
				this._events.push(fn);
			}
			return this;
		},

		/**
		 * The user can overwrite this to have the view show a different value then it has
		 * @param  {string/num} value
		 * @param  {jQuery element} view
		 */
		renderer : function(value, view)
		{
			view.text(value);
		},
	};

	$.fn.widget = function(options) {
		return Object.create(Widget).initialize($(this), options);
	};
})(jQuery);