var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var swal= require('sweetalert');  
require('./db/connection.js');

require('dotenv').config()

var app = express();

// set body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// session middleware
var checkIsLoggedIn = function isLoggedIn(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        res.redirect('/');
    }
};

// set session
app.use(session({
    secret: 'AHJVFJGJ521HG84HJVGDHBBKJBE',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 900000 }
}))

// set the view engine to ejs
app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, '/views/'));
//app.engine('hbs', exphb({ extname: 'hbs', defaultLayout: 'mainLayout', layoutDir: __dirname + 'views/layouts/' }));

// admin route
const dashboardController = require('./controllers/dashboardController.js');
const categoryController = require('./controllers/categoryController.js');
const productController = require('./controllers/productController.js');
const billController = require('./controllers/billController.js');
const loginController = require('./controllers/loginController.js');

// set public folder for admin
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin/category', express.static(path.join(__dirname, 'public')));
app.use('/admin/product', express.static(path.join(__dirname, 'public')));
app.use('/admin/bill', express.static(path.join(__dirname, 'public')));

// controller
app.use("/", loginController);
app.use("/admin", checkIsLoggedIn, dashboardController);
app.use("/admin/category", checkIsLoggedIn, categoryController);
app.use("/admin/product", checkIsLoggedIn, productController);
app.use("/admin/bill", checkIsLoggedIn, billController);

// port number
app.listen(process.env.PORT);
console.log(process.env.PORT);

//Db
