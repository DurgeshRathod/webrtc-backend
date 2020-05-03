import * as express from 'express';
import * as http from 'http';
import * as socket from "socket.io"

const app = express();

//initialize a simple http server
const server:any = http.createServer(app);

const io = socket(server)
io.sockets.on('connection', (socket) => {

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
});``

//start our server

server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on  - port ${server.address().port} :)`);
});
