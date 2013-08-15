Type = {
	Number : {
		type : 'number',
		is : function(typeObj){
			return typeObj.type === 'number';
		},
		isNumerical : true,
		renderer : function(value, view){
			return value;
		}
	},

	Percent : {
		isNumerical : true,
		renderer : function(value, view){
			return value * 100 + '%'
		}
	},

	Money : {
		isNumerical : true,
		renderer : function(value, view)
		{
			view.css('color', 'inherit');
			if(value < 0) view.css('color', 'red');
			return ("$" + (value * 1).toFixed(2)).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		},
	},

	Text : {
		isNumerical : false,
		renderer : function(value, view){
			return value;
		}
	},

	Notes : {
		isNumerical : false,
		renderer : function(value, view){
			return value;
		}
	}
};

Fn = {
	Inc : function(diff){
		return function(index, prevValue){
			return prevValue + (diff || 1);
		}
	}


}



$(document).ready(function(){

/*
	var myInput = new Presto_Block_Input();
	myChart = new Presto_Block_Chart();

	testModel = new XO.Model({
		name : 'col1',
		fn : function(n){
			return n+1;
		},
		start : 4
	});

	test2Model = new XO.Model({
		name : 'col2',
		foot : 'test',
		fn : function(n){
			return n*2;
		},
		start : 4
	});


	myChart.addColumn(testModel)
	myChart.addColumn(test2Model)

	myChart.addRow(10);
*/



	//codeEditor = new Presto_Block_CodeEditor();

	var myCalc = new Presto_Block_Calculator();


	myCalc.makeCalc(LTCPriceComparison);


});


makeCalc = function(){

};


var Inputs = {};
var Outputs = {};
var Chart = {};



var LTCPriceComparison = {
	title : 'LTC Price Comparison',
	description : 'Super cool thing',
	icon : 'plane',

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
		age : {
			title : 'Age',
			type : Type.Number,
			value : 25
		},
		notes : {
			title : 'Notes',
			type : Type.Text,
			value : 'Cool stuff'
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
				value : 25, //Inputs.age,
				fn : Fn.Inc()
			},
			benefitBase : {
				title : 'Benefit Base',
				type : Type.Money,
				value : -700, //Inputs.guarded,
				fn : function(index, previousCellValue){
					return previousCellValue*(1 + Inputs.inflationGuard);
				}
			},
			onClaim : {
				title : 'On-Claim poop',
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