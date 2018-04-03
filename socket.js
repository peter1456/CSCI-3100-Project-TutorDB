// handling socket events

exports = module.exports= function(io){
    var chatHandler = require(__dirname + "/chat.js");
    io.on('connection', (socket) => {
        var userid = socket.handshake.session.passport.id;
        if (userid == undefined){
            socket.disconnect(true); // disable connection when 
        } else {
            // when connected 
            chatHandler = new chatHandler();
            var Summary = chatHandler.getLatest(userid);
            var roomid = Summary[0]._id; // id of room is identified by the id of conversation 
            var socketid = socket.id; // get id of user's connection
            var conversation = chatHandler.getConversation(roomid);
            socket.join(roomid); // join the room with latest message sent
            socket.emit('roomAssign', roomid);
            socket.emit('newSummary', Summary); // show it the latest summary
            socket.emit('newConversation', conversation); // show the messages stored in database
            
            // user sending messages
            socket.on('message', (msg) => {
                chatHandler.saveMessage(roomid, msg);
                io.to(roomid).emit('message', msg);
                io.to(roomid).emit('needUpdate'); 
            })

            // user updating the "friend list"
            socket.on('reqUpdate', () => {
                Summary = chatHandler.getLatest(userid);
                socket.emit('newSummary', Summary);
            })
            
            // user changing room
            socket.on('roomchange', (newroomid) => {
                socket.leave(roomid);
                roomid = newroomid;
                socket.join(newroomid);
                // show the messages stored in database
                socket.emit('newConversation', chatHandler.getConversation(roomid)); 
            })

            socket.on('disconnect', () => {
                console.log("User with id" + userid + "disconnected");
            })
        }
    })
}