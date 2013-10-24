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
	dev         : Boolean,
	tiers       : [String]
});

//Returns true if the user can access this calculator
CalculatorSchema.methods.isUserAllowed = function(user){
	if(user.account_type === 'admin') return true;

	//Only Admins can access in dev calculators
	if(this.dev) return false;

	//For now beta users can access all calculators
	if(user.account_type === 'beta') return true;

	if(_.contains(this.tiers, user.account_type)) return true;

	return false;
}

CalculatorSchema.statics.findByUrlOrId = function(id, callback){
	this.findOne({ $or:[ {'id':id}, {'url':id},]}, callback);
};



Calculator = mongoose.model('Calculator', CalculatorSchema);



//API
var filterCalc = function(req,res,next){
	if(req.document){
		if(!req.document.isUserAllowed(req.user)){
			req.document = undefined;
		}
	}

	if(req.documents){
		req.documents = _.filter(req.documents, function(calc){
			return calc.isUserAllowed(req.user);
		});
	}

	return next();
};


xo.api('/api/calculators', Calculator, {
	//all  : [mw.forceUser, filterCalcs],
	get  : [mw.forceUser, filterCalc],
	put  : [mw.adminOnly],
	post : [mw.adminOnly],
	del  : [mw.adminOnly]
});

