{
	info : {
		title       : 'New Calculator',
		description : 'Click to edit',
		icon        : 'icon-file-alt',
		color       : 'yellow',
		group       : '',
		keywords    : [],
		tiers       : [],

		dev         : true
	},

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
						return previousCellValue + 100;
					}
				},
				baseChange : {
					title : 'Base Change',
					type  : Type.Money,
					firstCell : function(){
						return 0;
					},
					generator : function(previousCellValue, index){
						return previousCellValue + 150;
					}
				},
			}
		}
	},

	charts : {
		basic : {
			title : 'Sample Chart',
			hover : function(x,y,label){
				return '<b>$' + y + '</b> at month ' + x + '</br>' + label;
			},
			breakeven : [ ['capitalDelta', 'baseChange'] ],
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
