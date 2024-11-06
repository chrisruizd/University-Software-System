
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

pool.query('SELECT * FROM students', (err, res)=>{
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    pool.end;
})