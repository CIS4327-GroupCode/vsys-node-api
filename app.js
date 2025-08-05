// app.js
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config(); // Load environment variables
const db = require('./database/db'); // Import database connection

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.json()); // For parsing JSON data
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files 

// Basic Route
const index = require('./routes/index');
app.use('/', index);
//MANAGE ROUTING DEPENDING ON AREAS, USERS, ROLES, ETC.
app.get('/volunteers', async (req, res) => {
    res.status(200).send('volunteers');
});

// Error Handling Middleware 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something went wrong!', error: err });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});