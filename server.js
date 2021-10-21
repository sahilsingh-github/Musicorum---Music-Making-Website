const http = require("http");
const express= require("express");

const app = express();

const server= http.createServer(app);
const port= process.env.PORT || 3000;

//get static files
app.use(express.static(__dirname+'/public'));

//gets index file
app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/index.html');
});

//socket.io setup 
const io = require("socket.io")(server);

//user entered
var users={};

io.on("connection", (socket)=>{

    socket.on("new-user-joined", (username)=>{
        users[socket.id]=username; //saves new used id 
        socket.broadcast.emit('user-connected', username);  //let everyone know who joined
 
        //console.log(users); 
        io.emit("user-list", users);
    });

    socket.on("disconnect", ()=>{
        socket.broadcast.emit('user-disconnected', user=users[socket.id]);
        delete users[socket.id];
        io.emit("user-list", users);

    })
    socket.on('message', (data)=>{

        socket.broadcast.emit("message", {user: data.user, msg: data.msg});
    });

});

//socket setup ends



server.listen(port, ()=> {
    console.log("server started at "+port);
})