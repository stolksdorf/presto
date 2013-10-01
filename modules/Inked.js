var mongoose = require('mongoose');
	global = {};

var ErrorCode = {
	0 : 'Could not find unique User',
	1 : 'User already exists'
};

exports.set = function(name, value){
	global[name] = value;
};

//Schemas
InkedUser = mongoose.model('InkedUser', mongoose.Schema({
	userId          : String,
	fingerprint     : String,
	collisionCookie : String,
	date            : { type: Date, default: Date.now },
}));

InkedRegisterLink = mongoose.model('InkedRegisterLink', mongoose.Schema({
	//url_key
	//expires_

}));


var getUserWithCC = function(fingerprint, collisionCookie, callback){
	InkedUser.find({fingerprint : fingerprint, collisionCookie : collisionCookie},
		function (err, user) {
			if(err){
				callback(err);
			}else if(user.length === 1){
				callback(undefined, user[0].userId);
			}else if(user.length === 0){
				callback(ErrorCode[0]);
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

exports.get2 = function(userData, callback){

	if(typeof userData === 'undefined'){
		return callback('new error');
	}

	InkedUser.find({fingerprint : userData.fingerprint},
		function (err, user) {
			if(err){
				callback(err);
			}else if(user.length === 1){
				callback(undefined, user[0].userId);
			}else if(user.length === 0){
				callback(ErrorCode[0]);
			}else{
				getUserWithCC(userData.fingerprint, userData.collisionCookie, callback);
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


exports.clear = function(){
	InkedUser.remove({}, function(){
		console.log('Inked userws remove');
	});
}



/*
exports.htmlSnippet = function(req,res){
	res.send(200, "<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/html4/strict.dtd'><html><head><script src='//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js'></script><script type='text/javascript'>(function(e){var t=t||{map:function(e,t){var n=[];for(var r in e){if(e.hasOwnProperty(r)){n.push(t(e[r],r))}}return n}};var n=function(e,t){var n,r,i,s,o,u,a,f;t=t||31;n=e.length&3;r=e.length-n;i=t;o=3432918353;u=461845907;f=0;while(f<r){a=e.charCodeAt(f)&255|(e.charCodeAt(++f)&255)<<8|(e.charCodeAt(++f)&255)<<16|(e.charCodeAt(++f)&255)<<24;++f;a=(a&65535)*o+(((a>>>16)*o&65535)<<16)&4294967295;a=a<<15|a>>>17;a=(a&65535)*u+(((a>>>16)*u&65535)<<16)&4294967295;i^=a;i=i<<13|i>>>19;s=(i&65535)*5+(((i>>>16)*5&65535)<<16)&4294967295;i=(s&65535)+27492+(((s>>>16)+58964&65535)<<16)}a=0;switch(n){case 3:a^=(e.charCodeAt(f+2)&255)<<16;case 2:a^=(e.charCodeAt(f+1)&255)<<8;case 1:a^=e.charCodeAt(f)&255;a=(a&65535)*o+(((a>>>16)*o&65535)<<16)&4294967295;a=a<<15|a>>>17;a=(a&65535)*u+(((a>>>16)*u&65535)<<16)&4294967295;i^=a}i^=e.length;i^=i>>>16;i=(i&65535)*2246822507+(((i>>>16)*2246822507&65535)<<16)&4294967295;i^=i>>>13;i=(i&65535)*3266489909+(((i>>>16)*3266489909&65535)<<16)&4294967295;i^=i>>>16;return i>>>0};var r={get:function(e){if(!document.cookie.length){return}var t,n;t=document.cookie.indexOf(e+'=');if(t!==-1){t=t+e.length+1;n=document.cookie.indexOf(';',t);if(n===-1){n=document.cookie.length}return unescape(document.cookie.substring(t,n))}return},set:function(e,t,n){var r='';if(n){var i=new Date;i.setTime(i.getTime()+n*24*60*60*1e3);r='; expires='+i.toGMTString()}document.cookie=e+'='+t+r+'; path=/'},remove:function(e){document.cookie=e+'=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'}};var i=function(){var e=r.get('inked-collisioncookie');if(!e){e=(new Date).getTime()+Math.round(Math.random()*100)+'';r.set('inked-collisioncookie',e)}return e};var s=function(){var t=function(){try{return!!e.localStorage}catch(t){return true}};return[navigator.userAgent,navigator.language,screen.colorDepth,(new Date).getTimezoneOffset(),!!e.sessionStorage,t(),!!e.indexedDB,typeof e.openDatabase,navigator.cpuClass,navigator.platform,navigator.doNotTrack]};var o=function(){return t.map(navigator.plugins,function(e){var n=t.map(e,function(e){return[e.type,e.suffixes].join('~')}).join(',');return[e.name,e.description,n].join('::')}).join(';')};var u=function(){var e=document.createElement('canvas');if(!(e.getContext&&e.getContext('2d'))){return false}var t=e.getContext('2d');var n='inked-fingerprinting';t.textBaseline='top';t.font='14px Arial';t.textBaseline='alphabetic';t.fillStyle='#f60';t.fillRect(125,1,62,20);t.fillStyle='#069';t.fillText(n,2,15);t.fillStyle='rgba(102, 204, 0, 0.7)';t.fillText(n,4,17);return e.toDataURL()};var a=function(){var e=s();e.push(o());e.push(u());e=n(e.join('###'));return e+''};e.Inked={fingerprint:a(),collisionCookie:i()}})(window)</script></head><body><script type='text/javascript'>$('body').load(document.URL,{inked : Inked}, function(redirect, textStatus, jqXHR ){if(jqXHR.status === 403 && redirect){window.location = redirect;}});</script></body></html>");
};
*/

exports.htmlSnippet = function(req,res){
	return res.render('inked.html');
};
