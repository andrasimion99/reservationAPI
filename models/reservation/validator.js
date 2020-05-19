const { Joi } = require('celebrate');
// const joiObjectId = require('joi-objectid');

// // add joi-objectId to Joi
// Joi.objectId = joiObjectId(Joi);

const reservationSchema = Joi.object().keys({
	userId: Joi.string()
		.regex(/^[a-fA-F0-9]{24}$/)
		.error(new Error('User id invalid')),
	email: Joi.string()
		.email()
		.required()
		.error(new Error('Email required')),
	userFirstName: Joi.string()
		.required()
		.min(2)
		.error(new Error('First name required')),
	userLastName: Joi.string()
		.required()
		.min(2)
		.error(new Error('Last name required')),
	reservationDate: Joi.date()
		.valid()
		.required()
		.error(new Error('Date required')),
	phoneNumber: Joi.string()
		.required()
		.trim()
		.regex(/^[0-9]{7,10}$/)
		.error(new Error('Phone Number required')),
	numberOfSeats: Joi.number()
		.min(1)
		.required()
		.error(new Error('Number of Seats required')),
	restaurantId: Joi.string()
		.regex(/^[a-fA-F0-9]{24}$/)
		.required()
		.error(new Error('Restaurant id invalid')),
});

module.exports = reservationSchema;
