require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

 

const app = express()

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');

   
});

//  // SQL query to create the schools table
//  const createTableQuery = `
//  CREATE TABLE IF NOT EXISTS schools (
//      id INT AUTO_INCREMENT PRIMARY KEY,
//      name VARCHAR(255) NOT NULL,
//      address VARCHAR(255) NOT NULL,
//      latitude FLOAT NOT NULL,
//      longitude FLOAT NOT NULL
//  );
// `;

// Execute the query
// db.query(createTableQuery, (err, results) => {
//  if (err) {
//      console.error('Error creating table:', err);
//  } else {
//      console.log('Schools table created successfully:', results);
//  }

//  // Close the connection
//  db.end();
// });

 

// Validate latitude and longitude
const validateCoordinates = (latitude, longitude) => {
    return (
        latitude >= -90 && latitude <= 90 &&
        longitude >= -180 && longitude <= 180
    );
};

// Create a new school
app.post('/addSchool', (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address) {
        return res.status(400).json({ error: 'Invalid input data' });
    }
    if (!validateCoordinates(latitude, longitude)) {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    db.query('INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)', [name, address, latitude, longitude], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, name, address, latitude, longitude });
    });
});

// List Schools API
app.get('/listSchools', (req, res) => {
    const { latitude, longitude, limit = 10, offset = 0 } = req.query;
    if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    const parseLatitude = parseFloat(latitude);
    const parseLongitude = parseFloat(longitude);
    console.log(latitude ,parseLatitude, longitude, parseLongitude)

    // Validate input
    if (!validateCoordinates(parseLatitude, parseLongitude)) {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    // SQL query to fetch schools and calculate distance using Haversine formula
    const query = `
        SELECT *, 
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance 
        FROM schools 
        ORDER BY distance 
        LIMIT ? OFFSET ?;
    `;

    db.query(query, [parseLatitude, parseLongitude, parseLatitude, parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        // Return the sorted list of schools
        res.json(results);
    });
});


// Start the server
app.listen(process.env.serverPort, () => {
    console.log(`Server is running on http://localhost:${process.env.serverPort}`);
});