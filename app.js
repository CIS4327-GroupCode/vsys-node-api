// app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
require('dotenv').config(); // Load environment variables

// Middleware
app.use(express.json()); // For parsing JSON data
app.use('/assets', express.static(path.join(__dirname, 'public'))); // Serve static files 
app.use(cors()); // Enable CORS for all routes

//route imports()
const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
const fileRoutes = require('./routes/files');

//route uses
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/files', fileRoutes);


app.get('/', (req, res) => {
    res.send('API is running'); 
});

//set port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});