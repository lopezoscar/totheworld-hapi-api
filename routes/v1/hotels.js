'use strict';

const hotels = require('../../lib/hotels');// TODO Cambiar pasaje de modules.
const Joi = require('joi');
const baseResponse = {
  '400': {
    'description': "Bad request - A client error (more detail in the 'message' section)"
  },
  '403': {
    'description': "API validation - The request was not authorized (more detail in the 'causes' section)"
  },
  '429': {
    'description': 'API validation - Quota exceeded'
  },
  '500': {
    'description': "Internal error - An unexpected error (more detail in the 'causes' section)"
  },
  '200': {
    'description': 'OK'
  }
};

module.exports = [
  {
    method: 'GET',
    path: '/v1/hotels',
    config: {
      auth: 'jwt',
      plugins: {
        'hapi-swagger': {
          responses: baseResponse,
          payloadType: 'json'
        }
      },
      validate: {
        query: {
          sort: Joi.string().description('Sort Options. +ASC -DESC +price -price'),
          filter: Joi.string().description('Filter Options.')
        }
      },
      tags: ['api']
    },
    handler: function (req, reply) {
      hotels.findHotels()
                .then(hotels => reply({hotels}))
                .catch(function (err) {
                  reply({
                    err: 500,
                    message: err
                  });
                });
    }
  }
];
