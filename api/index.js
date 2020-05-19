const { Router } = require('express');

const app = Router();

// Import all the routers
const reservationRouter = require('./routes/reservationRouter');

// Add all the routers as middlewares
app.use('/reservations', reservationRouter);

module.exports = app;
