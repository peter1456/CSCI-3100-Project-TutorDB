// definition of messages
var mongoose = require('mongoose');
var User = require('./user');

var MessageSchema = mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      msgcontent: {
        type: String,
        required: true
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    {
      timestamps: true 
    }
)

module.exports = mongoose.model('Message', MessageSchema);  