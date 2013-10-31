var mongoose = require('mongoose');


var PlanSchema = mongoose.Schema({
	id          : String,
	script      : { type : String, default : fs.readFileSync('default_calculator.js','utf8')},
	created     : { type: Date,    default: Date.now },

	title       : { type : String, default : 'New Plan'},
	description : { type : String, default : 'Click to edit'},
	color       : { type : String, default : 'yellow'},
	icon        : { type : String, default : 'icon-file-alt'},

	url         : String,
	group       : String,
	keywords    : [String],
	dev         : { type : Boolean, default : true},
	tiers       : [String]
});

//Returns true if the user can access this calculator
PlanSchema.methods.isUserAllowed = function(user){
	user = user || {};

	if(user.account_type === 'admin') return true;

	//Only Admins can access in dev calculators
	if(this.dev) return false;

	//HACK: For now allows all guests to access calculators
	return true;

	//For now beta users can access all calculators
	if(user.account_type === 'beta') return true;

	if(_.contains(this.tiers, user.account_type)) return true;

	return false;
}

PlanSchema.statics.findByUrlOrId = function(id, callback){
	this.findOne({ $or:[ {'id':id}, {'url':id},]}, callback);
};



Plan = mongoose.model('Plan', PlanSchema);



//API
var filterCalc = function(req,res,next){
	if(req.model){
		if(!req.model.isUserAllowed(req.user)){
			req.model = undefined;
		}
	}

	if(req.models){
		req.models = _.filter(req.models, function(calc){
			return calc.isUserAllowed(req.user);
		});
	}

	return next();
};


xo.api('/api/calculators', Plan, {
	//get  : [mw.forceUser, filterCalc],
	get  : [mw.loadUser, filterCalc],
	put  : [mw.adminOnly],
	post : [mw.adminOnly],
	del  : [mw.adminOnly]
});

