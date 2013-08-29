
//Change renderers to update the view themselves, rather then return a value
Type = {
	Number : {
		type : 'number',
		is : function(typeObj){
			return typeObj.type === 'number';
		},
		isNumerical : true,
		renderer : function(value, view){
			if(typeof value === 'undefined'){
				view.text('None');
			}
			view.text(value);
		}
	},

	Percent : {
		isNumerical : true,
		renderer : function(value, view){
			if(typeof value === 'undefined'){
				view.text('None');
			}
			view.text(+(value * 100).toFixed(3) + '%');
		}
	},

	Money : {
		isNumerical : true,
		renderer : function(value, view)
		{
			if(typeof value === 'undefined'){
				view.text('None');
			}
			view.css('color', 'inherit');
			if(value < 0) view.css('color', 'red');
			view.text(("$" + (value * 1).toFixed(2)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
		},
	},

	Text : {
		isNumerical : false,
		renderer : function(value, view){
			view.text(value);
		}
	},

	Notes : {
		isNumerical : false,
		renderer : function(value, view){
			view.text(value);
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

/*
Array.prototype.max = function(){
	var val, result, compareval;
	for(var propName in this){
		if(this.hasOwnProperty(propName)){
			compareval = this[propName];
			if(typeof val === 'undefined' || compareval > val){
				val = compareval;
				result = this[propName];
			}
		}
	}
	return result;
}
*/
Array.prototype.min = function(){
	var val, result, compareval;
	for(var propName in this){
		if(this.hasOwnProperty(propName)){
			compareval = this[propName];
			if(typeof val === 'undefined' || compareval < val){
				val = compareval;
				result = this[propName];
			}
		}
	}
	return result;
}

//Array.prototype.min = function(fn){





