// imports
const express = require('express');  // Helper functions for node.js
const app = express();               // Instantiating the express Object
const morgan = require('morgan');    // For logging
const bodyParser = require('body-parser'); // Helper to parse body data
const mongoose = require('mongoose');  // Object interface for MongoDB

// API routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');


// connect to MongooseDB
mongoose.connect('mongodb+srv://restful-shop:' +
 process.env.MONGO_DB_PW + 
 '@cluster1-esm9r.mongodb.net/test?retryWrites=true&w=majority', {
   /* useMongoClient: true  *///depreciated
      useNewUrlParser: true,
      useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);///depreciated

// For depreciation
mongoose.Promise = global.Promise;

// Middleware
// Will log things in terminal
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Prevent CORs Errors
// Cross-Origin Resource Sharing "ByPass"
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use("/user", userRoutes);

// Last in line Error Handling
app.use((req, res, next) => {
    const error = new Error('404 Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// export our app Object
module.exports = app;