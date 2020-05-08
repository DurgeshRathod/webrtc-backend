import * as express from 'express';
import * as http from 'http';
import * as socket from "socket.io"

const app = express();

//initialize a simple http server
const server:any = http.createServer(app);

const io = socket(server)
io.sockets.on('connection', (socket) => {
    let token = socket.handshake.query.token;
    console.log("connected");
    
    socket.on('message', (message: string) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        socket.send(`Hello, you sent -> ${message}`);
        socket.emit("msg",`Hello, you sent -> ${message}`);
    });


    socket.on('JOIN_ROOM', function(room) {
        console.log("join room: "  + room);
        socket.join(room);
    });

    socket.on("LEAVE_ROOM",(room)=>{
        console.log("leaving the room" + room);
        socket.leave(room)
    })
    
    socket.on("SEND_MESSAGE",(data)=>{
        sendDataInRoom(data.room , data.message)
    })

    function sendDataInRoom(room:string, data:any){
        socket.in(room).emit('event', data);
    }
    
    //
    socket.on("NewClient", (room)=> {
        console.log("NewClient")
            socket.in(room).emit('CreatePeer');
            // socket.in(room).broadcast.emit("CreatePeer")          
    })
    socket.on('Offer', function(socketData) {
        console.log("Offer");
        let room = socketData.room;
        let offer = socketData.offer
        socket.in(room).emit("BackOffer", offer)
    })

    
    socket.on('Answer',  function(socketData) {
        console.log("Anwer")
        let room = socketData.room;
        let data = socketData.data
        socket.in(room).broadcast.emit("BackAnswer", data)
    })

    //client disconnect
    socket.on('disconnect', function(room) {
        console.log("Disconnect")
        socket.in(room).broadcast.emit("Disconnect")
    })

});


app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
  });

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on  - port ${server.address().port} :)`);
});
