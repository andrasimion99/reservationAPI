// Import all the users models
const db = require('../models/index');

// Import all the service constructors
const ReservationService = require('./ReservationService');

// Create the service objects with dependencies
const reservationService = new ReservationService({
	db: {
		Reservation: db.Reservation,
	},
	services: {},
});

// Export the service object
module.exports = {
	reservationService,
};
