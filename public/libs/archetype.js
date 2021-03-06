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

	//Shime for getPrototypeOf for IE9/8
	Object.getPrototypeOf = Object.getPrototypeOf || function (obj) {
		return obj.constructor.prototype;
	};



	var archetype_EventCount = new Date().getTime();

/*
	var fullCall = function(obj,method, args){
		if(obj[method]) fullCall(Object.getPrototypeOf(obj), args);
		if(obj.hasOwnProperty(method)){
			console.log('test', obj[method]);

			obj[method].apply(newObj, args);
		}
	};
*/

	Archetype = {
		initialize : function(){
			return this;
		},
		create : function(){
			var newObj = Object.create(this); //rename new obj

			//make deep call badass
			var params = Array.prototype.slice.apply(arguments);
			params.unshift('initialize');
			newObj.deep.apply(newObj, params); //possibly do not need apply
			newObj.trigger('created');
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
		deep : function(method, arg1, arg2){
			var self = this;
			var deepcall = function(obj,method,args){
				//console.log('WOO', obj.hasOwnProperty(method), args, obj[method]);
				if(obj[method]) deepcall(Object.getPrototypeOf(obj), method, args);
				if(obj.hasOwnProperty(method)){
					//console.log(obj[method], args);
					obj[method].apply(self, args); //collaspe this
				}
			};
			return deepcall(this, method, Array.prototype.slice.apply(arguments).slice(1));
		},

/*
		deep2 : function(method){
			var self = this;
			var deep = function(){
				if(this[method]) deep.apply(Object.getPrototypeOf(this), arguments);
				if(this.hasOwnProperty(method)) this[method].apply(self, arguments);
			};
			return deep.bind(this);
		},
*/
	};

	Archetype_Events = {
		on : function(eventName, event){
			archetype_EventCount++;
			this.__events__ = this.__events__ || [];
			this.__events__.push({
				id    : archetype_EventCount,
				name  : eventName,
				event : event
			});
			return archetype_EventCount;
		},
		trigger : function(eventName){
			//console.log('ARCH - trigger', eventName);
			this.__events__ = this.__events__ || [];
			//console.log('looping through', eventName, this.__events__.length);
			for(var i = 0; i < this.__events__.length; i++) {
				if(eventName === this.__events__[i].id || eventName === this.__events__[i].name){
					//console.log('ARCH - doing', this.__events__[i].id);
					this.__events__[i].event.apply(this, Array.prototype.slice.apply(arguments).slice(1)); //move 1 are aparameter of first slice
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



	Archetype.mixin(Archetype_Events);
	//Archetype.mixin(Archetype_Super);
	archetype = Archetype;
})();









