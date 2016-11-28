'use strict';

const Hapi = require('hapi');
const config = require('config');
const debug = require('debug')('api:app');

// Hapi Plugins
// const Good = require('good');
const Inert = require('inert');
const Vision = require('vision');
const HapiApiVersion = require('hapi-api-version');
const args = require('argsparser').parse();

const server = new Hapi.Server();

const port = args['-port'] || process.env.PORT || config.webapp.port || 9090;  // Config application Port
const swaggerHost = `${config.webapp.host}:${port}` || `localhost:${port}`;  // Config Swagger Host (shown in swagger front doc)

const secret = process.env.JWT_SECRET || require('../.credentials/jwt.json').secret;// TODO Validar
const redis = require('redis').createClient();// TODO pass production host and port.

server.connection({
  host: '0.0.0.0',
  port,
  routes: {
    cors: {
      origin: ['*']
    }
  }
});

server.register([
  require('hapi-auth-jwt2'),
  {
    register: require('./plugins/redirect'),
    options: {
      map: {'/': '/docs'}
    }
  },
  Inert,
  Vision,
  {
    register: require('hapi-swaggered'),
    options: {
      cors: true,
      host: swaggerHost,
      info: {
        title: 'Hotels API',
        description: 'Powered by Almundo.com',
        version: '1.0'
      }
    }
  },
  {
    register: require('hapi-swaggered-ui'),
    options: {
      title: 'Almundo Hotels API',
      path: '/docs',
      authorization: {
        field: 'Authorization',
        scope: 'header', // header works as well
        placeholder: 'Enter your Token Bearer here'
      },
      swaggerOptions: {
        validatorUrl: null,
        docExpansion: 'list'
      }
    }
  },
  {
    'register': HapiApiVersion,
    'options': {
      defaultVersion: 1,
      validVersions: [1, 2],
      vendorName: 'Almundo',
      versionHeader: 'x-api-version'
    }
  }
], (err) => {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

    // bring your own validation function
  var validate = function (decoded, request, callback) {
    redis.get(decoded.id, function (err, data) {
      return callback(null, !err);
    });
  };

  server.auth.strategy('jwt', 'jwt',
    {
      key: secret,
      validateFunc: validate,
      verifyOptions: {algorithms: ['HS256']}
    });

  server.route(require('./routes'));

  server.start((err) => {
    if (err) {
      throw err;
    }
    debug('info', 'Server running at: ' + server.info.uri);
  });
});

module.exports = server;
