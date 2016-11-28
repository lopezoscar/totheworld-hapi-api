'use strict';

const url = 'http://localhost:9090';
const request = require('supertest')(url);// TODO Dynamic Conf

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

const req = require('request');

describe('GET /v1/hotels', function () {
  var _this = this;
  beforeEach(function (done) {
    req({
      method: 'POST',
      url: url + '/auth',
      json: true,
      body: {
        apikey: '25b96ef4-10bc-4214-a4cd-4cd575777d02'
      }
    }, function (err, response, body) {
      _this.token = body.token;
      done();
    });
  });

  it('/v1/hotels', function (done) {
    console.log('this.token', _this.token);
    request
            .get('/v1/hotels')
            .set('Authorization', _this.token)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
              res.body.should.have.all.keys(['hotels']);
              done();
            });
  });
});

