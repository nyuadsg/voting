// we need mongoose
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	netID: String,
	RFID: String
});

var User = module.exports = mongoose.model('User', userSchema);