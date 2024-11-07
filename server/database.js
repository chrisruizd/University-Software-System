
const { Pool } = require('pg');


// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'uniview',
    password: '',
    port: 5432,
});

pool.connect();

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});
  

// Export the pool for use in other modules
module.exports = pool;