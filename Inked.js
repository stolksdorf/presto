
var mongoUri = process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/inked';

var mongoose = require('mongoose');

mongoose.connect(mongoUri);
mongoose.connection.on('error', function(){
	//console.log(">>>ERROR: Connect Mongodb ya goof!");
});



var ErrorCode = {
	0 : 'Could not find unique User',
	1 : 'User already exists'
};


var InkedUser = mongoose.model('InkedUser', mongoose.Schema({
	userId : String,
	fingerprint : String,
	collisionCookie : String,
	date: { type: Date, default: Date.now },
}));


var InkedRegisterLink = mongoose.model('InkedRegisterLink', mongoose.Schema({
	userId : String,
	fingerprint : String,
	collisionCookie : String,
	date: { type: Date, default: Date.now },
}));



var addUser = function(userId, fingerprint, collisionCookie, callback){
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
	getUserCC(fingerprint, collisionCookie, function(error, user){
		if(error){
			return callback(error);
		}
		if(user){
			return callback(ErrorCode[1]);
		}
		return createUser();
	});
};


var getUser = function(fingerprint, collisionCookie, callback){
	InkedUser.find({fingerprint : fingerprint},
		function (err, user) {
			if(err){
				callback(err);
			}else if(user.length === 1){
				callback(undefined, user[0]);
			}else if(user.length === 0){
				callback(undefined, false);
			}else{
				getUserCC(fingerprint, collisionCookie, callback);
			}
		}
	);
};

var getUserCC = function(fingerprint, collisionCookie, callback){
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


exports.all = function(callback){
	InkedUser.find(function(err, users) {
		callback(users);
	});
};

exports.add = addUser;
exports.get = getUser