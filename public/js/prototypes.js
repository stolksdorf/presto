//Fix for IE
if (!window.console) (function() {

    var __console, Console;

    Console = function() {
        var check = setInterval(function() {
            var f;
            if (window.console && console.log && !console.__buffer) {
                clearInterval(check);
                f = (Function.prototype.bind) ? Function.prototype.bind.call(console.log, console) : console.log;
                for (var i = 0; i < __console.__buffer.length; i++) f.apply(console, __console.__buffer[i]);
            }
        }, 1000);

        function log() {
            this.__buffer.push(arguments);
        }

        this.log = log;
        this.error = log;
        this.warn = log;
        this.info = log;
        this.__buffer = [];
    };

    __console = window.console = new Console();
})();

//Change renderers to update the view themselves, rather then return a value
Type = {
	Number : {
		type : 'number',
		is : function(typeObj){
			return typeObj.type === 'number';
		},
		isNumerical : true,
		renderer : function(value, view){
			if(view){
				view.text((value*1).round(2));
				if(typeof value === 'undefined'){
					view.text('--');
				}
			}
			return (value*1).round(2);
		}
	},

	Percent : {
		isNumerical : true,
		renderer : function(value, view){
			var val = +(value * 100).toFixed(3) + '%';
			if(view){
				view.text(val);
				if(typeof value === 'undefined'){
					view.text('--');
				}
			}
			return val;
		}
	},

	Money : {
		isNumerical : true,
		renderer : function(value, view)
		{
			var val = ("$" + (value * 1).toFixed(2)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
			if(view){
				view.css('color', 'inherit');
				if(value < 0) view.css('color', 'red');
				view.text(val);
				if(typeof value === 'undefined'){
					view.text('--');
				}
			}
			return val;
		},
	},

	Text : {
		isNumerical : false,
		renderer : function(value, view){
			if(view){
				view.text(value+"");
			}
			return value+"";
		}
	},

	Notes : {
		isNumerical : false,
		renderer : function(value, view){
			if(view){
				view.text(value);
			}
			return value;
		}
	}
};


makeGeneratorArray = function(arr, fn){

	arr.reduce = function(fn, memo){
		for(var i=0; i < this.length; i++){
			memo = fn(memo, this[i], i);
		}
		return memo;
	};

	arr.map = function(fn){
		var result = [];
		for(var i=0; i < this.length; i++){
			result.push(fn(this[i], i));
		}
		return makeGeneratorArray(result);
	}

	arr.sum = function(){
		return this.reduce(function(memo,num){
			return memo + num;
		},0);
	};

	arr.last = function(){
		return this[this.length-1];
	}

	arr.max = function(){
		return this.reduce(function(memo, num){
			if(num > memo || !memo) return num;
			return memo;
		});
	};

	arr.min = function(){
		return this.reduce(function(memo, num){
			if(num < memo || !memo) return num;
			return memo;
		});
	};

	arr.delta = function(){
		return this.max() - this.min();
	};

	arr.find = function(fn){
		return this.reduce(function(memo,obj, index){
			if(fn(obj,index) && !memo) return obj;
			return memo;
		});
	};

	arr.filter = function(fn){
		return this.reduce(function(memo,obj, index){
			if(fn(obj,index)) memo.push(obj);
			return memo;
		},[]);
	};

	return arr;
};


/**
 * Number Prototypes
 */
Number.prototype.pow = function(ex){
	return Math.pow(this, ex);
}

Number.prototype.round = function(digits) {
	var digits = digits || 0;
	if(digits === 0){
		return Math.round(this);
	}
	return Math.round(this * Math.pow(10,digits)) / Math.pow(10,digits);
};

Number.prototype.ceil = function() {
	return Math.ceil(this);
};

Number.prototype.floor = function() {
	return Math.floor(this);
};

String.prototype.startsWith = function (str){
	return this.indexOf(str) == 0;
};

String.prototype.endsWith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};



/**
 * Underscore Mixins
 */
_.mixin({
	evalue : function(obj){
		if(typeof obj === 'function') return obj();
		return obj;
	},
	evalueObj  : function(obj){
		return _.keymap(obj, function(val){
			return _.evalue(val);
		});
	},
	keymap : function(obj, fn){
		var result = {};
		for(var propName in obj){
			if(obj.hasOwnProperty(propName)){ result[propName] = fn(obj[propName], propName); }
		}
		return result;
	},
	compare : function(obj1, obj2){
		return JSON.stringify(obj1) === JSON.stringify(obj2)
	},

	async : function(func){
		return function(){
			var self = this, args = arguments;
			setTimeout(function(){
				func.apply(self, args)
			}, 0);
		};
	}
});



jQuery.fn.toggleClass = function(classname){
	if(this.hasClass(classname)){
		this.removeClass(classname);
	} else {
		this.addClass(classname);
	}
	return this;
}