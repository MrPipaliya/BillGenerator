var express = require('express')
var mongoose = require('mongoose');
var multer = require('multer')
var path = require('path');
var Joi = require('joi');

const fs = require('fs');

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
var CategoryModel = require('../models/categoryModel');
var BillModel = require('../models/billModel');

// get category list
router.get('/', function (req, res) {

    ProductModel.find(function (err, data) {
        if (err)
            console.log(err);
        else {
            ProductModel.find(function (err, data) {
                console.log("Generate bill Category");
                console.log(data);
                if (err)
                    console.log(err);
                else {
                    CategoryModel.find({ Status: true }, function (err, categorydata) {
                        res.render('../views/admin/generate-bill', {
                            formDataError: [{
                                context: { label: '' }
                            }], productList: data, categoryList: categorydata
                        });
                    });
                }
            });
        }
    });
})

// add or update
router.post('/print', function (req, res) {

    selectedItemQty = [];
    selectedProductName = [];
    selectedProductPrice = [];
    selectedProductCost = [];
    totalBillPrice = [];

    BillDetails = [];

    for (var i = 0; i <req.body.selectedItemQty.length; i++) {// 
        //for(var j=0; j <1; j++){
        if (req.body.selectedItemQty[i] > 0) { //[i]
            selectedProductName.push(req.body.selectedProductName[i]);
            selectedProductCost.push(req.body.selectedProductCost[i]);
            selectedProductPrice.push(req.body.selectedProductPrice[i]);
            selectedItemQty.push(req.body.selectedItemQty[i]);
            totalBillPrice.push(req.body.selectedItemQty[i] * req.body.selectedProductPrice[i]);
        }
       // }
    }

    BillDetails.push(selectedProductName);
    BillDetails.push(selectedProductPrice);
    BillDetails.push(selectedItemQty);
    BillDetails.push(totalBillPrice);
    BillDetails.push(req.body.billDate);
    BillDetails.push(req.body.buyerName);
    BillDetails.push(selectedProductCost);

    //console.log("Selcetd Qty"+selectedItemQty);

    var newBill = new BillModel();

    //console.log("Quantity1"+ newBill.Bill.Qty);
    newBill.Bill = { OrderDate: req.body.billDate, BuyerName: req.body.buyerName, Product: selectedProductName, ProductCost: selectedProductCost, ProductPrice: selectedProductPrice, Qty: selectedItemQty, TotalAmount: totalBillPrice };

    console.log("Quantity2"+ newBill.Bill.Qty);
    console.log("Quantity"+ selectedItemQty);

    // newBill.save(function (err, billData) {
    //     if (err)
    //         console.log(err);
    //     else {
    //         res.render('../views/admin/bill-print', {
    //             formDataError: [{
    //                 context: { label: '' }
    //             }], orderedProductList: BillDetails,
    //             BillNo: billData._id
    //         });
    //     }

    // });
    
    try
    {
        console.log("Quantity3"+ newBill.Bill.length);
        // for(var j=0; j <=5; j++)
        // { 
            console.log("Quan  "+ newBill.Bill.Qty);
            //const element = array[index];
        
        //     if(newBill.Bill.Qty[j] > 0)
        //    {
                newBill.save(function (err, billData) {
                    if (err)
                        console.log(err);
                    else {
                        res.render('../views/admin/bill-print', {
                            formDataError: [{
                                context: { label: '' }
                            }], orderedProductList: BillDetails,
                            BillNo: billData._id
                        });
                    }
            
                });
        //     }
        //    else{
            // var error = document.getElementById("ProductQty").required=true;
                //throw new Error('Product Quntity Required');
                alert("telleatt 1");
                window.stop();
                //res.redirect('/admin/bill/');
                
        //    }
       // }
    }
    catch(error)
    {
        //alert(error.message);
        //alert('Eror');
        //<div class="alert alert-danger" role="alert"> <%= error %></div>
    }
    
})

// get bill list
router.get('/list', function (req, res) {

    BillModel.find(function (err, data) {
        console.log("Bill Details");
        console.log(data);
        if (err)
            console.log(err);
        else {
            res.render('../views/admin/bill-list', {
                formDataError: [{
                    context: { label: '' }
                }], billList: data
            });
        }
    });
})

// delete category
router.get('/delete/:id', function (req, res) {

    BillModel.findByIdAndRemove(req.params.id, function (err, data) {
        if (err)
            console.log(err);
        else
            res.redirect('/admin/bill/list');
    });
})

module.exports = router