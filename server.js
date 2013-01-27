var http = require('http'),
    io = require('socket.io'),
    fs = require('fs'),
    express = require('express');

// serve files
var app = express();
var server = http.createServer(app);
app.use(express.static(__dirname + '/'));
server.listen(8000)

// connect to the stream
options = {
    hostname: 'developer.usa.gov',
    path: '/1usagov',
}

// create the http request
sockets = [] // sockets is a list of all the sockets that have been created
req = http.request(options, function(res) {
    console.log('request made')
    res.setEncoding('utf8')
    
    res.on('data', function(chunk){
        // when we get data (chunk) try to parse it
        try {
            click = JSON.parse(chunk)
            if (click.ll) {
                // if the parsed JSON has a lat/lon in it, then send it to the client
                sockets.map(function(socket){
                    socket.emit('click', click)
                })
            }
        } catch (err) {
            // print out parsing errors
            console.log("PARSE ERR: " + err)
            console.log(chunk)
        }
    })
    res.on('error', function(err){
        console.log('SOCKET ERR: ' + err)
    })
})

// create the listener and listen for new sockets
var listener = io.listen(server)
listener.set('log level', 1);
listener.sockets.on('connection', function (socket) {
    //register socket with the stream request
    sockets.push(socket)
})

req.end()



