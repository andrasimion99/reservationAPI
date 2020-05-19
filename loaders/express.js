const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const { isCelebrate } = require('celebrate');

const apiRouter = require('../api');
const config = require('../config');

// { app }: { app: express.Application }
module.exports = (app) => {
	/**
	 * Health Check endpoints
	 */
	app.get('/status', (req, res) => {
		res.status(200).end();
	});
	app.head('/status', (req, res) => {
		res.status(200).end();
	});

	// Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	// It shows the real origin IP in the heroku or Cloudwatch logs
	app.enable('trust proxy');

	// The magic package that prevents frontend developers going nuts
	// Alternate description:
	// Enable Cross Origin Resource Sharing to all origins by default
	app.use(cors());

	// Some sauce that always add since 2014
	// "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
	// Maybe not needed anymore ?
	app.use(methodOverride());

	// Middleware that transforms the raw string of req.body into json
	app.use(express.json());
	// Load API routes
	app.use(config.api.prefix, apiRouter);

	// Let's handle the celebrate errors
	// All the errors thrown by the validation of body, params etc.
	app.use((error, req, res, next) => {
		if (isCelebrate(error)) {
			return res.status(400).json({
				success: false,
				error: {
					message: error.joi.message,
					meta: error.meta,
				},
			});
		}
	});
};
