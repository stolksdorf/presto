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
				});
			}
		});


		return this;
	},


	load : function(model){

		this.model = model;

		this.dom.data.val(model.get());

		return this;
	},

	save : function(){

		var code = this.dom.data.val();

		eval("with (this) {var result = (" + code + ")}");

		if(this.model){
			this.model.update(result, code);
			this.model.save(function(){
				alert('Saved!');
			});
		}

		return this;
	},



})