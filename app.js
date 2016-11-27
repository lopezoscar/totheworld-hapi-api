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
  {
    register: require('./plugins/redirect'),
    options: {
      map: { '/': '/docs'}
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
        field: 'authorization',
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

  server.route(require('./routes'));

  server.start((err) => {
    if (err) {
      throw err;
    }
    debug('info', 'Server running at: ' + server.info.uri);
  });
});

module.exports = server;
