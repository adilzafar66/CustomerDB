// Import modules
const express = require("express");
const path = require('path')
const mongoose = require('mongoose');
const homeRoutes = require('./routes/homeRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const utilRoutes = require('./routes/utilRoutes');
const cookieParser = require("cookie-parser");

// Set the express package
const app = express();

// Define the port number
const port = 8000;

// Set the view engine
app.set('view engine', 'ejs');

// Set the middleware and static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Connect to MongoDB Atlas database
const dbURI = 'mongodb+srv://adilzafar66:Cogitoergosum_11@customerdb.g0e8a44.mongodb.net/Users';
mongoose.connect(dbURI, {useNewURLParser: true, useUnifiedTopology: true})
.then((result) => {
    console.log("Connected to the database");
    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    });
})
.catch((err) => {
    console.log(err);
});

app.use(homeRoutes);
app.use(authRoutes);
app.use('/customers', customerRoutes);
app.use('/account', accountRoutes);

// Last call
app.use(utilRoutes);