var express = require('express')
var mongoose = require('mongoose');
var multer = require('multer')
var path = require('path');
var Joi = require('joi');

const fs = require('fs')

var app = express();
var router = express.Router();

// import connection
var connection = require("../db/connection");

// import model
var CategoryModel = require('../models/categoryModel');
var ProductModel = require('../models/productModel');
var BillModel = require('../models/billModel');

// get dashboard
router.get('/', function (req, res) {
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
})

module.exports = router