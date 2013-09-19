
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

_.mixin({
	evalue : function(obj){
		if(typeof obj === 'function') return obj();
		return obj;
	}
});


//Generator Arrays Test
Array.prototype.get = function(index){
	if(this.length > index){
		return this[index];
	}else if(typeof this.generator === 'function'){
		if(this.length===0) this.push(this.initial);
		while(this.length - 1 < index){
			this.push(this.generator(this[this.length - 1], this.length - 1));
		}
		return this[index];
	}
};


var test = [];
test.initial = 3;
test.generator = function(prevValue){
	return prevValue + 1;
};

test.get(3); //returns 6
test         //returns [3,4,5,6]
test[2]      //return 5








//maybe remove
jQuery.fn.getSchematic = function(schematicName){
	var schematicElement = jQuery('[xo-schematic="' + schematicName + '"]');
	if(schematicElement.length === 0 ){throw 'ERROR: Could not find schematic with name "' + schematicName + '"';}
	var schematicCode    = jQuery('<div>').append(schematicElement.clone().removeAttr('xo-schematic')).html();
	return jQuery(schematicCode);
};