// db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,   // docker-compose 에서 DB_HOST=mysql
  user: process.env.DB_USER,   // fcbuser
  password: process.env.DB_PASS, // fcbpass
  database: process.env.DB_NAME, // fcb
});

module.exports = pool;
