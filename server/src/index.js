var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var filewatcher = require('filewatcher');
var watcher = filewatcher();
var fs = require('fs');

var fileText = "";
fs.readFile('message.txt', function(err, contents) {
  fileText = contents;
});
watcher.add('message.txt');

app.get('/', function (req, res) {
  res.locals = {text: fileText};
	res.render('index.ejs');
});

io.on('connect', function(client) {
  console.log('we have company...');

  // watch for a file change
  watcher.on('change', function(file, stat) {
    console.log('File %s has been changed', file);
    if(!stat) { console.log("File %s has been deleted!!!", file); }
    fs.readFile('message.txt', function(err, contents) {
      fileText = contents;
      client.broadcast.emit('update', fileText.toString());
    });

  });

});


server.listen(8080);
console.log('Running on http://localhost:8080');
