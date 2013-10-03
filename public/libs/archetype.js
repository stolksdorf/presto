;(function(){
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
	window.Archetype_EventCount = new Date().getTime();
	Archetype = {
		initialize : function(){
			return this;
		},
		instance : function(){
			var newObj = Object.create(this);
			newObj.__super__ = this.__super__ || this;
			return newObj.initialize.apply(newObj, arguments);
		},
		create : function(){
			var newObj = Object.create(this);
			//newObj.__super__ = this.__super__ || this;
			if(arguments.length) newObj.initialize.apply(newObj, arguments);
			return newObj;
		},
		extend : function(methods){
			return Object.create(this).mixin(methods);
		},
		mixin : function(methods){
			for(var methodName in methods){
				this[methodName] = methods[methodName];
			}
			return this;
		},
		super : function(methodName){
			return Object.getPrototypeOf(this.__super__ || this)[methodName]
					.apply(this, Array.prototype.slice.apply(arguments).slice(1));
		},

		on : function(eventName, event){
			Archetype_EventCount++;
			this.__events__ = this.__events__ || [];
			this.__events__.push({
				id    : Archetype_EventCount,
				name  : eventName,
				event : event
			});
			return Archetype_EventCount;
		},
		trigger : function(eventName){
			this.__events__ = this.__events__ || [];
			for(var i = 0; i < this.__events__.length; i++) {
				if(eventName === this.__events__[i].id || eventName === this.__events__[i].name){
					this.__events__[i].event.apply(this, Array.prototype.slice.apply(arguments).slice(1));
				}
			}
			return this;
		},
		off : function(eventName){
			if(!eventName){
				this.__events__ = [];
				return this;
			}
			var events = [];
			this.__events__ = this.__events__ || [];
			for(var i = 0; i < this.__events__.length; i++) {
				if(eventName !== this.__events__[i].id && eventName !== this.__events__[i].name){
					events.push(this.__events__[i]);
				}
			}
			this.__events__ = events;
			return this;
		}
	};
})();









