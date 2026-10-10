const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.DB_PASSWORD) {
    throw new Error('DB_PASSWORD must be set in the environment');
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'dashboard_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
