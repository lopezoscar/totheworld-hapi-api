'use strict';
const debug = require('debug')('plugins:redirect');
const redirectPlugin = {
  register: function (server, options, next) {
    debug('register redirectPlugin');
    server.ext({
      type: 'onRequest',
      method: function (request, reply) {
        request.path in options.map ? reply.redirect(options.map[request.path]) : reply.continue();
      }
    });
    next();
  }
};

redirectPlugin.register.attributes = {
  name: 'redirectPlugin',
  version: '1.0.0'
};

module.exports = redirectPlugin;
