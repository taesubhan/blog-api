const {Pool} = require('pg');

// Add PROD later
module.exports = new Pool({
    connectionString: process.env.DEV_DATABASE_CONNECTION_STRING
})