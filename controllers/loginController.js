var express = require('express')
var mongoose = require('mongoose');
var multer = require('multer')
var path = require('path');
var Joi = require('joi');


//var router = express.Router();

const fs = require('fs')

var app = express();
//Creating a Router
var router = express.Router();

// import connection
var connection = require("../db/connection");

// import model
var UserModel = require('../models/userModel');
var CategoryModel = require('../models/categoryModel');
var ProductModel = require('../models/productModel');
var BillModel = require('../models/billModel');

// get login
router.get('/', function (req, res) {

    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
    });

    res.render('../views/login');
})

// logout

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/ ');
    });
});

// check user

router.post('/admin', function (req, res) {

    req.session.username = req.body.UserName;

    UserModel.findOne({ UserName: req.body.UserName, Password: req.body.Password }, function (err, data) {
        if (err)
            console.log(err);
        else {
            if (data == null) {
                res.redirect('/');
            }
            else {
                CategoryModel.countDocuments({}, function (err, totalCategory) {
                    BillModel.find(function (err, billData) {
                        ProductModel.countDocuments(function (err, totalProduct) {
                            res.render('../views/admin/index', {
                                totalCategory: totalCategory,
                                totalProduct: totalProduct,
                                totalBill: billData.length,
                                billList: billData
                            });
                        });
                    });
                });
            }
        }
    });
})

module.exports = router