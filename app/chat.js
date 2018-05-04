// Chat Handler to handle those database operations

var Conversation = require('./conversation');
var Message = require('./message');
var User = require('./user');

class chatHandler{
    // get a list of current conversations sort by time of latest Message, with the latest Message
    async getLatest (userid) {
        try {
            return await Conversation.find({ participants: userid }).sort({"updatedAt": -1}).populate({path: 'participants latestMessage'});
        } catch (err) {
            throw err;
        }
    };
    
    // return a list of messages from a conversation, sorted by create time
    async getConversation(conversation){
        try {
            return await Message.find({conversationId: conversation})
        .sort({"createdAt": 1})
        .populate('author', 'firstName lastName');
        } catch (err) {
            throw err;
        }
    }

    // make a new conversation from user 1 
    async createConversation(id1, id2){
        Conversation.findOne({"participants": [id1, id2]}, async (err, result) => {
            // make a new conversation if it does not exist
            if (result == null) {
                // create a new conversation in database and save it
                var newConversation = new Conversation();
                newConversation.participants = [id1, id2];
                try {
                    var newConv = await newConversation.save();
                } catch (err) {
                    throw err;
                }
                console.log(newConv)
                // make a new empty message for the conversation to sort
                var emptyMessage = new Message();
                emptyMessage.conversationId = newConv._id;
                emptyMessage.msgcontent = "Hello!";
                emptyMessage.author = id1;
                try {
                    var newMsg = await emptyMessage.save();
                } catch (err) {
                    throw err;
                }
                console.log(newMsg);
                // record the dummy message as latestMessage
                Conversation.findByIdAndUpdate(newConv._id, {latestMessage: newMsg._id}, (err, conv) => {
                    if (err) throw err;
                    console.log(conv);
                    return 1;
                })
            }
        });
        }   

    // save the message to Database
    saveMessage(convid, msg){
        var newMsg = new Message();
        newMsg.conversationId = convid;
        newMsg.msgcontent = msg.msgcontent;
        newMsg.author = msg.author;
        newMsg.save((err,msg) => {
            if (err) {
                throw err;
            } 
            console.log(msg);
            // Update the latest message in the conversation
            Conversation.findByIdAndUpdate(convid, {latestMessage: msg._id}, (err, conv) => {
                if (err) throw err;
            })
        });
    }

    // accept the job 
    acceptjob(roomid, userid){
        Conversation.findByIdAndUpdate(roomid, {$push: {Accepted: userid}}, (err, conv) => {
            if (err) throw err;
        });
    }

    ratejob(convid, userid, rating) {
        Conversation.findById(convid, (err, conv) => {
            if (err) throw err;
            var tutorID = conv.participants[0] == userid ? conv.participants[1] : conv.participants[0];
            User.findById(tutorID, (err, tutor) => {
                if (err) throw err;
                let update;
                if (tutor.numofjobs == 0){
                    update = {numofjobs: 1, rating: rating};
                } else {
                    update = {numofjobs: tutor.numofjobs + 1, rating: (tutor.rating + rating) / (tutor.numofjobs + 1)};
                }
                User.findByIdAndUpdate(tutor._id, update, (err, user) => {
                    if (err) throw err;
                    console.log(user);
                    Conversation.findByIdAndUpdate(convid, {Rated: true}, (err) => {
                        if (err) throw err;
                    })
                })
            })
        })
    }

    async getUserData(userid) {
        return await User.findById(userid);
    }

    // get other participant's userid
    async getotherid(convid, userid){
        try {
            var conv = await Conversation.findById(convid);
        } catch (err) {
            throw err;
        }
        return conv.participants[0] == userid ? conv.participants[1] : conv.participants[0];
    };
}

module.exports = chatHandler;