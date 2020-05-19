const findByData = async function (email, reservationDate) {
	const reservation = await this.findOne({
		email,
		reservationDate,
	});

	if (reservation) {
		throw new Error('Reservation already exists.');
	}

	return reservation;
};

module.exports = {
	findByData,
};
