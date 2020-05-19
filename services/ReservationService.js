const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

const Logger = require('../loaders/logger');

class ReservationService {
	constructor({ db, services }) {
		this.db = db;
		this.services = services;
	}

	async getAllReservations() {
		try {
			const reservations = await this.db.Reservation.find({});

			return { success: true, data: { reservations } };
		} catch (error) {
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async getReservation(idReservation) {
		try {
			const reservations = await this.db.Reservation.find({
				_id: idReservation,
			});

			return { success: true, data: { reservations } };
		} catch (error) {
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async submit(payload) {
		const {
			userId,
			email,
			userFirstName,
			userLastName,
			reservationDate,
			phoneNumber,
			numberOfSeats,
			restaurantId,
		} = payload;

		const reservationData = {
			userId,
			email,
			userFirstName,
			userLastName,
			reservationDate,
			phoneNumber,
			numberOfSeats,
			restaurantId,
		};

		if (payload.userId) {
			reservationData.guest = false;
		}

		const reservation = new this.db.Reservation(reservationData);

		try {
			const existsReservation = await this.db.Reservation.findByData(
				email,
				reservationDate,
			);

			const existsEmptySeats = await this.checkSeatsAvailability(
				reservationData,
			);

			const restaurantOpen = await this.checkRestaurantAvailability(
				reservationData,
			);

			if (!restaurantOpen) {
				throw new Error(
					'This restaurant is not open for the time of your reservation.',
				);
			}

			if (!existsEmptySeats) {
				throw new Error(
					"This restaurant doesn't have enough empty seats for your reservation.",
				);
			}

			if (!existsReservation && existsEmptySeats) {
				await reservation.save();
				await this.sendReservationMail(reservationData);
			}

			fetch(
				'http://localhost:4000/api/clients/addReservation',
				{
					method: 'POST',
					body: {
						clientId: reservation.userId,
						providerId: reservation.idReservation,
						reservationId: reservation._id,
					},
				},
			)
				.then((res) => {
					return res.json();
				})
				.catch((error) => {
					Logger.error(error);
				});

			return { success: true, data: { reservation } };
		} catch (error) {
			Logger.error(error);
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async verifySchedule(restaurantDay, reservationHour) {
		let startHour = parseInt(
			restaurantDay.startHour.substring(0, 2),
			10,
		);
		let endHour = parseInt(
			restaurantDay.endHour.substring(0, 2),
			10,
		);
		if (restaurantDay.startHour.match('pm')) {
			startHour += 12;
		}
		if (restaurantDay.endHour.match('pm')) {
			endHour += 12;
		}
		if (
			startHour <= reservationHour &&
			reservationHour < endHour
		) {
			return true;
		}
		return false;
	}

	async checkRestaurantAvailability(reservationData) {
		let available;
		let restaurantSchedule;
		let reservationDay;
		await fetch(
			`http://localhost:4000/api/users/${reservationData.restaurantId}`,
		)
			.then((response) => response.json())
			.then(async function (data) {
				restaurantSchedule =
					data.data.user.details.schedule.schedule;
				reservationDay = reservationData.reservationDate.getDay();
			})
			.catch((err) => {
				Logger.error(err);
			});
		if (reservationDay === 0) {
			available = await this.verifySchedule(
				restaurantSchedule[reservationDay + 6],
				reservationData.reservationDate.getHours(),
			);
		} else {
			available = await this.verifySchedule(
				restaurantSchedule[reservationDay - 1],
				reservationData.reservationDate.getHours(),
			);
		}
		if (available) {
			return true;
		}
		return false;
	}

	async checkSeatsAvailability(reservationData) {
		const date = reservationData.reservationDate;
		const occupiedSeats = await this.countReservationByDate(
			reservationData.restaurantId,
			date.getFullYear(),
			date.getMonth() + 1,
			date.getDate(),
			date.getHours(),
		);
		let restaurantQuantity = 0;
		await fetch(
			`http://localhost:4000/api/users/${reservationData.restaurantId}`,
		)
			.then((response) => response.json())
			.then((data) => {
				restaurantQuantity = data.data.user.details.capacity;
			})
			.catch((err) => {
				Logger.error(err);
			});
		if (
			restaurantQuantity - occupiedSeats >=
			reservationData.numberOfSeats
		) {
			return true;
		}
		return false;
	}

	async countReservationByDate(
		restaurantId,
		year,
		month,
		day,
		hour,
	) {
		let countOccupiedSeats = 0;
		const reservations = await this.findByRestaurant(
			restaurantId,
		);
		const reservationsData = reservations.data.reservations;

		await (async () => {
			for (const reservation of reservationsData) {
				await (async () => {
					const dateReservation =
						reservation.reservationDate;
					if (
						dateReservation.getFullYear() === year &&
						dateReservation.getMonth() === month - 1 &&
						dateReservation.getDate() === day &&
						dateReservation.getHours() >= hour
					) {
						countOccupiedSeats +=
							reservation.numberOfSeats;
					}
				})();
			}
		})();
		return countOccupiedSeats;
	}

	async sendReservationMail(reservationData) {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'restaurantapp20ip@gmail.com',
				pass: 'restaurantapp20!',
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		const mailOptions = {
			from: 'restaurantapp20ip@gmail.com',
			to: 'andrasimion99@gmail.com',
			subject: 'Confirmare rezervare',
			html: `<h2>Rezervarea a fost inregistrata cu success!</h2> Ora rezervarii: ${reservationData.reservationDate} <br> Numar de locuri: ${reservationData.numberOfSeats}`,
		};

		transporter.sendMail(mailOptions, function (error) {
			if (error) {
				Logger.error(error);
			} else {
				Logger.info(`Reservation Email sent`);
			}
		});
	}

	async findByRestaurant(restaurantId) {
		try {
			const reservations = await this.db.Reservation.find({
				restaurantId,
			});

			return { success: true, data: { reservations } };
		} catch (error) {
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async update(idReservation, payload) {
		try {
			const reservation = await this.db.Reservation.updateOne(
				{ _id: idReservation },
				payload,
			);

			return { success: true, data: { reservation } };
		} catch (error) {
			Logger.error(error);
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async deleteAll() {
		try {
			const reservation = await this.db.Reservation.deleteMany(
				{},
			);

			return { success: true, data: { reservation } };
		} catch (error) {
			Logger.error(error);
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}

	async deleteReservation(idReservation) {
		try {
			const reservation = await this.db.Reservation.deleteOne({
				_id: idReservation,
			});

			return { success: true, data: { reservation } };
		} catch (error) {
			Logger.error(error);
			return {
				success: false,
				error: { message: error.message },
			};
		}
	}
}

module.exports = ReservationService;
