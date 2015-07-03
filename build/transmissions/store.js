'use strict';

var transmissions = {};

var setTransmission = function setTransmission(id, transmission, done) {
	transmissions[id] = transmission;
	if (done != null) {
		done();
	}
};

var getTransmission = function getTransmission(id, done) {
	if (transmissions[id] != null) {
		done(null, transmissions[id]);
	} else {
		done(new Error('Transmission not found!'));
	}
};

module.exports = {
	setTransmission: setTransmission,
	getTransmission: getTransmission
};