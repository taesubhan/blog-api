const {Pool} = require('pg');

console.log(process.env.DEV_DATABASE_CONNECTION_STRING);

// Add PROD later
module.exports = new Pool({
    connectionString: process.env.DEV_DATABASE_CONNECTION_STRING
})