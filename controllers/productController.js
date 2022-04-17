var express = require('express')
var mongoose = require('mongoose');
var multer = require('multer')
var path = require('path');
var Joi = require('joi');

const fs = require('fs')

var app = express();
var router = express.Router();

// Configure Image 

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/productimages');
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// import connection
var connection = require("../db/connection");

// import model
var ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');

// get category list
router.get('/:id?', function (req, res) {

    var id = req.params.id;

    ProductModel.find(function (err, data) {
        if (err)
            console.log(err);
        else {
            if (!id) {
                CategoryModel.find({ Status: true }, function (err, categorydata) {
                    res.render('../views/admin/manage-product', {
                        formDataError: [{
                            context: { label: '' }
                        }], productList: data, categoryList: categorydata, productUpdateData: {}
                    });
                });
            }
            else {
                ProductModel.findById(id, function (err, singleProductData) {
                    if (err)
                        console.log(err);
                    else {
                        CategoryModel.find({ Status: true }, function (err, categorydata) {
                            res.render('../views/admin/manage-product', {
                                formDataError: [{
                                    context: { label: '' }
                                }], productList: data, categoryList: categorydata, productUpdateData: singleProductData
                            });
                        });
                    }
                });
            }
        }
    });
})

// add or update category
router.post('/', upload.single('file'), function (req, res) {

    var joiresponse = Joi.object().keys({
        ProductName: Joi.string().required().label("Invalid.."),
    }).validate({ ProductName: req.body.ProductName });

    if (joiresponse.error) {
        ProductModel.find(function (err, data) {
            if (err)
                console.log(err);
            else {
                res.render('../views/admin/manage-product', { formDataError: joiresponse.error.details, categoryList: [], productList: data, productUpdateData: {} });
            }
        });
    }
    else {
        var newProduct = new ProductModel();

        newProduct.ProductName = req.body.ProductName;
        newProduct.ProductCost = req.body.ProductCost;
        newProduct.ProductSellPrice = req.body.ProductSellPrice;
        newProduct.CategoryId = req.body.ProductCategory;
        newProduct.Status = req.body.Status == "on" ? true : false;

        if (!req.body.id) {
            newProduct.FileName = req.file.filename;
        }
        else {
            newProduct._id = req.body.id;

            ProductModel.findById(req.body.id, function (err, singleProductData) {
                if (err)
                    console.log(err);
                else {
                    if (req.file) {
                        if (fs.existsSync(path.join('./public/images/productimages/', singleProductData.FileName))) {
                            fs.unlinkSync(path.join('./public/images/productimages/', singleProductData.FileName));
                        }
                    }
                }
            });
            if (req.file) {
                newProduct.FileName = req.file.filename;
            }
        }

        if (req.body.operation == "update") {
            ProductModel.findByIdAndUpdate(req.body.id, newProduct, function (err, data) {
                if (err)
                    console.log(err);
                else
                    res.redirect('/admin/product');
            });
        }
        else {
            newProduct.save(function (err, data) {
                if (err)
                    console.log(err);
                else
                    res.redirect('/admin/product');
            });
        }
    }
})

// delete category
router.get('/delete/:id', function (req, res) {

    ProductModel.findByIdAndRemove(req.params.id, function (err, data) {
        if (err)
            console.log(err);
        else
            res.redirect('/admin/product');
    });
})

module.exports = router