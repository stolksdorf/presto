
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
				view.text(value*1);
				if(typeof value === 'undefined'){
					view.text('--');
				}
			}
			return value*1;
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



/* Functions */
Functions = {
	Increment : function(diff){
		return function(index, prevValue){
			return prevValue + (diff || 1);
		}
	}
}


/* Prototype mods */
Array.prototype.last = function(){
	return this[this.length-1];
}

Array.prototype.map = function(fn){
	var result = [];
	for(var propName in this){
		if(this.hasOwnProperty(propName)){ result.push(fn(this[propName], propName)); }
	}
	return result;
}

Array.prototype.reduce = function(fn, memo){
	for(var propName in this){
		if(this.hasOwnProperty(propName)){ memo = fn(memo, this[propName], propName); }
	}
	return memo;
}

Array.prototype.max = function(){
	return this.reduce(function(memo, num){
		if(num > memo || !memo) return num;
		return memo;
	});
};

Array.prototype.min = function(){
	return this.reduce(function(memo, num){
		if(num < memo || !memo) return num;
		return memo;
	});
};

Array.prototype.delta = function(){
	return this.max() - this.min();
};

Array.prototype.sum = function(){
	return this.reduce(function(memo,num){
		return memo + num;
	},0);
};

Array.prototype.find = function(fn){
	return this.reduce(function(memo,obj, index){
		if(fn(obj,index) && !memo) return obj;
		return memo;
	});
};

Array.prototype.filter = function(fn){
	return this.reduce(function(memo,obj, index){
		if(fn(obj,index)) memo.push(obj);
		return memo;
	},[]);
};
