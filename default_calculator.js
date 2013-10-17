{
	id          : '{{ID}}',
	title       : 'New Calculator',
	description : 'Click to edit COOOL',
	icon        : 'icon-file-alt',
	color       : 'purple',

	inputs : {
		capital : {
			title : 'Capital',
			description : 'How much money ya got',
			type  : Type.Money,
			initialValue : 500
		},
		age : {
			title : 'Age',
			type  : Type.Number,
			initialValue : 25
		}
	},

	tables : {
		sample : {
			title : 'Sample Table',
			columns : {
				age : {
					title : 'Age',
					type : Type.Number,
					firstCell : function(){
						return Inputs.age;
					},
					generator : function(previousCellValue, index){
						return previousCellValue + 1;
					}
				},
				capitalDelta : {
					title : 'Capital Change',
					type  : Type.Money,
					firstCell : function(){
						return Inputs.capital;
					},
					generator : function(previousCellValue, index){
						return previousCellValue + Math.random()*100;
					}
				},
				random : {
					title : 'Random',
					type  : Type.Money,
					firstCell : function(){
						return 0;
					},
					generator : function(previousCellValue, index){
						return previousCellValue + Math.random()*100;
					}
				},
			}
		}
	},

	charts : {
		basic : {
			title : function(){
				return 'Sample Chart' + Outputs.test;
			},
			hover : function(x,y,label){
				return '<b>$' + y + '</b> at month ' + x + '</br>' + label;
			},
			breakeven : [ ['capitalDelta', 'random'] ],
			table : 'sample',
		}
	},

	outputs : {
		breakeven : {
			title : 'Break-even Age',
			description : 'Age at which you made 10% of your initial capital',
			type : Type.Number,
			value : function(){
				var breakEvenAge = Tables.sample.age.find(function(age, index){
					if(Tables.sample.capitalDelta[index] > Inputs.capital * 1.10){
						return true;
					}
					return false;
				});
				return breakEvenAge;
			}
		}
	}
}
