PrestoAccount = xo.view.extend({
	view : 'account',

	render : function()
	{
		var self = this;


		//plans

		this.plans = {
			bronze : Presto_View_Plan.create({
				id : 'bronze',
				view : 'bronze_plan',
				name : 'Presto Bronze Plan',
				cost : 0,
				description : 'Totally Free!'
			}),
			silver : Presto_View_Plan.create({
				id : 'silver',
				view : 'silver_plan',
				name : 'Presto Silver Plan',
				cost : 20,
				description : 'Second best plan ($20.00/month)'
			}),
			gold : Presto_View_Plan.create({
				id : 'gold',
				view : 'gold_plan',
				name : 'Presto Gold Plan',
				cost : 50,
				description : 'Best in the west ($50.00/month)'
			}),
			beta : Presto_View_Plan.create({
				id : 'beta',
				view : 'beta_plan',
				name : 'Presto Beta User',
			}),
			admin : Presto_View_Plan.create({
				id : 'admin',
				view : 'admin_plan',
				name : 'Presto Admin',
			}),

		}


		return this;
	},



});




Presto_View_Plan = xo.view.extend({
	view : undefined,

	initialize : function(){
		_.extend(this, this.model);
		return this;
	},

	render : function(){
		var self = this;

		this.dom.block.click(function(){
			if(typeof self.cost !== 'undefined'){
				self.showStripeCheckout();
			}
			return false;
		});

		if(this.id === user_type){
			this.dom.block.show();
			this.dom.block.addClass('selected');
		}

		if(typeof self.cost !== 'undefined'){
			//this.dom.block.css('cursor', 'inherit');
		}

		return this;
	},

	showStripeCheckout : function(){
		var token = function(res){
			var $input = $('<input type=hidden name=stripeToken />').val(res.id);
			$('form').append($input).submit();
		};

		StripeCheckout.open({
			key        : 'pk_test_V0lqKPOUMmrHAy7n6w2HAe46',
			currency   : 'cad',
			name       : this.name,
			description: this.description,
			panelLabel : 'Submit',
			token      : token
		});

		return this;
	},




});

