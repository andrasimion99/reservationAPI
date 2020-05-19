const mongoose = require('mongoose');
const reservationSchema = require('./schema');

const statics = require('./statics');
const methods = require('./methods');
// const decorateWithHooks = require('./hooks');

Object.assign(reservationSchema.methods, methods);
Object.assign(reservationSchema.statics, statics);
// decorateWithHooks(reservationSchema);

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
