var mongoose = require('mongoose');

var UserModel = new mongoose.Schema({
    UserName: String,
    Password: String
});

module.exports = mongoose.model('User', UserModel, 'User');