


var stripeSecretKey = 'sk_test_6PIJHj9xECY12tcrP4TNsQbf';
var stripePublicKey = 'pk_test_V0lqKPOUMmrHAy7n6w2HAe46';

var stripe = require('stripe')(stripeSecretKey);


exports.charge = function(stripeToken, callback){
	console.log('Attempting to charge token', stripeToken);

	// Set your secret key: remember to change this to your live secret key in production
	// See your keys here https://manage.stripe.com/account
	//stripe.setApiKey(stripeSecretKey);

	stripe.setApiKey("sk_test_6PIJHj9xECY12tcrP4TNsQbf");

	// (Assuming you're using express - expressjs.com)
	// Get the credit card details submitted by the form

	var charge = stripe.charges.create({
		amount: 100, // amount in cents, again
		currency: "cad",
		card: stripeToken,
		description: "Testing out charging"
	}, function(err, charge) {
		if (err && err.type === 'StripeCardError') {
			// The card has been declined
			console.log('ERROR: Declinded card');
			return callback('Declined Card');
		}
		console.log('Card accepted!');
		return callback(undefined, charge)
	});
};

exports.saveUser = function(user, stripeToken, callback){
	// Set your secret key: remember to change this to your live secret key in production
	// See your keys here https://manage.stripe.com/account
	stripe.setApiKey("sk_test_6PIJHj9xECY12tcrP4TNsQbf");


	stripe.customers.create({
		card: stripeToken,
		description: 'payinguser@example.com'
	}).then(function(customer) {
		user.stripeId = customer.id;
		user.save(callback);
	});
};

exports.chargeUser = function(user, callback){

	if(!user.stripeId) return callback('No card stored');

	console.log('Attempting to charge user', user.email, user.stripeId);

	var charge = stripe.charges.create({
		amount: 100,
		currency: "cad",
		customer: user.stripeId,
	}, function(err, charge) {
		if (err && err.type === 'StripeCardError') {
			console.log('ERROR: Declinded card');
			return callback('Declined Card');
		}
		console.log('Card accepted!');
		return callback(undefined, charge);
	});

}