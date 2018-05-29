'use strict';
const should = require('should'),
	request = require('supertest');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const {Category} = require('../../src/model/index');
const fs = require('fs');
const mongoose = require('mongoose');
const categories = require('./category.json');
require('sinon-mongoose');


describe('Suite APP Test Express', function() {
	//TODO: Using mockgoose here, i'll change it from location in nearest future
	const mongoose = require('mongoose');
	const Mockgoose = require('mockgoose').Mockgoose;
	const mockgoose = new Mockgoose(mongoose);

	var agent;	
	var app;

	before(function(done) {
	
		console.log('TEST DATABASE IS SET');
		mockgoose.prepareStorage().then(() => { 
			mongoose.connect('mongodb://localhost/test');
			
			console.log('REPLACING DATABASE CONNECTION');
			require('../../src/common/mongoConnect').connectMongoDatabase = (success, error)=> {
				console.log('USING DATABASE MEMORY');
			};
			return;
		}).then(()=> done());
	});


	before(function (done) {
		app = require('../../src/app');
		agent = request.agent(app);
		done();
	});

	before(function (done) {
		//Insert Category before tests
		Category.insertMany(categories).then((rows) => {
			rows.should.not.be.empty();
			done();
		});
	
	});
	
	it("should replace mongoose to mockgoose", function(done){
		expect(mockgoose.helper.isMocked()).to.be.true;
		done();
	});


	describe("Route /secured/topic must has token integration testing", function(){

		let topicId;
		it('should post a new topic to a spefic category', function (done) {
			agent
			.post('/secured/topic/809801b6-bf51-4c7e-9139-b52e97bc6c39')
			.send({
				name: 'Test topic',
				description: 'Description topic'
			})
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, results){
				results.body.should.be.not.empty();
				topicId = results.body._id;
				done();	
			});
		});

		it('should get by category id', function (done) {
			agent
			.get(`/secured/topic/809801b6-bf51-4c7e-9139-b52e97bc6c39`)
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, results){
				results.body.should.be.not.empty();
				done();	
			});
		});

		it('should change the name of the topic', function (done) {
			agent
			.put(`/secured/topic/809801b6-bf51-4c7e-9139-b52e97bc6c39/${topicId}`)
			.send({
				name: 'Test topic',
				description: 'Description 1'
			})
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, results){
				expect(results.body.description).to.be.equals('Description 1');
				done();	
			});
		});

		it('should get the topic by id', function (done) {
			agent
			.get(`/secured/topic/809801b6-bf51-4c7e-9139-b52e97bc6c39/${topicId}`)
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, results){
				expect(results.body.description).to.be.equals('Description 1');
				done();	
			});
		});

		
		it('should delete post by id', function (done) {
			agent
			.delete(`/secured/topic/809801b6-bf51-4c7e-9139-b52e97bc6c39/${topicId}`)
			.expect(200)
			.end(function(err, results){
				expect(results.body.message).to.be.equals("Topic successfully deleted");
				done();	
			});
		});
	
	});

	describe("Route /secured/thread must has token integration testing", function(){

		let threadId;
		let topicId;
		it('should post a new topic to a spefic category', function (done) {
			agent
			.post('/secured/topic/809801b6-bf51-4c7e-9139-b52e97bc6c39')
			.send({
				name: 'Test topic',
				description: 'Description topic'
			})
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, results){
				results.body.should.be.not.empty();
				topicId = results.body._id;
				done();	
			});
		});

		it('should post a new thread to a spefic topic', function (done) {
			agent
			.post(`/secured/thread/${topicId}`)
			.send({
				name: 'Test thread',
			})
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, results){
				results.body.should.be.not.empty();
				threadId = results.body._id;
				done();	
			});
		});

		it('should get by topic id', function (done) {
			agent
			.get(`/secured/thread/${topicId}`)
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, results){
				results.body.should.be.not.empty();
				done();	
			});
		});

		it('should change the name of the thread', function (done) {
			agent
			.put(`/secured/thread/${topicId}/${threadId}`)
			.send({
				name: 'Test thread 1',
			})
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, results){
				expect(results.body.name).to.be.equals('Test thread 1');
				done();	
			});
		});

		it('should get the thread by id', function (done) {
			agent
			.get(`/secured/thread/${topicId}/${threadId}`)
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, results){
				expect(results.body.name).to.be.equals('Test thread 1');
				done();	
			});
		});

		
		it('should delete post by id', function (done) {
			agent
			.delete(`/secured/thread/${topicId}/${threadId}`)
			.expect(200)
			.end(function(err, results){
				expect(results.body.message).to.be.equals("Thread successfully deleted");
				done();	
			});
		});
	
	});

	describe("Route /secured/forum must has token integration testing", function(){

		describe("Route /secured/forum/message must has token integration testing", function(){

			it('should post a new message to a spefic forum', function (done) {
				agent
				.post('/secured/forum/message/')
				.expect(200)
				.end(function(err, results){
					done();	
				});
			});
		
		});
	
	});

	describe("Route /forum without having token integration testing", function(){

	
		it('should get empty body when getting forum message', function (done) {
			agent
			.get('/forum')
			.expect(200)
			.end(function(err, results){
				done();	
			});
		});
	

	
	});

});