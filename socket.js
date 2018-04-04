// handling socket events

 module.exports= async function(io){
    var ChatHandler = require(__dirname + "/chat.js");
    io.on('connection', async function (socket) {
        if (socket.handshake.session.passport == undefined){
            socket.disconnect(true); // disable connection when not logged in 
        } else {
            // when connected 
            userid = socket.handshake.session.passport.user;
            console.log('User with id ' + userid + ' connected');
            chatHandler = new ChatHandler();
            var Summary = await chatHandler.getLatest(userid);
            console.log('Summary get');
            console.log(Summary);
            var roomid = Summary[0]._id; // id of room is identified by the id of conversation 
            console.log("The roomid is " + roomid)
            var conversation = await chatHandler.getConversation(roomid);
            console.log(conversation);
            socket.join(roomid); // join the room with latest message sent
            socket.join(userid); // this channel is for update notification
            var userData = await chatHandler.getUserData(userid);
            socket.emit('Init', {userid: userid, roomid: roomid, userData: userData});
            socket.emit('newSummary', Summary); // show it the latest summary
            socket.emit('newConversation', conversation); // show the messages stored in database
            socket.emit('setButtons');
            
            // user sending messages
            socket.on('message', async (msg) => {
                console.log('Message received');
                console.log(msg);
                chatHandler.saveMessage(roomid, msg);
                io.to(roomid).emit('newConversation', await chatHandler.getConversation(roomid));
                io.to(userid).emit('needUpdate'); 
                otherid = await chatHandler.getotherid(roomid, userid);
                io.to(otherid).emit('needUpdate');
            })

            // user updating the "friend list"
            socket.on('reqUpdate', async () => {
                console.log("update request received");
                Summary = await chatHandler.getLatest(userid);
                socket.emit('newSummary', Summary);
            })
            
            // user changing room
            socket.on('roomchange', async (newroomid) => {
                console.log("room change");
                socket.leave(roomid);
                roomid = newroomid;
                socket.join(roomid);
                // show the messages stored in database
                socket.emit('newConversation', await chatHandler.getConversation(roomid)); 
            })

            socket.on('accept', () => {
                chatHandler.acceptjob(roomid, userid).then(io.to(roomid).emit('needUpdate'));
            });

            socket.on('rate', (rating) => {
                chatHandler.ratejob(roomid, userid).then(io.to(roomid).emit('needUpdate'));
            })

            socket.on('disconnect', () => {
                console.log("User with id" + userid + "disconnected");
            })
        }
    })
}