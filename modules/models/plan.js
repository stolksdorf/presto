var mongoose = require('mongoose');


var PlanSchema = mongoose.Schema({
	id          : String,
	name        : String,
	description : String,
	cost        : Number,
	isSelectable: {type : Boolean, default: true},


	color       : { type : String, default : 'black'},
	icon        : { type : String, default : 'icon-star'},
});

Plan = mongoose.model('Plan', PlanSchema);

xo.api('/api/plans', Plan, {
	get  : [],
	put  : [mw.adminOnly],
	post : [mw.adminOnly],
	del  : [mw.adminOnly]
});

