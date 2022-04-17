var mongoose = require('mongoose');

var BillModel = new mongoose.Schema({
    Bill:Object
});

module.exports = mongoose.model('Bill', BillModel, 'Bill');