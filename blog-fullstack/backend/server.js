const express = require('express');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');


const dotenv = require('dotenv').config()
const colors = require('colors');
const { application } = require('express');


// Connect to database
connectDB();

// Express app config
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

// Express app routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoute'));
app.use(errorHandler);
// Serve server
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
})