'use strict';

var m = {
	server: false,
	events: {},
	setServer: function setServer(data) {
		this.server = true;
		this.trigger('setServer', data);
	},
	setClient: function setClient(data) {
		this.server = false;
		this.trigger('setClient', data);
	},
	isServer: function isServer() {
		return this.server;
	},
	isClient: function isClient() {
		return !this.server;
	},
	on: function on(event, cb) {
		if (this.events[event] == null) {
			this.events[event] = [];
		}
		this.events[event].push(cb);
	},
	trigger: function trigger(event, data) {
		if (this.events[event] != null) {
			for (var i in this.events[event]) {
				this.events[event][i](data);
			}
		}
	}
};

module.exports = m;