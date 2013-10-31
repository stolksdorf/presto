var mongoose = require('mongoose');


var PlanSchema = mongoose.Schema({
	id          : String,
	plan_id     : { type : String,  default : 'new_plan'},
	name        : { type : String,  default : 'New Plan'},
	description : { type : String,  default : 'Cool new Plan'},
	cost        : { type : Number,  default : 0},
	isSelectable: { type : Boolean, default : true},
	color       : { type : String,  default : 'black'},
	icon        : { type : String,  default : 'icon-star'},
});

Plan = mongoose.model('Plan', PlanSchema);

xo.api('/api/plans', Plan, {
	get  : [],
	put  : [mw.adminOnly],
	post : [mw.adminOnly],
	del  : [mw.adminOnly]
});

