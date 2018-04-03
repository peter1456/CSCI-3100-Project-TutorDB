// User definition in the mongoDB database

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    identity: String,
    sex: String,
    region: [String],
    educationLevel: String,
    timeAvailable: [String],
    priceRequested: Number,
    subject: [String],
    activeness: {type: Boolean, default: true},
    rating: {type: Number, default: null},
    rating: {type: Number, default: 0},
    numofjobs: {type:Number, default: 0}
})

var User = mongoose.model('User', userSchema);
module.exports = User;