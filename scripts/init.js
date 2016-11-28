'use strict';

const config = require('config');
const mongojs = require('mongojs');
const db = mongojs(config.get('db.stringconn'), config.get('db.collections'));
const uuid = require('node-uuid');

db.hotels.drop(function (err, result) {
  if (err) {
    console.log('Error drop hotels collection', err);
  } else {
    insertHotels();
  }
});

function insertHotels () {
  db.hotels.insert([
    {
      'name': 'Hotel Emperador',
      'stars': '3',
      'price': '1596'
    },
    {
      'name': 'Petit Palace San Bernardo',
      'stars': '4',
      'price': '2145'
    },
    {
      'name': 'Hotel Nuevo Boston',
      'stars': '2',
      'price': '861'
    }
  ], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('HOTELS SAVED OK');
    }
  });
}

db.users.drop(function (err, result) {
  if (err) {
    console.log(err);
  } else {
    db.users.insert([
      {
        name: 'lopezoscar',
        apikey: uuid.v4(),
        limit: 10000,// 10 mil por hora,
        scopes: ['hotels:read']
      }
    ], function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  }
});
