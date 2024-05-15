const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const server = require('http').createServer(app);
const environment = process.env.NODE_ENV || "prod";

// Set Server for Localhost
let serverOrigin = "http://localhost:8080/";
console.log(serverOrigin);

//Initialize application with route
app.use(express.static(path.join(__dirname, 'public')));

// REST API
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

//  WEB SOCKET PART
const io = require('socket.io')(server, {
    cors: {
        origin: serverOrigin,
        methods: ["GET", "POST"]
    }
});

const messageFunc = (from, msg) => {
    console.log("debugging messageFunc")
    console.log(from)
    console.log(msg)

    // add more complex logic here
    io.emit('server-message', from, msg);
}

io.on('connection', function (socket) {
    socket.on('message', messageFunc);

    
});

// Create Array for storing MeetingList
let fakeMeetingsList = []

app.get('/api/zoom/fake/meeting', (req, res) => {
    //  TODO: use file sync to read json of real zoom date
    io.emit('server-message', JSON.stringify({
        "content": "this is a totally fake thing",
        "from": "fake",
        "type": "text",
        "room": "hard-coded"
    }));
    res.send({status: 200});
});

// Listen appliaction request on port 80
server.listen(process.env.PORT || 8080, '0.0.0.0', function () {
    console.log('Server Running in port 8080');    
});
