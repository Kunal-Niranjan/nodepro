// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json()); // Parse JSON requests

// // ✅ Use a Connection Pool Instead of Single Connection
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',  
//     password: '',  // Change if you have a MySQL password
//     database: 'anantwebappdata', // Ensure this matches phpMyAdmin exactly
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// // ✅ API Endpoint to Save Data
// app.post('/save', (req, res) => {
//     const { name, email } = req.body;
//     const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';

//     pool.query(sql, [name, email], (err, result) => {
//         if (err) {
//             console.error('Error inserting data:', err);
//             res.status(500).json({ error: 'Database error' });
//             return;
//         }
//         res.json({ message: 'Data saved successfully', id: result.insertId });
//     });
// });

// // ✅ Start Server
// const port = process.env.PORT || 5000; // Use the port from the environment or fallback to 5000 for local development
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });











const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests

// ✅ MySQL Connection Pool with Environment Variables
const pool = mysql.createPool({
    host: process.env.DB_HOST, // ✅ Remote MySQL Host (Render or another provider)
    user: process.env.DB_USER, // ✅ MySQL Username
    password: process.env.DB_PASSWORD, // ✅ MySQL Password
    database: process.env.DB_NAME, // ✅ Database Name
    port: process.env.DB_PORT || 3306, // ✅ Default MySQL Port
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ✅ Test Database Connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database");
    connection.release(); // Release connection back to the pool
});

// ✅ API Endpoint to Save Data
app.post('/save', (req, res) => {
    const { name, email } = req.body;
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';

    pool.query(sql, [name, email], (err, result) => {
        if (err) {
            console.error('❌ Error inserting data:', err);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json({ message: '✅ Data saved successfully', id: result.insertId });
    });
});

// ✅ Start Server
const port = process.env.PORT || 5000; // Use the port from Render
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
