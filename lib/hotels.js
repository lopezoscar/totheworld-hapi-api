'use strict';

const config = require('config');
const mongojs = require('mongojs');
const db = mongojs(config.get('db.stringconn'), config.get('db.collections'));

require('./paginate')(db, config.get('db.collections'), {});// Load Pagination over db

module.exports = {
  findHotels () {
    return new Promise(function (resolve, reject) {
      db.hotels.find({}, function cb (err, docs) {
        err ? reject(err) : resolve(docs);
      });
    });
  },
  getHotels (params, filters, sorting) {
    return db.hotels.paginate({}, filters, {sort: sorting, limit: params.limit, page: params.page});
  }
};
