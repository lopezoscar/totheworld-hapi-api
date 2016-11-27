'use strict';

const config = require('config');
const mongojs = require('mongojs');
const db = mongojs(config.get('db.stringconn'), config.get('db.collections'));

require('./paginate')(db, config.get('db.collections'), {});// Load Pagination over db

module.exports = {
  getUserById (id) {
    return new Promise(function (resolve, reject) {
      db.users.findOne({_id: mongojs.ObjectId(id)}, function cb (err, docs) {
        err ? reject(err) : resolve(docs);
      });
    });
  },

  getUserByUsername (username) {
    return new Promise(function (resolve, reject) {
      db.users.findOne({ username }, function cb (err, docs) {
        err ? reject(err) : resolve(docs);
      });
    });
  },

  getUserByApiKey (apikey) {
    return new Promise(function (resolve, reject) {
      db.users.findOne({ apikey }, function cb (err, docs) {
        err ? reject(err) : resolve(docs);
      });
    });
  }
};
