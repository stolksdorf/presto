var mongoose = require('mongoose');


var CalculatorSchema = mongoose.Schema({
	id          : String,
	script      : { type : String, default : fs.readFileSync('default_calculator.js','utf8')},
	created     : { type: Date,    default: Date.now },

	title       : { type : String, default : 'New Calculator'},
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
CalculatorSchema.methods.isUserAllowed = function(user){
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

CalculatorSchema.statics.findByUrlOrId = function(id, callback){
	this.findOne({ $or:[ {'id':id}, {'url':id}]}, callback);
};



Calculator = mongoose.model('Calculator', CalculatorSchema);



//API
var filterCalcForUser = function(req,res,next){
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


xo.api('/api/calculators', Calculator, {
	get  : [mw.loadUser, filterCalcForUser],
	put  : [mw.adminOnly],
	post : [mw.adminOnly],
	del  : [mw.adminOnly]
});

