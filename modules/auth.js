mongoose = require('mongoose');



var ErrorCode = {
	0 : 'Could not find unique AuthUser',
	1 : 'AuthUser already exists',
	2 : 'Malformed query'
};

//Schemas
var AuthUserSchema = mongoose.Schema({
	id          : String,
	fingerprint : String,
	cookie      : String,
	date        : { type: Date, default: Date.now },
});
var AuthUser = mongoose.model('AuthUser', AuthUserSchema);



//Uses just the fingerprint data to find the ser
//falls back to cookie
exports.get = function(data, callback){
	if(typeof data.fingerprint === 'undefined'){
		callback(ErrorCode[2]);
	}

	AuthUser.find({fingerprint : data.fingerprint},
		function (err, user) {
			if(err){
				callback(err);
			}else if(user.length === 1){
				callback(undefined, user[0].id);
			}else if(user.length === 0){
				callback(ErrorCode[0]);
			}else{
				exports.match(data, callback);
			}
		}
	);
};

//Uses both fignerpritn and cookie data to find a user
exports.match = function(data, callback){
	if(typeof data.fingerprint === 'undefined' || typeof data.cookie === 'undefined'){
		callback(ErrorCode[2]);
	}
	AuthUser.find({
			fingerprint : data.fingerprint,
			cookie      : data.cookie
		},
		function (err, user) {
			if(err){
				callback(err);
			}else if(user.length === 1){
				callback(undefined, user[0].id);
			}else{
				callback(ErrorCode[0]);
			}
		}
	);
};

exports.add = function(data, callback){
	exports.match(data, function(noAuthUser, user){
		if(user){ return callback(ErrorCode[0]); }
		var newAuthUser = new AuthUser(data);
		return newAuthUser.save(callback);
	});
};


exports.all = function(cb){
	AuthUser.find({},cb);
}



//Creates and stores a register link into the DB for a given user, and returns the url
// Will expire after a given time period
// On clicking the register link, it will add the browser finger print to their account
exports.createRegisterLink = function(id){

}

/*
exports.htmlSnippet = function(req,res){
	return res.render('auth.html');
};

/*
exports.route = function(path, middleware, render){
	if(typeof render === 'undefined'){
		render = middleware;
		middleware = [];
	}
	app.get(path, exports.htmlSnippet);
	app.post(path, middleware, render);
};
*/
