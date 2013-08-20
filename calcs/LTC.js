
var LTCPriceComparison = function(){
	return {
		title : 'LTC Price Comparison',
		description : 'Super cool thing',
		icon : 'icon-plane',

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
				value : 650
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
					value : function(){
						return Inputs.age;
					},
					fn : Functions.Increment()
				},
				benefitBase : {
					title : 'Benefit Base',
					type : Type.Money,
					value : function(){
						return Inputs.guarded;
					},
					fn : function(index, previousCellValue){
						return previousCellValue*(1 + Inputs.inflationGuard);
					}
				},
				onClaim : {
					title : 'On-Claim',
					type : Type.Money,
					value : function(){
						return Inputs.guarded;
					},
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
					//'find' returns the first value from the chart where the internal function returns true
					//So it'll return the first year where the benefit base is greater then the ungaurded benefit
					var breakEvenAge = Chart.age.find(function(index, age){
						if(Chart.benefitBase[index] > Inputs.unguarded){
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
					var breakEvenAge = Chart.age.find(function(index, age){
						if(Chart.onClaim[index] > Inputs.guarded){
							return true;
						}
						return false;
					});
					return breakEvenAge;
				}
			}
		}
	}
}
