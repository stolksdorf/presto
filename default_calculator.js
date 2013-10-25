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

	global : {

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
					firstValue : function(){
						return Inputs.age;
					},
					generator : function(previousValue, index){
						return previousValue + 1;
					}
				},
				capitalDelta : {
					title : 'Capital Change',
					type  : Type.Money,
					firstValue : function(){
						return Inputs.capital;
					},
					generator : function(previousValue, index){
						return previousValue + 100;
					}
				},
				baseChange : {
					title : 'Base Change',
					type  : Type.Money,
					firstValue : function(){
						return 0;
					},
					generator : function(previousValue, index){
						return previousValue + 150;
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
					if(Tables.sample.capitalDelta[index] < Tables.sample.baseChange[index]){
						return true;
					}
					return false;
				});
				return breakEvenAge;
			}
		}
	}
}
