var transmissions = {};

var setTransmission(id, transmission, done) {
	transmissions[id] = transmission;
	done();
};

var getTransmission(id, done) {
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
