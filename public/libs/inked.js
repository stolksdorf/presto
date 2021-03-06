
;(function(scope){

	//Underscore.js shim for map
	var _ = _ || {
		map : function(obj, fn){
			var result = [];
			for(var propName in obj){
				if(obj.hasOwnProperty(propName)){ result.push(fn(obj[propName], propName)); }
			}
			return result;
		},
	};

	/**
	 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
	 *
	 * @author <a href='mailto:gary.court@gmail.com'>Gary Court</a>
	 * @see http://github.com/garycourt/murmurhash-js
	 *
	 * @param {string} key ASCII only
	 * @return {number} 32-bit positive integer hash
	 */
	var murmurhash3=function(e,t){var n,r,i,s,o,u,a,f;t=t||31;n=e.length&3;r=e.length-n;i=t;o=3432918353;u=461845907;f=0;while(f<r){a=e.charCodeAt(f)&255|(e.charCodeAt(++f)&255)<<8|(e.charCodeAt(++f)&255)<<16|(e.charCodeAt(++f)&255)<<24;++f;a=(a&65535)*o+(((a>>>16)*o&65535)<<16)&4294967295;a=a<<15|a>>>17;a=(a&65535)*u+(((a>>>16)*u&65535)<<16)&4294967295;i^=a;i=i<<13|i>>>19;s=(i&65535)*5+(((i>>>16)*5&65535)<<16)&4294967295;i=(s&65535)+27492+(((s>>>16)+58964&65535)<<16)}a=0;switch(n){case 3:a^=(e.charCodeAt(f+2)&255)<<16;case 2:a^=(e.charCodeAt(f+1)&255)<<8;case 1:a^=e.charCodeAt(f)&255;a=(a&65535)*o+(((a>>>16)*o&65535)<<16)&4294967295;a=a<<15|a>>>17;a=(a&65535)*u+(((a>>>16)*u&65535)<<16)&4294967295;i^=a}i^=e.length;i^=i>>>16;i=(i&65535)*2246822507+(((i>>>16)*2246822507&65535)<<16)&4294967295;i^=i>>>13;i=(i&65535)*3266489909+(((i>>>16)*3266489909&65535)<<16)&4294967295;i^=i>>>16;return i>>>0}

	//Simple implementation of getting and setting cookies
	var cookiejar = {
		get : function(name){
			if(!document.cookie.length){
				return;
			}
			var start, end;
			start = document.cookie.indexOf(name + '=');
			if(start !== -1){
				start = start + name.length + 1;
				end = document.cookie.indexOf(';', start);
				if(end === -1){
					end = document.cookie.length;
				}
				return unescape(document.cookie.substring(start, end));
			}
			return;
		},
		set : function(name, value, daysToExpire){
			var expires = '';
			if(daysToExpire){
				var date = new Date();
				date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
				expires = '; expires=' + date.toGMTString();
			}
			document.cookie = name + '=' + value + expires + '; path=/';
		},
		remove : function(name){
			document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}
	};

	/**
	 * Used in case two users have the exact same browser fingerprints
	 * should be rare, ~3% of the time
	 * @return {int}
	 */
	var getCollisionCookie = function(){
		var collisionCookie = cookiejar.get('inked-collisioncookie');
		if(!collisionCookie){
			collisionCookie = new Date().getTime() + Math.round(Math.random() * 100) + '';
			cookiejar.set('inked-collisioncookie', collisionCookie)
		}
		return collisionCookie;
	};

	var getBrowserFingerprint = function(){
		var hasLocalStorage = function(){
			try{
				return !!scope.localStorage;
			}catch(e){
				return true;
			}
		};
		return [
			navigator.userAgent,
			navigator.language,
			screen.colorDepth,
			new Date().getTimezoneOffset(),
			!!scope.sessionStorage,
			hasLocalStorage(),
			!!scope.indexedDB,
			typeof(scope.openDatabase),
			navigator.cpuClass,
			navigator.platform,
			navigator.doNotTrack
		];
	};

	var getPluginsFingerprint = function(){
		return _.map(navigator.plugins, function(p){
			var mimeTypes = _.map(p, function(mt){
				return [mt.type, mt.suffixes].join('~');
			}).join(',');
			return [p.name, p.description, mimeTypes].join('::');
		}).join(';');
	};

	var getCanvasFingerprint = function(){
		var canvas = document.createElement('canvas');
		if(!(canvas.getContext && canvas.getContext('2d'))){
			return false;
		}
		var ctx = canvas.getContext('2d');
		var txt = 'inked-fingerprinting';
		ctx.textBaseline = 'top';
		ctx.font = '14px Arial';
		ctx.textBaseline = 'alphabetic';
		ctx.fillStyle = '#f60';
		ctx.fillRect(125,1,62,20);
		ctx.fillStyle = '#069';
		ctx.fillText(txt, 2, 15);
		ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
		ctx.fillText(txt, 4, 17);
		return canvas.toDataURL();
	}

	var getFingerprint = function(){
		var result = getBrowserFingerprint();
		result.push(getPluginsFingerprint())
		result.push(getCanvasFingerprint());
		result = murmurhash3(result.join('###'));
		return result + '';
	}

	scope.Inked = {
		fingerprint     : getFingerprint(),
		collisionCookie : getCollisionCookie(),
	};

})(window);