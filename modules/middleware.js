
var _loadUser = function(req,res,callback){
	var cookie = req.cookies.presto_auth;
	if(cookie){
		User.findOne({'auth.cookie' : cookie}, function(err, user){
			if(err || !user){ return callback(req, res); }
			req.user = user;
			console.log('Logged in:', user.email);
			return callback(req,res);
		});
	} else{
		return callback(req,res);
	}
}


exports.loadUser = function(req,res,next){
	_loadUser(req,res,function(){
		next();
	});
};


exports.adminOnly = function(req,res,next){
	_loadUser(req,res, function(req,res){
		if(req.user){
			if(req.user.account_type === 'admin'){
				console.log('Admin valided');
				return next();
			}
		}
		return res.send(401, "Admin only");
	});
};

exports.matchUser = function(req,res,next){
	_loadUser(req,res, function(req,res){
		if(req.user){
			if(req.user.account_type === 'admin' || req.user.id === req.params.id){
				return next();
			}
		}
		return res.send(401, "Unauthorized user");
	});
};

exports.forceLogin = function(req,res,next){
	_loadUser(req,res, function(req,res){
		if(!req.user){
			return res.redirect('/register');
		}
		return next();
	});
};

exports.forceUser = function(req,res,next){
	_loadUser(req,res, function(req,res){
		if(!req.user){
			return res.send(401, 'No user');
		}
		return next();
	});
};

