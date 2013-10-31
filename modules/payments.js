


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
		return callback(charge)
	});
};