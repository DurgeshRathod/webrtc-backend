import * as express from 'express';
import * as http from 'http';
import * as socket from "socket.io"

const app = express();

//initialize a simple http server
const server:any = http.createServer(app);

const io = socket(server)
io.sockets.on('connection', (socket) => {

    console.log("connected");
    socket.send("abcdef");
    
    socket.on('message', (message: string) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        socket.send(`Hello, you sent -> ${message}`);
    });


    socket.on('JOIN_ROOM', function(room) {
        if(socket.rooms.room){
            socket.leave(socket.rooms.room);
        }
    
        socket.join(room);
    });

    socket.on("LEAVE_ROOM",(room)=>{
        socket.leave(room)
        
    })
    socket.send("CONNECTED")
    // now, it's easy to send a message to just the clients in a given room
    
    socket.on("message",(data)=>{
        // socket.in(room).emit('message', 'what is going on, party people?');
        sendDataInRoom(socket.rooms[Object.keys(socket.rooms)[0]] , data)
    })
    // io.sockets.in(room).emit('message', 'what is going on, party people?');

    function sendDataInRoom(room:string, data:any){
        io.sockets.in(room).emit('event', data);
    }
});

//start our server

server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on  - port ${server.address().port} :)`);
});
