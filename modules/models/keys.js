var mongoose = require('mongoose');
var shortId = require('shortid');


ActivationKeySchema = mongoose.Schema({
	id : String,
	user_id : String,
	key : {
		type : String,
		default : function(){
			return shortId.generate();
		}
	},
	createdAt : { type: Date, default: Date.now }
});



ActivationKeySchema.post('save', function(aKey){
	console.log('KEY', aKey);
	if(!aKey.id) aKey.id = aKey._id;
	aKey.update({id : aKey.id}, function(err){});
	console.log('KEY2', aKey);
});




ActivationKeySchema.statics.activate = function(key, cookie, callback){
	this.findOne({key : key}, function(err, activation){
		if(err){ callback(err); }
		User.findOne({_id : activation.user_id}, function(err, user){
			if(err){ return callback(err); }
			return user.addCookie(cookie, callback);
		});
	});
};



ActivationKeySchema.statics.addAndSend = function(domain, email, callback){

	User.getByEmail(email, function(err, user){
		if(err){ callback(err); }

		var newActivationKey = new ActivationKey({user_id : user._id});
		newActivationKey.save(function(err, newKey){
			if(err){ callback(err); }
			var url = domain + '/activate/' + newKey.key;
			mail.sendActivationEmail(email, url, callback);
		});
	});
};







ActivationKey = mongoose.model('ActivationKey', ActivationKeySchema);