



exports.adminOnly = function(req,res,next){
	if(req.user){
		if(req.user.account_type === 'admin'){
			console.log('Admin valided');
			return next();
		}
	}
	return res.send(401, "Admin only");
};

exports.matchUser = function(req,res,next){
	if(req.user){
		if(req.user.account_type === 'admin' || req.user.id === req.params.id){
			console.log('Matched user');
			return next();
		}
	}
	return res.send(401, "Unauthorized user");
};

exports.loadUser = function(req,res,next){
	var cookie = req.cookies.presto_auth;
	if(!cookie){
		return res.redirect('/register');
	}
	User.findOne({'auth.cookie' : cookie}, function(err, user){
		if(err || !user){
			console.log('ERR', err);
			return res.redirect('/register');
		}
		req.user = user;
		console.log('Logging in: ' + user.email);
		next();
	});
};
