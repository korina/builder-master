var express = require('express'),
	mongoose = require( 'mongoose' ),
	MemoryStore = express.session.MemoryStore,
	app = express.createServer(),
	sessionStore = new MemoryStore(),
	https = require('https');

mongoose.connect( 'mongodb://localhost/social_chat_twitter_1' );
var MessageSchema = new mongoose.Schema({ username:String, location:String, message:String, timestamp:Number, pict:String, colour:Array }),
	MessageModel = mongoose.model('MessageModel', MessageSchema);

app.configure(function(){
	app.use( express.methodOverride() );
	app.use( express.bodyParser() );
	app.use( express.cookieParser() );
	app.use( express.session({ store: sessionStore, secret: 'nodecloud.io', key: 'connect.sid' }) );
	app.use( app.router );
	app.use( express.static(__dirname + '/www') );
	app.use( express.errorHandler({ dumpExceptions: true, showStack: true }) );
});	

app.listen(8080);

var io = require('socket.io').listen(app);	

io.sockets.on('connection', function (socket) {

	socket.emit('clear');
	MessageModel.find({}, function (err, messages) {
		for (i = 0; i < 11; i++) {
			socket.emit('message', messages[messages.length - 10 + i]);
		}
	});

	socket.on('message', function (data) {
		var mess = new MessageModel();
		mess.username = data.username;
		mess.pict = data.pict;
		mess.location = data.location;
		mess.message = data.message;
		mess.timestamp = Date.now();
		mess.colour = data.colour;
		mess.save();
		socket.broadcast.emit('message', mess);
		socket.emit('message', mess);
	})
});

