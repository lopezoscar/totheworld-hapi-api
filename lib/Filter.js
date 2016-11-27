"use strict";


/**
 * Filter Options: booking_id, date, checkIn, checkOut, hotelName, price_detail
 */

/**
 *
 *
 * Devuelve una function que convierte los path/query params de API a un objeto para ordenar en mongo.
 * @class
 * @param {Object.<string, string>} map key value de API - Mongo Property
 * @param {Object.<string, string>} filters Params del request
 * @returns {Object.<string, number>} object para mongodb filter.
 *

 */
function Filter(map,filters){
    let dbFilter = {};
    if(filters){
        let parts = filters.split(",");

        parts.forEach(val => {
            val = val.trim();
            return dbFilter[ map[val] ] = 1;
        });
    }

    return dbFilter;
}

module.exports = Filter;

