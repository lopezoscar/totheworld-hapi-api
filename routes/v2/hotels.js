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
    path: '/v2/hotels',
    config: {
      plugins: {
        'hapi-swagger': {
          responses: baseResponse,
          payloadType: 'json'
        }
      },
      validate: {
        query: {
          limit: Joi.number().required().min(1).max(100).integer().positive().description('Items per page. Value between 1 and 100'),
          page: Joi.number().required().min(1).integer().description('Page Number. Min 1'),
          sort: Joi.string().description('Sort Options. +ASC -DESC +date -date(ordena por el campo lastModified), +total-price -total-price, +nightly-price -nightly-price'),
          filter: Joi.string().description("Filter Options: name, template, logo, domains, online. If you don't put anything, by default API retrieves you the reduce version of sale"),
          reduce: Joi.boolean().description('Reduce version of Hotel')

        }
      },
      tags: ['api']
    },
    handler: function (req, reply) {
      let limit = Number(req.query.limit) || 10;
      let page = Number(req.query.page) || 1;
      let filters = {};
      let sort = {};

      hotels.getHotels({limit, page}, filters, sort)
                .then(hotels => reply(hotels))
                .catch(function (err) {
                  reply({
                    err: 500001,
                    message: err
                  });
                });
    }
  }
];
