**Note:** Anything with an '*' beside means it's planned but not implemented yet

#Presto
A service for creating detailed and interactive investment calculators

## Presto Markup Language

Presto Markup Language, PML is a simplified version of Javascript to faciliate calculator creation. It's heavily based on JSON, with functions added in. PML is broken down into four major sections: **Calculator Details**, **Inputs**, **Charts**, and **Outputs**.

### Calculator Details
This is a list of attributes about the calculator used for basic presentaiton, sorting, and filtering.

`title`       *(string)* : The name of the calculator to be displayed

`description` *(string)* : A description to explain what the calculator does

`icon`        *(string)* : An identifer used for the icon. Refer to [this cheatsheet](http://fortawesome.github.io/Font-Awesome/cheatsheet/) *

`color`       *(string)* : An identifier used to decide the accent colors for the calculator. The list includes : `teal`, `green`, `blue`, `purple`, `steel`, `yellow`, `orange`, `red`, `silver`, `grey`. [Color Reference](http://flatuicolors.com/) *

`group`       *(string)* : An identifer to the group this calculator should belong to when displayed on the home page*

`keywords`    *(array of strings)* : Keywords used for searching and filtering.*

	{
		title       : 'LTC Price Comparison',
		description : 'A comaprison of LTC',
		icon        : 'icon-plane',
		color       : 'blue'
		group       : 'investment',
		keywords    : ['benefits', 'inflation', 'ltc', 'unguarded', 'guarded'],
		inputs      : {...},
		chart       : {...},
		outputs     : {...}
	}

### Inputs
List of inputs to be generated for the user to modify.

`title` *(string)* : A display name for the input

`description` *(string:optional)* : Text describing what the input means

`type`  *(Presto Type)* : One of the Types defined in Presto

`value` *(any)*  : The starting value for the input.

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
		}
	}

The `id` of the input is used to identify it in calculations For example if we would like to use the On-Claim percent in a later calculation we can access it's current value by using `Inputs.onClaim`

	function(index, previousCellValue){
		return previousCellValue*(1 + Inputs.onClaim);
	}



### Chart
`title` *(string)* : A display name for the Chart

`description` *(string:optional)* : Text describing what the chart represents

`minRows` *(number:optional)* : The number of rows to initially show for the chart. Defaults to 20. *

`columns` *(objects)* : A list of column definitions for the chart

####Chart columns
`title` *(string)* : Header for the column

`type`  *(type)* : One of the Types defined in Presto

`firstValue` *(function)*  : The starting value for the input. This must always be a function.

`fn` *(function)* : The generator function used to calculate the value of each row. The function will be given the current row index and the previous cell's value as it's two inputs.

	chart : {
		title : 'LTC Rundown',
		minRows : 30,
		columns : {
			age : {
				title : 'Age',
				type  : Type.Number,
				firstValue : function(){
					return Inputs.age;
				},
				//Simply increments the age
				fn    : function(rowIndex, previousCellValue){
					return previousCellValue + 1;
				}
			},
			benefitBase : {
				title : 'Benefit Base',
				type  : Type.Money,
				firstValue : function(){
					return Inputs.guarded;
				},
				fn    : function(index, previousCellValue){
					return previousCellValue*(1 + Inputs.inflationGuard);
				}
			}
		}
	},

The `id` of the column is used in calculations regarding values in the chart. `Chart.benefitBase` will return a array of numbers corresponding to the values in the column. Columns also have many useful functions you can use, such as `sum()` and `filter()`. You can review all available functions here.


### Outputs
Output are very similar to inputs in visuals, but the user can not modify any of the values. Instead you define calculations to determine the value of the outputs.

`title` *(string)* : A display name for the output

`description` *(string:optional)* : Text describing what the output means

`type`  *(type)* : One of the Types defined in Presto

`value` *(function)*  : A function used to determine the value of the output

	outputs : {
		breakEvenOff : {
			title : 'Breakeven (off-claim)',
			description : "Age at which you'll make back your initial investment",
			type : Type.Number,
			value : function(){
				//'find' returns the first value from the chart where the internal function returns true
				//So it'll return the first year where the benefit base is greater then the ungaurded benefit
				var breakEvenAge = Chart.age.find(function(rowIndex, age){
					if(Chart.benefitBase[rowIndex] > Inputs.unguarded){
						return true;
					}
					return false;
				});
				return breakEvenAge;
			}
		}
	}



## Presto Types
Types in Presto allow the engine to know how you want your value to be rendered and how to do math with it. All types will be stored under the global `Type` variable.

`Type.Number` - Will render the number as is to the screen

`Type.Money` - Takes a number and renders it with the appropriate commas, round to two decimal places, and dollar sign. If negative it will appear red. `23591.089` -> $23,591.09

`Type.Percent` - Takes a decimal and multiply it by 100, round to 3 decimal places, and add the percent sign. `0.345123` -> 34.512%

`Type.Text` - Just renders the value as text. Pretty simple.



## Column Functions
Every column has a number of functions built-in to make calculations simple and readable.

`[rowIndex]` - Returns the value at the given row index

`sum()` - Returns the sum of the column*

`max()` - Returns the highest value of the column*

`min()` - Returns the lowest value of the column*

`delta()` - Returns the difference between the min and the max*

`map(function)` - Runs the given function on each value of the column, and returns the updated array*

`find(function)` - Returns the first value found in which the given function returns true

`filter(function)` - Returns an array of value in which the given function returns true*

	Chart.exampleColumn = [5, 8, 23.5, 1, 51, 42.01];

	Chart.exampleColumn[2];
	//-> 23.5

	Chart.exampleColumn.sum()
	//-> 130.51

	Chart.exampleColumn.max()
	//-> 51

	Chart.exampleColumn.min()
	//-> 1

	Chart.exampleColumn.delta()
	//-> 50

	Chart.exampleColumn.map(function(rowIndex, rowValue){
		return rowValue * 100;
	})
	//-> [500, 800, 100, 2350, 5100, 4201]

	//Finds first value over 20
	Chart.exampleColumn.find(function(rowIndex, rowValue){
		if(rowValue > 20){
			return true;
		}
		return false;
	})
	//-> 23.5

	//Retuns all values over 20
	Chart.exampleColumn.filter(function(rowIndex, rowValue){
		if(rowValue > 20){
			return true;
		}
		return false;
	});
	//-> [23.5, 51, 42.01]


## Full Calculator Examples
### LTC Price Comparison

		{
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
				title : 'LTC Run Down',
				columns : {
					age : {
						title : 'Age',
						type : Type.Number,
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
