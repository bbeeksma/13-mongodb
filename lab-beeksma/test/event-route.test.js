'use strict';

const app = require('../server');
const request = require('supertest')(app);
const { expect } = require('chai');
const Event = require('../model/event');

describe('event routes', function () {

  describe('GET /api/event', function (){
    describe('with an invalid id', function (){
      it('should return 404', function (){
        return request
        .get('/api/event/missing')
        .expect(404);
      });
    });
    describe('with a valid id', function (){
      before(function (){
        return new Event ({ title: 'get me'})
        .save()
        .then(event => this.testEvent = event);
      });
      after(function () {
        Event.remove({});
      });
      it('should return a note', function (){
        return request
          .get(`/api/event/${this.testEvent._id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.equal(this.testEvent.title);
          });
      });
    });
  });

  describe('POST /api/note', function(){
    describe('with no body', function(){
      return request
        .post('api/event')
        .expect(400);
    });
    describe('with a valid body', function(){
      after(function () {
        Event.remove({});
      });
      it('should return a note', function (){
        return request
          .post('/api/event')
          .send({title: 'test event'})
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.equal('test event');
            expect(res.body.created).to.not.be.undefined;
          });
      });
    });
  });
});
