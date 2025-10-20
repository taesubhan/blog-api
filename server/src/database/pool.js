const {Pool} = require('pg');

const isProd = process.env.NODE_ENV === 'production';

// Add PROD later
module.exports = new Pool({
    connectionString: isProd ? process.env.PROD_DATABASE_CONNECTION_STRING : process.env.DEV_DATABASE_CONNECTION_STRING
})