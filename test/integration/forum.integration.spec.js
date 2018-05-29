'use strict';
const should = require('should'),
	request = require('supertest');


describe('Forum integration testing', function() {

	var agent;	
	var app;
	before(function (done) {
		app = require('../../src/app');
		agent = request.agent(app);
		done();
	});

	it('Should get status equal success and array of Forum', function (done) {
		agent
		.get('/forum')
		.expect(200)
		.end(function(err, results){
			results.body.status.should.equal(true);
			done();	
		});
	});

	after(function(done) {
		app.close(done);
	});


});