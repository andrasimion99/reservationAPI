const dotenv = require('dotenv');

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
	// This error should crash whole process

	throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
module.exports = {
	port: parseInt(process.env.PORT, 10),
	databaseURL: process.env.DB_CONNECTION,
	jwtSecret: process.env.JWT_SECRET,
	logs: {
		level: process.env.LOG_LEVEL || 'silly',
	},
	api: {
		prefix: '/api/v1',
	},
	statusCodes: {
		BAD_REQUEST: 400,
		OK: 200,
		CREATED: 201,
		ACCEPTED: 202,
		NO_CONTENT: 204,
	},
};
