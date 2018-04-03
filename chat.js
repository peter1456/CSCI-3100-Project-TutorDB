// Chat Handler

var Conversation = require('./conversation');
var Message = require('./message');
var User = require('./user');

class chatHandler{
    getLatest (userid) {
        Conversation.find({ participants: userid })
        .sort({"updateAt": -1})
        .populate('participants message')
        .lean()
        .exec(function(err, conversations) {
          if (err) {
            throw err;
            } 
            var conv = conversations;
        })
        return conv;
    }
    
    getConversation(conversation){
        Message.find({conversationId: conversation})
        .sort({"createAt": -1})
        .populate('author', 'firstName lastName')
        .exec(function(err, messages){
            if (err) {
                throw err;
            }
            var mess = messages;
        })
        return mess;
    }

    // make a new conversation from user 1 
    createConversation(id1, id2){
        var newConversation = new Conversation();
        newConversation.participants = [id1, id2];
        newConversation.save(function(err, conv){
            if (err) {
                throw err;
            }
            var convid = conv._id;
        })
        // make a new empty message for the conversation to sort
        var emptyMessage = new Message();
        emptyMessage.conversationId = convid;
        emptyMessage.content = "";
        emptyMessage.author = id1;
        emptyMessage.save(function(err, msg){
            var msgid = msg._id;
        })
        Conversation.findByIdAndUpdate(convid, {latestMessage: msgid}, (err, msg) => {
            if (err) throw err;
        })
        return convid;
    }

    // save the message to Database
    saveMessage(convid, msg){
        var newMsg = new Message();
        newMsg.conversationId = convid;
        newMsg.content = msg.content;
        newMsg.author = msg.author;
        newMsg.save((err,msg) => {
            if (err) {
                throw err;
            } 
            console.log(msg);
        });
    }
}

module.exports = chatHandler;