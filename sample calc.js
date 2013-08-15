newCalc = {
	info : {
		name : "Sample",
		description : "This is just a sample calculator",
		group : ['Planning'],
		icon : 'money',
		color : 'green',

	},

	initialize : function()
	{

		var interestRate = AddInput('Interest Rate', 0.05, TYPE.percent);
		var starting     = AddInput('Starting Amount', 20000, TYPE.money);

		var overTime = MakeChart('Over Time');

		var years = overTime.addColumn('Years', 2005, TYPE.number, function(index, year){
			return year;
		});

		var value = overTime.addColumn('Value', starting(), TYPE.money, function(index, prevVal){
			return starting() + starting() * (1 + interestRate())^years()[index];
		});

		var result = AddOutput('Result', TYPE.money, function(){
			return value.last();
		});

		return
	}


}

//Super arrays
superArray = function(arr){

	var value = arr;
	var sArr = value;

	sArr.sum = function(){
		var result = 0;
		for(var i =0; i < value.length; i++){
			result += value[i];
		}
		return result;
	};


	return sArr;
};


var newCalc = {
	name : 'Sample',
	description : 'This is just a sample calculator',

	inputs : {
		interestRate : {
			title : 'Interest Rate',
			description : "The rate at which interest does it's thing",
			type : Type.Percent,
			value : 0.05
		},
		startingValue : {
			title : 'starting Value',
			type : Type.Money,
			value : {
				start : 10000,
				end : 30000
			}
		},
	},

	charts : {
		main : {
			title : 'whatever',
			columns : {
				years : {
					title : 'Years',
					type : Type.Number,
					value : 2003,
					fn : function(index, previousCellValue){
						return previousCellValue + 1;
					}
				},
				earnings : {
					title : 'Earnings',
					type  : Type.Money,
					value : Inputs.startingValue,
					fn : function(index, previousCellValue){
						return previousCellValue + Math.pow(1 + Inputs.interestRate, index);
					}
					bottom : function(){
						return Charts.main.earning.sum();
					}
				}
			}
		}
	},

	outputs : {
		fiveYears : {
			title : 'Earnings after Five Years',
			type : Type.Money,
			value : function(){
				return Charts.main.earnings.at(5)
			}
		},

		doubleEarn : {
			title : "Year where it'll double",
			type : Type.Money,
			value : function(){
				var cell = Charts.main.earning.find(function(val){
					return val >= Inputs.startingValue*2;
				});
				return Charts.main.years.at(cell.index);
			}
		}
	}
}

var LTCPriceComparison = {
	title : 'LTC Price Comparison',
	description : 'Super cool thing',

	inputs : {
		inflationGuard : {
			title : 'Inflation Guard (off-claim)',
			description : 'The estimated inflation rate while off-claim',
			type : Type.Percent,
			value : 0.02
		},
		onClaim : {
			title : 'On-Claim',
			type : Type.Percent,
			value : 0.03
		},
		unguarded : {
			title : 'Unguarded Benefit',
			type : Type.Money,
			value : 1250
		},
		guarded : {
			title : 'Guarded Benefit',
			type : Type.Money,
			value : 500
		},
		divider : TYPE.Divider,
		age : {
			title : 'Age',
			type : Type.Number,
			value : 25
		}
	},

	chart : {
		title : 'Awesome', //Optional if the chart doesn't need a name
		minRows : 100, //Number of rows automatically generated for the chart. Default 20 maybe?


		columns : {
			age : {
				title : 'Age',
				type : Type.Number,
				//Value is the first row of the column, this is used by 'fn' to build the rest of the values.
				value : Inputs.age,
				fn : function(index, previousCellValue){
					return previousCellValue + 1;
				}
			},
			benefitBase : {
				title : 'Benefit Base',
				type : Type.Money,
				value : Inputs.guarded,
				fn : function(index, previousCellValue){
					return previousCellValue*(1 + Inputs.inflationGuard);
				}
			},
			onClaim : {
				title : 'On-Claim',
				type : Type.Money,
				value : Inputs.guarded,
				fn : function(index, previousCellValue){
					return previousCellValue*(1 + Inputs.onClaim);
				}
			},
		}
	},

	outputs : {
		breakEvenOff : {
			title : 'Breakeven (off-claim)',
			description : "Age at which you'll make back your initial investment",
			type : Type.Number,
			value : function(){
				//'lookup' returns the first value from the chart where the internal function returns true
				//So it'll return the first year where the benefit base is greater then the ungaurded benefit
				var breakEvenAge = Chart.age.lookup(function(index, age){
					if(Chart.benefitBase.valueAt(index) > Inputs.unguarded){
						return true;
					}
					return false;
				});
				return breakEvenAge;
			}
		},
		breakEvenOn : {
			title : 'Breakeven (on-claim)',
			type : Type.Number,
			value : function(){
				var breakEvenAge = Chart.age.lookup(function(index, age){
					if(Chart.onClaim.valueAt(index) > Inputs.unguarded){
						return true;
					}
					return false;
				});
				return breakEvenAge;
			}
		}
	}
}