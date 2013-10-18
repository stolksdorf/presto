mongoose   = require('mongoose');
nodemailer = require("nodemailer");


//Email History
var EmailSchema = mongoose.Schema({
	from    : String,
	to      : String,
	subject : String,
	text    : String,
	html    : String,
	status  : String,
	date    :  { type: Date, default: Date.now },
});
var EmailRecord = mongoose.model('EmailRecord', EmailSchema);


//Accounts
var accounts = {
	admin : {
		address   : "Presto Admin <admin@prestcalc.com>",
		transport : nodemailer.createTransport("SMTP",{
			service: "Gmail",
			auth: {
				user: "admin@prestocalc.com",
				pass: "prestoADMIN"
			}
		})
	}
};

//Sends a generic email
exports.sendMail = function(account, mailOptions, callback){
	mailOptions.from = account.address;
	var newEmailRecord = new EmailRecord(mailOptions);
	account.transport.sendMail(mailOptions, function(error, response){
		account.transport.close();
		newEmailRecord.status = error || response.message;
		newEmailRecord.save(function(){});

		if(error){ return callback(error); }
		return callback(undefined, response.message);
	});
};



//Sends the meail to link a new browser
exports.sendActivationEmail = function(email, link, callback){
	exports.sendMail(accounts.admin, {
		to : email,
		subject : 'Account activation',
		html : 'Hey there, <br><a href="' + link + '">Click here</a> to link your browser with Presto'
	},
	callback);
};