
var m = {
	server: false,
	events: {},
	setServer: function(data){
		this.server = true;
		console.log('SET SERVER');
		this.trigger('setServer', data);
	},
	setClient: function(data){
		this.server = false;
		console.log('SET CLIENT');
		this.trigger('setClient', data);
	},
	isServer: function(){
		return this.server;
	},
	isClient: function(){
		return !this.server;
	},
	on: function(event, cb){
		if(this.events[event] == null){
			this.events[event] = [];
		}
		this.events[event].push(cb);
	},
	trigger: function(event, data){
		if(this.events[event] != null){
			for(var i in this.events[event]){
				this.events[event][i](data);
			}
		}
	}
};

module.exports = m;
