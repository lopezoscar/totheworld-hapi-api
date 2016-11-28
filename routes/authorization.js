'use strict';

const jwt = require('jsonwebtoken');
const redisClient = require('redis').createClient();
const secret = process.env.JWT_SECRET || require('../.credentials/jwt.json').secret;// TODO Validar
const uuid = require('node-uuid');
const Joi = require('joi');
const debug = require('debug')('authorization');

const users = require('../lib/users');
module.exports = [
  {
    method: ['POST'],
    path: '/auth',
    config: {
      auth: false,
      validate: {
        payload: {
          apikey: Joi.string()
                        .required()
                        .description('Secret API Key')
        }
      },
      tags: ['api']
    },
    handler: function (req, reply) {
      users.getUserByApiKey(req.payload.apikey)
                .then(function (user) {
                  var payload = {
                    user_id: user._id,
                    limit: user.limit,
                    valid: true, // this will be set to false when the person logs out
                    id: uuid.v4(),
                    exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
                  };
                    // create the session in Redis
                  redisClient.set(payload.id, JSON.stringify(payload));
                    // sign the session as a JWT
                  var token = jwt.sign(payload, secret); // synchronous
                  console.log(token);

                  reply({token: token})
                        .header('Authorization', token);
                })
                .catch(function (err) {
                  debug(err);
                  reply({err: 'Cannot create a token'});
                });
    }
  }
];
