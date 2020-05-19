const request = require('supertest');
const { describe, it } = require('mocha');
const chai = require('chai');

const { expect } = chai;

const url = 'http://localhost:3100/api/v1';

describe('/reservations ROUTES', function () {
	this.timeout(5000);
	it('GET /reservations route works', (done) => {
		request(url)
			.get('/reservations')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(true);
				expect(res.body.data.reservations).to.be.a('array');
				done();
			});
	});

	it("GET /reservations when id doesn't exist", (done) => {
		request(url)
			.get('/reservations/1')
			.expect('Content-Type', /json/)
			.expect(400)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(false);
				done();
			});
	});

	it('POST /reservations route works when there is no other reservation with the same data', (done) => {
		request(url)
			.post('/reservations')
			.send({
				email: 'test@yahoo.com',
				userFirstName: 'Test',
				userLastName: 'Test',
				phoneNumber: '2341341227',
				restaurantId: '5eb16d673a637d28884dc226',
				numberOfSeats: 2,
				reservationDate: '2020-08-25T15:52:00',
			})
			.expect('Content-Type', /json/)
			.expect(201)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(true);
				expect(res.body.data.reservation).to.be.a('object');
				expect(res.body.data.reservation.email).to.equal(
					'test@yahoo.com',
				);
				done();
			});
	});

	it('POST /reservations when data is not valid', (done) => {
		request(url)
			.post('/reservations')
			.send({
				email: 'rffd',
				userFirstName: '',
				userLastName: '',
				phoneNumber: '2',
				restaurantId: '5e',
				numberOfSeats: 2,
				reservationDate: '2020-05-25T15:52:00',
			})
			.expect('Content-Type', /json/)
			.expect(400)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(false);
				done();
			});
	});

	it('PATCH /reservations/:idReservation should be true', (done) => {
		request(url)
			.patch('/reservations/5ec121f5f9f4ba7f9422f6a7')
			.send({
				reservationDate: '2020-05-27T12:52:00',
			})
			.expect('Content-Type', /json/)
			.expect(202)
			.end(function (err, res) {
				if (err) return done(err);
				expect(res.body.success).to.equal(true);
				done();
			});
	});

	it('DELETE /reservations/:idReservation should work', (done) => {
		request(url)
			.delete('/reservations/5ec123f62cfc3e8004efa349')
			.expect(204, done);
	});
});
