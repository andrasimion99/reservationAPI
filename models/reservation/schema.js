const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		required: false,
	},
	email: {
		type: String,
		required: true,
		min: 6,
	},
	userFirstName: {
		type: String,
		required: true,
		min: 2,
	},
	userLastName: {
		type: String,
		required: true,
		min: 2,
	},
	reservationDate: {
		type: Date,
		required: true,
		validate: {
			validator(value) {
				const date = new Date();
				date.setHours(date.getHours() + 3);
				if (value < date) {
					return false;
				}
				return true;
			},
			message: 'Reservation date is invalid.',
		},
	},
	phoneNumber: {
		type: String,
		required: true,
		min: 7,
		max: 10,
	},
	numberOfSeats: {
		type: Number,
		required: true,
		min: 1,
	},
	restaurantId: {
		type: mongoose.Types.ObjectId,
		required: true,
	},
	guest: {
		type: Boolean,
		required: true,
		default: 'true',
	},
});

module.exports = reservationSchema;
