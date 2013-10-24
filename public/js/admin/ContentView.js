Presto_View_Content = xo.view.extend({
	view : 'content',

	render : function(){
		var self = this;

		this.dom.save.click(function(){
			self.save();
		});

		this.dom.delete.click(function(){
			if(self.model){
				self.model.delete(function(){
					alert('Deleted!');
					self.model = undefined;
					self.dom.data.val('');
					self.dom.buttons.hide();
				});
			}
		});

		this.dom.showScript.hide();
		this.dom.showModel.hide();

		this.dom.showScript.click(function(){
			self.showScript();
		});

		this.dom.showModel.click(function(){
			self.showModel();
		});

		return this;
	},


	load : function(model){
		this.model = model;

		this.dom.buttons.show();
		this.dom.showScript.hide();
		if(this.model.script){
			this.dom.showScript.show();
		}

		this.dom.data.val(model.toJSON());
		this.resize();
		return this;
	},

	save : function(){
		var code = this.dom.data.val();

		try{
			eval("with (this) {var result = (" + code + ")}");
		}catch(e){
			result = "";
		}

		if(this.model){
			this.model.set(result);
			this.model.save(function(){
				alert('Saved!');
			});
		}

		return this;
	},

	showScript : function(){
		this.dom.showScript.hide();
		this.dom.showModel.show();
		this.dom.buttons.hide();
		this.dom.data.val(this.model.script);
		this.resize();
		return this;
	},

	showModel : function(){
		this.dom.showScript.show();
		this.dom.showModel.hide();
		this.dom.buttons.show();
		this.model.set('script', this.dom.data.val());
		this.dom.data.val(this.model.toJSON());
		this.resize();
		return this;
	},

	resize : function(){
		this.dom.data.height('1px');
		var nh = (25+this.dom.data[0].scrollHeight > screen.height - 350) ? screen.height - 350 : 25+this.dom.data[0].scrollHeight;
		this.dom.data.height(nh+ 'px');
		return this;
	},


})