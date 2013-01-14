var http = require('http'),
    io = require('socket.io'),
    fs = require('fs');

var express = require('express');
var app = express();
var server = http.createServer(app);

// serve files
app.use(express.static(__dirname + '/'));

server.listen(8000)

// create the stream -> websockets connection

options = {
    hostname: 'developer.usa.gov',
    path: '/1usagov',
}

function callback(res){
    res.on('data', function(chunk){
        console.log(chunk.toString())
    })
}

var listener = io.listen(server)

listener.sockets.on('connection', function (socket) {

    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
        try {
            click = JSON.parse(chunk)
            if (click.ll) {
                socket.emit('click', click)
    //            console.log(click.ll)
            }
        } catch (err) {
            console.log(chunk)
            console.log("ERR: " + err)
        }
      });
    });
    req.end()
    
});



