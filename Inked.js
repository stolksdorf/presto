var mongoose,
	app,
	global = {};

var ErrorCode = {
	0 : 'Could not find unique User',
	1 : 'User already exists'
};

exports.set = function(name, value){
	global[name] = value;
};

exports.setup = function(g_app, g_mongoose){
	app = g_app;
	mongoose = g_mongoose;

	//Schemas
	InkedUser = mongoose.model('InkedUser', mongoose.Schema({
		userId : String,
		fingerprint : String,
		collisionCookie : String,
		date: { type: Date, default: Date.now },
	}));


	InkedRegisterLink = mongoose.model('InkedRegisterLink', mongoose.Schema({
		url_key
		expires_



	}));
	return this;
}


var getUserWithCC = function(fingerprint, collisionCookie, callback){
	InkedUser.find({fingerprint : fingerprint, collisionCookie : collisionCookie},
		function (err, user) {
			if(err){
				callback(err);
			}else if(user.length === 1){
				callback(undefined, user[0]);
			}else if(user.length === 0){
				callback(undefined, false);
			}else{
				callback(ErrorCode[0]);
			}
		}
	);
};



exports.add = function(userId, fingerprint, collisionCookie, callback){
	var createUser = function(){
		var newUser = new InkedUser({
			userId          : userId,
			fingerprint     : fingerprint,
			collisionCookie : collisionCookie
		});

		newUser.save(function(error, user){
			if(error){
				return callback(error);
			}
			return callback(undefined, user);
		});
	};

	//check to see if the user exists
	getUserWithCC(fingerprint, collisionCookie, function(error, user){
		if(error){
			return callback(error);
		}
		if(user){
			return callback(ErrorCode[1]);
		}
		return createUser();
	});
};

exports.get = function(fingerprint, collisionCookie, callback){
	InkedUser.find({fingerprint : fingerprint},
		function (err, user) {
			if(err){
				callback(err);
			}else if(user.length === 1){
				callback(undefined, user[0]);
			}else if(user.length === 0){
				callback(undefined, false);
			}else{
				getUserWithCC(fingerprint, collisionCookie, callback);
			}
		}
	);
};


exports.all = function(callback){
	InkedUser.find(function(err, users) {
		callback(users);
	});
};

exports.route = function(route, renderFn){
	app.get(route, function(req,res){
		res.render('inked.html');
	});
	app.post(route, function(req,res){
		if(typeof req.body.inked === 'undefined'){
			return res.send(global.registerRedirect, 403);
		}

		var fp = req.body.inked.fingerprint;
		var cc = req.body.inked.collisionCookie;

		exports.get(fp,cc, function(error, user){
			if(error || !user){
				return res.send(global.registerRedirect, 403);
			}
			return renderFn(req,res,user.userId);
		});
	});
};

//Redirects to this path whenever the fingerprint can not be found
exports.setRegisterPage = function(path, render){
	global.registerRedirect = path;
	app.get(path, function(req,res){
		res.render('inked.html');
	});
	app.post(path, function(req,res){
		return render(req,res);
	});
};

//Creates and stores a register link into the DB for a given user, and returns the url
// Will expire after a given time period
// On clicking the register link, it will add the browser finger print to their account
exports.createRegisterLink = function(userId){

}