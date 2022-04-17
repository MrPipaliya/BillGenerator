var mongoose = require("mongoose");

var ProductModel = new mongoose.Schema({
    ProductName: String,
    ProductCost: Number,
    ProductSellPrice: Number,
    Status: Boolean,
    FileName: String,
    CategoryId: String
});

module.exports = mongoose.model('Product',ProductModel,'Product');