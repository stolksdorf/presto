
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
Array.prototype.sum = function(){

};

Array.prototype.last = function(){
	return this[this.length-1];
}





