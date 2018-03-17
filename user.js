// User definition in the mongoDB database

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    identity: String,
    sex: String,
    region: Array[String],
    educationLevel: String,
    timeAvailable: Array[String],
    priceRequested: Number,
    activeness: {type: Boolean, default: true},
    rating: {type: Number, default: null},
})

var User = mongoose.model('User', userSchema);
module.exports = User;