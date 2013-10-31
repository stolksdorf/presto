;(function(){
	//Shim for Object.create, in case the browser doesn't support it
	if (typeof Object.create === 'undefined') {
		Object.create = function(proto) {
			function Obj(){};
			Obj.prototype = proto;
			return new Obj();
		};
	}
	var archetype_EventCount = new Date().getTime();

	var ForgeObject = function(proto){
		var obj = Object.create(proto);
		var eventScope = {events : [], scope : obj};

		obj.super     = Object.getPrototypeOf(obj);
		obj.getEvents = obj.getEvents(eventScope);
		obj.on        = obj.on.bind(eventScope);
		obj.trigger   = obj.trigger.bind(eventScope);
		obj.off       = obj.off.bind(eventScope);

		return obj;
	};

	Archetype = archetype ={
		initialize : function(){
			return this;
		},
		create : function(){
			var obj = ForgeObject(this);
			obj.deep('initialize').apply(obj, arguments);
			obj.trigger('created');
			return obj;
		},
		extend : function(methods){
			return ForgeObject(this).mixin(methods);
		},
		mixin : function(methods){
			for(var methodName in methods){
				this[methodName] = methods[methodName];
			}
			return this;
		},
		deep : function(method){
			var self = this;
			var deep = function(){
				if(this[method]) deep.apply(Object.getPrototypeOf(this), arguments);
				if(this.hasOwnProperty(method)) return this[method].apply(self, arguments);
			};
			return deep.bind(this);
		},

		getEvents : function(){
			return this.events;
		},
		on : function(eventName, event){
			this.events.push({
				id    : ++archetype_EventCount,
				name  : eventName,
				event : event
			});
			return archetype_EventCount;
		},
		trigger : function(eventName){
			for(var i in this.events){
				var evt = this.events[i];
				if(eventName == evt.id || eventName == evt.name){
					evt.event.apply(this.scope, Array.prototype.slice.apply(arguments).slice(1));
				}
			}
			return this.scope;
		},
		off : function(eventName){
			var events = [];
			if(!eventName) this.events = [];
			for(var i in this.events){
				var evt = this.events[i];
				if(eventName != evt.id && eventName != evt.name){
					events.push(this.events[i]);
				}
			}
			this.events = events;
			return this.scope;
		}
	};
})();