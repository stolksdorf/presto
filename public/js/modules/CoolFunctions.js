Presto.registerModule({
	name   : 'coolFunctions',
	//global : 'CoolFunctions',
	order : 009,

	initialize : function()
	{
		CoolFunctions = {
			/**
			 * Returns a function that does a regression analysis
			 * to find the value of a target variable
			 * @param  opts
			 *         func  : {function}    the target equation, should return 0 when correct
			 *         range : {[min, max]}  the min and max values the target value could be
			 *         accur : {number}      the magnitude of how small you want the error
			 */
			variableFinder : function(opts){
				var cache = {},
					accur = opts.accur || 2,
					inc = Math.pow(10, -1*accur);
				return function(){
					var hash =  Array.prototype.join.apply(arguments);
					if(cache[hash]){return cache[hash];}
					var error, result;
					for(var i = opts.range[0]; i <= opts.range[1]; i = i + inc){
						var args = Array.prototype.slice.apply(arguments);
						args.push(i);
						var r = Math.abs(opts.func.apply(undefined, args));
						if((typeof error === 'undefined' || r < error) && !isNaN(r)){
							error = r;
							result = i;
						}
					}
					cache[hash] = result;
					return result;
				}
			},




		};
		return this;
	},


});