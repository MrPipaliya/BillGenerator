var mongoose = require('mongoose');

var CategoryModel = new mongoose.Schema({
    CategoryName: String,
    Status: Boolean,
    FileName: String
});

module.exports = mongoose.model('Category', CategoryModel, 'Category');