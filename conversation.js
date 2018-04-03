// definition of chat 
var mongoose = require('mongoose');
var User = require('./user');
var Message = require('./message');

var ConversationSchema = mongoose.Schema({
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    latestMessage: {type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
},
{
    timestamps: true
})

module.exports = mongoose.model('Conversation', ConversationSchema);