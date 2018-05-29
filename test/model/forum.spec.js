const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

const mongoose = require('mongoose');
require('sinon-mongoose');

//Import our model to test
const {Category, ForumMessage, Topic, Thread, Message} = require('../../src/model');



describe("Get all forum", function(){
    // Test will pass if we get all todos
   it("should return all todos", function(done){
       const CategoryMock = sinon.mock(Category);
       const expectedResult = {status: true, todo: []};
       CategoryMock.expects('find').yields(null, expectedResult);
       Category.find(function (err, result) {
        CategoryMock.verify();
        CategoryMock.restore();
           expect(result.status).to.be.true;
           done();
       });
   });

   // Test will pass if we fail to get a Category
   it("should return error", function(done){
       const CategoryMock = sinon.mock(Category);
       const expectedResult = {status: false, error: "Something went wrong"};
       CategoryMock.expects('find').yields(expectedResult, null);
       Category.find(function (err, result) {
           CategoryMock.verify();
           CategoryMock.restore();
           expect(err.status).to.not.be.true;
           done();
       });
   });
});
