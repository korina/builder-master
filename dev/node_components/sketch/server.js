
//We create a instance of the Express.JS Module
	var express = require('express'),
		app = express.createServer(),
		https = require('https');

//We configure the defualt options for the application.
	app.configure(function(){
		app.use( express.methodOverride() );
		app.use( express.bodyParser() );
		app.use( app.router );
		app.use( express.static(__dirname + '/www') );
		app.use( express.errorHandler({ dumpExceptions: true, showStack: true }) );
	});

//We then listen on port 8080 to server the files to the clients.
	app.listen(8080);

//We create a instance of the Socket.IO Module.
	var io = require('socket.io').listen(app);	

//We authorise the socket connexions.
	io.set('authorization', function (data, accept) {
		accept(null, true);
	});

//We then share the strokes applied to the whiteboard
	io.sockets.on('connection', function (socket) {
		socket.on('stroke', function (data) {
			socket.broadcast.emit('stroke', data);
		});
	});

