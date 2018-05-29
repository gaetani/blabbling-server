const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

describe('hooks', function() {
    //TODO: Using mockgoose here, i'll change it from location in nearest future
    const mongoose = require('mongoose');
    const Mockgoose = require('mockgoose').Mockgoose;
    const mockgoose = new Mockgoose(mongoose);
  
    before(function(done) {
      
        console.log('TEST DATABASE IS SET');
        mockgoose.prepareStorage().then(() => { 
            mongoose.connect('mongodb://localhost/test');
            
            console.log('REPLACING DATABASE CONNECTION');
            require('../src/common/mongoConnect').connectMongoDatabase = (success, error)=> {
                console.log('USING DATABASE MEMORY');
            };
            done();
        });
    });
    it("should replace mongoose to mockgoose", function(done){
        expect(mockgoose.helper.isMocked()).to.be.true;
        done();
    });

});
