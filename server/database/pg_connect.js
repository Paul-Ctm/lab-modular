const pg = require('pg');
const url = require('url');
const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

pg.defaults.ssl = true;

/************************************
*************************************
********** pg_connect.js ************
*************************************
************************************/

/*
* Module pour l'accès à la base de données
*/

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
};

const pool = new pg.Pool(config); //process.env.DATABASE_UR);

pool.on('error', function (error, client) {
  console.error('Client error', error.message, error.stack);
});

//export the query method for passing queries to the pool
module.exports.query = function (text, values, callback) {
  console.log('query:', text, values);
  return pool.query(text, values, callback);
};

// the pool also supports checking out a client for
// multiple operations, such as a transaction
module.exports.connect = function (callback) {
  return pool.connect(callback);
};
