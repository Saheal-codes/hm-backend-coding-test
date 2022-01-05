'use strict';

const request = require('supertest');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

describe('API tests', () => {
    before((done) => {
        db.serialize((err) => {
            if (err) {
                return done(err);
            }

            buildSchemas(db);

            done();
        });
    });

    describe('GET /health', () => {
        it('should return health', (done) => {
            request(app)
                .get('/health')
                .expect('Content-Type', /text/)
                .expect(200, done);
        });
    });
        
    describe('POST /rides', () => {
        it('should return a new ride', (done) => {
            request(app)
                .post('/rides')
                .send({
                    "start_lat":55,
                    "start_long":55,
                    "end_lat":55,
                    "end_long":55,
                    "rider_name":"Riderone",
                    "driver_name":"Driverone",
                    "driver_vehicle":"Drivervehicleone"})
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
    describe('POST /rides - With Invalid Rider name', () => {
        it('should return an error', (done) => {
            request(app)
                .post('/rides')
                .send({
                    "start_lat":55,
                    "start_long":55,
                    "end_lat":55,
                    "end_long":55,
                    "rider_name":{},
                    "driver_name":"Driverone",
                    "driver_vehicle":"Drivervehicleone"})
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
    describe('POST /rides - With Invalid Latitude', () => {
        it('should return an error', (done) => {
            request(app)
                .post('/rides')
                .send({
                    "start_lat":55,
                    "start_long":55,
                    "end_lat":360,
                    "end_long":55,
                    "rider_name":"Riderone",
                    "driver_name":"Driverone",
                    "driver_vehicle":"Drivervehicleone"})
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
    describe('POST /rides- With Invalid Coordinates', () => {
        it('should return an error', (done) => {
            request(app)
                .post('/rides')
                .send({
                    "start_lat":55,
                    "start_long":320,
                    "end_lat":360,
                    "end_long":55,
                    "rider_name":"Riderone",
                    "driver_name":"Driverone",
                    "driver_vehicle":"Drivervehicleone"})
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
    describe('GET /rides/:id', () => {
        it('should return one ride', (done) => {
            request(app)
                .get('/rides/1')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
    describe('GET /rides/:id - With Invalid ID', () => {
        it('should return an error', (done) => {
            request(app)
                .get('/rides/ten')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
    describe('GET /rides', () => {
        it('should return maximum 10 rides', (done) => {
            request(app)
                .get('/rides')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
    describe('GET /rides', () => {
        it('should return paginated rides', (done) => {
            request(app)
                .get('/rides?skip=3&limit=3')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
});