var http = require('http'),
    io = require('socket.io'),
    fs = require('fs'),
    express = require('express');

// serve files
var app = express();
var server = http.createServer(app);
app.use(express.static(__dirname + '/'));
server.listen(8000)

// create the stream -> websockets connection
options = {
    hostname: 'developer.usa.gov',
    path: '/1usagov',
}

var listener = io.listen(server)

listener.sockets.on('connection', function (socket) {
    // once the socket connection is open, make the http request to the stream
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            // when we get data (chunk) try to parse it
            try {
                click = JSON.parse(chunk)
                if (click.ll) {
                    // if the parsed JSON has a lat/lon in it, then send it to the client
                    socket.emit('click', click)
                }
            } catch (err) {
                // print out parsing errors
                console.log("ERR: " + err)
            }
      });
    });
    // (oddly?) we call the request's .end() method to get the whole thing going
    req.end()
});



