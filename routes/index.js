'use strict';

// TODO hacer dinamico.
const routes = [].concat(require('./v1/hotels')).concat(require('./v2/hotels'));
module.exports = routes;

