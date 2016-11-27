'use strict';
const debug = require('debug')('paginate');
/**
 * Pagination for mongojs
 * @param db {Object}
 * @returns {Promise}
 */
module.exports = function (db, collections, opts) {
    /**
     * @package mongojs-paginate-promise
     * @param {Object} [query={}]
     * @param {Object} [options={}]
     * @param {Object|String} [options.sort]
     * @param {Number} [options.offset=0] - Use offset or page to set skip position
     * @param {Number} [options.page=1]
     * @param {Number} [options.limit=10]
     * @returns {Promise}
     */
  function paginate (queryDB, filtersDB, options) {
    return new Promise((resolve, reject) => {
      var query = typeof queryDB !== 'undefined' ? queryDB : {};// Default all objects
      var filters = typeof filtersDB !== 'undefined' ? filtersDB : {};// Default all objects
      let sort = typeof options.sort !== 'undefined' ? options.sort : {};
      let limit = typeof options.limit !== 'undefined' && !isNaN(options.limit) ? options.limit : 10;// Default limit 10

      let page, skip, offset;

      if (typeof options.page !== 'undefined' && options.page > 0) {
        page = typeof options.page !== 'undefined' && !isNaN(options.page) ? options.page : 1;// Default page 1
        skip = (page - 1) * limit;
      } else if (typeof options.offset !== 'undefined') {
        offset = typeof options.offset !== 'undefined' && !isNaN(options.offset) ? options.offset : 0;// Default offset 0
        skip = offset;
      } else {
        return reject({err: 'page and offset are undefined'});
      }

      if (typeof limit !== 'undefined') {
        debug('COLLECTION ', this._name);

        db[this._name].count(query, (err, count) => {
          debug('COUNT: ' + count);
          if (err) {
            reject(err);
          } else {
            db[this._name].find(query, filters).sort(sort).skip(skip).limit(limit, (err, docs) => {
              if (err) {
                reject(err);
              } else {
                let result = {
                  docs: docs,
                  total: count,
                  limit: limit
                };
                if (typeof offset !== 'undefined') {
                  result.offset = offset;
                }
                if (typeof page !== 'undefined') {
                  result.page = page;
                  result.pages = Math.ceil(count / limit) || 1;
                }
                resolve(result);
              }
            });
          }
        });
      } else {
        reject({err: 'limit param not found'});
      }
    });
  }

  collections.forEach(col => { db[col].paginate = paginate; });
};
