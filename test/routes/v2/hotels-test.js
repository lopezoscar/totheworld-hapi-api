'use strict';

const url = 'http://localhost:9090';
const request = require('supertest')(url);// TODO Dynamic Conf

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

const req = require('request');

describe('GET /v2/hotels', function () {
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

  it('/v2/hotels', function (done) {
    request
            .get('/v2/hotels')
            .query({limit:10,page:1})
            .set('Authorization', _this.token)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
              res.body.should.have.all.keys(['docs', 'total', 'limit', 'page', 'pages']);
              err ? done(err) : done();
            });
  });
});

