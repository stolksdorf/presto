PrestoAdmin = xo.view.extend({

	start : function(endpoints){

		var self = this;






		var calcCollection = xo.collection.extend({
			model : Presto_Model_Calculator.mixin({
				update : function(obj, text){
					this.set('script', text);
					return this;
				},
				get : function(){
					return this.script;
				},
			}),
			update : function(obj, text){
				var temp = parseText(text);
				this.clear();
				var self = this;
				_.each(temp, function(calc){
					self.add().set('script', calc);
				});
				return this;
			},
			get : function(){
				var result = '[\n' + _.reduce(this, function(result, obj){
					return result + obj.script + ',\n';
				},'') + '\n]';
				return result;
			},
		});

		_.each(endpoints, function(ep){
			if(ep === '/api/calculators REMOVE'){
				var col = calcCollection;
			}else {
				var col = xo.collection.extend({
					model : xo.model.extend({
						urlRoot : ep,
						update : function(obj, text){
							this.set(obj);
							return this;
						},
						get : function(){
							return this.toJSON();
						}
					}),
					update : function(obj, text){
						var self = this;
						this.clear();
						_.each(obj, function(obj){
							self.add(obj);
						});
						return this;
					},
					get : function(){
						var result = _.map(this, function(obj){
							return obj.attributes();
						});
						return JSON.stringify(result,null,4);
					},
				});
			}

			var group = Presto_View_EndpointGroup.create(col);
			group.injectInto($('.routes'));
			col.fetch();
		});











		this.content = Presto_View_Content.create();


		return this;
	},

	loadContent : function(newContent){

		this.content.load(newContent);


		return this;
	},


});

parseText = function(text){
	var result = [];
	var slush = '';
	var inCalc = false;
	var count = 0;
	for(i in text){
		var letter = text[i];

		if(letter === '{' && !inCalc){
			inCalc = true;
			count = 1;
		} else if(letter === '{' && inCalc){
			count++;
		}

		if(letter === '}' && inCalc){
			count--;
			if(count === 0){
				slush += '}';
				result.push(slush);
				slush = '';
				inCalc = false;
			}
		}
		if(inCalc){
			slush += letter;
		}

	}
	return result;
}