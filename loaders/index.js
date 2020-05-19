const expressLoader = require('./express');
const mongooseLoader = require('./mongoose');
// const jobsLoader = require('./jobs');
const Logger = require('./logger');

module.exports = async ({ expressApp }) => {
	try {
		await mongooseLoader();
		Logger.info('✌️ DB loaded and connected!');

		// await jobsLoader({ agenda });
		// Logger.info('✌️ Jobs loaded');

		await expressLoader(expressApp);
		Logger.info('✌️ Express loaded');
	} catch (error) {
		Logger.error(error);
	}
};
