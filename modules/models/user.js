var mongoose = require('mongoose');


var ErrorCode = {
	0 : 'Could not find unique User',
	1 : 'User already exists',
	2 : 'Malformed query'
};

var adminEmails = [
	'nathaniel.howlett@gmail.com',
	'nathaniel.howlett@investorsgroup.com',
	'scott.tolksdorf@gmail.com',
	'scott@prestocalc.com',
	'nate@prestocalc.com'
];


UserSchema = mongoose.Schema({
	email : String,
	account_type : { type: String, default: 'beta'},
	auth : [{
		fingerprint : String,
		cookie      : String
	}],
	date  : { type: Date, default: Date.now },
});


//Methods
UserSchema.methods.isAdmin = function(){
	return this.account_type === 'admin';
};

UserSchema.methods.addFingerprint = function(data, callback){
	this.auth.push({
		fingerprint : data.fingerprint,
		cookie      : data.cookie
	});
	this.save(callback);
};


//Statics

//Finds a user based on the fingerprint, then cookie
UserSchema.statics.get = function(data, callback){
	if(typeof data.fingerprint === 'undefined'){
		return callback(ErrorCode[2]);
	}
	this.find({'auth.fingerprint' : data.fingerprint},
		function(err, user) {
			if(err){
				return callback(err);                 //Mongoose Error
			}else if(user.length === 1){
				return callback(undefined, user[0]);  //Found User
			}else if(user.length === 0){
				return callback(ErrorCode[0]);        //No users
			}else{
				this.match(data, callback);           //Multiple fingerprint matches
			}
		}
	);
};

//Finds a user based on both the fingerpritn and cookie
UserSchema.statics.match = function(data, callback){
	if(typeof data.fingerprint === 'undefined' || typeof data.cookie === 'undefined'){
		callback(ErrorCode[2]);
	}
	this.find({
			'auth.fingerprint' : data.fingerprint,
			'auth.cookie'      : data.cookie
		},
		function(err, user) {
			if(err){
				return callback(err);                 //Mongoose Error
			}else if(user.length === 1){
				return callback(undefined, user[0]);  //Found User
			}else{
				return callback(ErrorCode[0]);        //No users
			}
		}
	);
};

//Adds a new user, checks if we should make them an admin
UserSchema.statics.add = function(data, callback){
	var newUser = new User(data);
	if(_.contains(adminEmails, newUser.email)){
		newUser.account_type = 'admin';
	}
	return newUser.save(callback);
}

//returns the user if the email exists, if not adds the user and returns in
UserSchema.statics.getByEmail = function(email, callback){
	var self = this;
	User.findOne({email : email}, function(err, user){
		if(err){
			return callback(err)
		}
		if(!user){
			console.log('creating user');
			return self.add({email : email}, callback);
		}
		return callback(null, user);
	});
}


User = mongoose.model('User', UserSchema);
