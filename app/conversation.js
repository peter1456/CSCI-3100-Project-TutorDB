// definition of chat 
var mongoose = require('mongoose');
var User = require('./user');
var Message = require('./message');

var ConversationSchema = mongoose.Schema({
    // Number of 
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    latestMessage: {type: mongoose.Schema.Types.ObjectId, ref: 'Message'},
    Accepted: [String],
    Rated: {type: Boolean, default: false}
},
{
    timestamps: true
})

module.exports = mongoose.model('Conversation', ConversationSchema);