


//This sample is an adaption of the video chat sample with a roll-your-own login system. It explains how to use Twitter's
// API to avoid insisting that users create (yet another) online account, and for POSTing tweets on their behalf.


		
//We create a instance of the Express.JS Module
	var express = require('express'),
		mongoose = require( 'mongoose' ),
		MemoryStore = express.session.MemoryStore,
		app = express.createServer(),
		sessionStore = new MemoryStore(),
		https = require('https');



//We store all the values for our Twitter application in an object.
//To get these you will need to register a new app @ http://dev.twitter.com .
	var twitter = {
		accessToken : '400385414-DruOmwPSXMCKab7gXVDPAxpNgeX5hJ8RY3v5sy0y',
		accessSecret : 'egE8W7KCuIWBy6wXNQ8n3e4FatYmDYsGNmaJkpu9cn0',
		consumerKey : 'Kxmp5OJfry7YmLamxjIT0A',
		consumerSecret : 'cLuU5FMdcqnpDbV75hzxqGjqQcLvTiJnkghFGVT7pRQ'
	};



//We are going to use OAuth to integrate our login with Twitter. The URL you use (6th value) is where Twitter will return
// your application to after your user allows the app access. Set it @ http://dev.twitter.com .
	var OAuth= require('oauth').OAuth,
		oa = new OAuth(
		"https://api.twitter.com/oauth/request_token",
		"https://api.twitter.com/oauth/access_token",
		twitter.consumerKey,
		twitter.consumerSecret,
		"1.0",
		"http://184.173.168.225:8080/auth_twitter",
		"HMAC-SHA1"
	);



//We then create the the database schema for our MongoDB database.
	mongoose.connect( 'mongodb://localhost/social_chat_twitter_1' );
	var MessageSchema = new mongoose.Schema({ username:String, location:String, message:String, timestamp:Number, pict:String, colour:Array }),
		MessageModel = mongoose.model('MessageModel', MessageSchema);



//We configure the defualt options for the application.
	app.configure(function(){
		app.use( express.methodOverride() );
		app.use( express.bodyParser() );
		app.use( express.cookieParser() );
		app.use( express.session({ store: sessionStore, secret: 'nodecloud.io', key: 'connect.sid' }) );
		app.use( app.router );
		app.use( express.static(__dirname + '/www') );
		app.use( express.errorHandler({ dumpExceptions: true, showStack: true }) );
	});	



//We then listen on port 8080 to server the files to the clients.
	app.listen(8080);



//We authenticate via twitter using OAuth. Anyone visiting '/twitter/' is forwarded to Twitter where they confirm whether they want
// to give the application access to their account. We also save the oauth_token and oauth_token_secret into the session object.
	app.get('/twitter', function(request, response){
		oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
			if (error) {
				console.log(error);
			} else {
				request.session.oauth = {
					token : oauth_token,
					token_secret : oauth_token_secret,
				};
				response.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
			}
		});
	});



//Twitter returns the user to this address once they have confirmed access to their account for our application.
//Assuming there's no error we save the screen name, access token, and secret to the session object, ready to be passed
// to the socket connexion with 'io.set('authorization'' (see below). In order to get more information about the user
// we can make a https request. We're only getting the profile image now, but you can see a plethora of facts in 'userInfo'.
	app.get('/auth_twitter', function(request, response, next){
		if (request.session.oauth) {
			request.session.oauth.verifier = request.query.oauth_verifier;
			oa.getOAuthAccessToken(
				request.session.oauth.token,
				request.session.oauth.token_secret,
				request.session.oauth.verifier, 
				function(error, oauth_access_token, oauth_access_token_secret, results){
					if (error){
						console.log(error);
						response.redirect( '/twitter' );
					} else {
						request.session.oauth.screen_name = results.screen_name;
						request.session.oauth.access_token = oauth_access_token;
						request.session.oauth.access_token_secret = oauth_access_token_secret;
						var colour = {
							r : ('0' + Math.floor(Math.random() * 256).toString(16)).substr(-2),
							g : ('0' + Math.floor(Math.random() * 256).toString(16)).substr(-2),
							b : ('0' + Math.floor(Math.random() * 256).toString(16)).substr(-2),
						};
						request.session.oauth.colour = '#' + colour.r + colour.g + colour.b;
						var str = '';
						https.get(
							{
								host: 'api.twitter.com',
								path: '/1/users/show.json?screen_name=' + results.screen_name + '&include_entities=true'
							},
							function(resp) {
								resp.on('data', function (chunk) {
									str += chunk;
								});
								resp.on('end', function () {
									var userInfo = JSON.parse(str.replace('\\', ''));
									request.session.oauth.profile_pict = userInfo['profile_image_url_https'];
									response.redirect( '/' );
								});
							}
						);
					}
				}
			);
		} else
			next(new Error("You're not supposed to be here."));
	});



//Logout destroys the session before redirecting to the login page.
	app.get('/logout', function(request, response) {
		if (request.session){
			request.session.destroy();
		}
		response.redirect( '/' );
	} );



//We create a instance of the Socket.IO Module.
	var io = require('socket.io').listen(app);	



//We authorise the socket connexions. First we parse the cookie by taking the key value (which must match that set in 'app.configure')
// and unescaping characters such as '/' and '+'. Then we search for the matching session. When it is found we save the session to the
// data object so that it can be used by socket.io, which it cannot normally do.
	io.set('authorization', function (data, accept) {
		if (data.headers.cookie) {
			data.sessionID = unescape(data.headers.cookie.replace('connect.sid=', ''));
			sessionStore.get(data.sessionID, function (error, session) {
				if (error || !session) {
					accept(error, false);
				} else {
					data.session = session;
					accept(null, true);
				}
			});
		} else {
			 return accept('No cookie transmitted.', true);
		}
		accept(null, true);
	});



//We then handle messages received.
	io.sockets.on('connection', function (socket) {



	//We send the latest messages to the chatees by doing a 'find' search for messages in the database.
	//Depending on how you wish to run the server you may wish to discard old messages during this process. Currently they're all logged.
		MessageModel.find({}, function (err, messages) {
			for (i = 0; i < 11; i++) {
				socket.emit('message', messages[messages.length - 10 + i]);
			}
		});



	//Allow the user to interact with the chat if the 'oauth' object has been found in the 'handshake' from 'io.set('authorization''.
		if (socket.handshake.session && socket.handshake.session.oauth && socket.handshake.session.oauth.access_token) {



		//Demonstrate to the client that the user is logged in.
			socket.emit('login', {
				username : socket.handshake.session.oauth.screen_name,
				location : '...', pict : socket.handshake.session.oauth.profile_pict,
				colour: socket.handshake.session.oauth.colour,
			});



		//We 'tweet' and broadcast the user's messages. Firstly we create a message. Then we create a tweet (in this case we're not including
		// anything more than the 'status', or main body of text. However you could use 'mess.location' to populate the tweet's 'place_id'
		// value, or have a system that inserts hashtags relevent to the conversation in hand. To do so see this documentation:
		// https://dev.twitter.com/docs/api/1/post/statuses/update.
		//Then we POST the tweet using the access token and corresponding secret that Twitter gave us when the user logged in (see
		// 'app.get('/auth_twitter'' above). If this goes well then we also broadcast it to the rest of the chatees.
			socket.on('message', function (data) {
				var mess = new MessageModel();
				mess.username = socket.handshake.session.oauth.screen_name;
				mess.pict = socket.handshake.session.oauth.profile_pict;
				mess.location = data.location;
				mess.message = data.message;
				mess.timestamp = Date.now();
				mess.colour = socket.handshake.session.oauth.colour;
				var tweet = ({ 'status': mess.message });
				if (data.tweet == 1) {
					oa.post(
						"http://api.twitter.com/1/statuses/update.json",
						socket.handshake.session.oauth.access_token,
						socket.handshake.session.oauth.access_token_secret, 
						tweet,
						"application/json",
						function (error, data, response2) {
							if(error){
								console.log(error);
								socket.emit('loginerror', 'Tweet rejected by Twitter. Make sure its not a duplicate.');	
							}else{
								console.log('Twitter status updated');
								broadcast();
							}
						}
					);
				} else {
					broadcast();
				}
				function broadcast(){
					console.log('PICT : ', mess.pict);
					mess.save();
					socket.broadcast.emit('message', mess);
					socket.emit('message', mess);
					socket.emit('login', {
						username : mess.username,
						location : mess.location,
						pict : mess.pict,
						colour : socket.handshake.session.oauth.colour
					});
				}
			});


		//Now we'll share the strokes applied to the whiteboard
			socket.on('stroke', function (data) {
				console.log(data);
				socket.broadcast.emit('stroke', data);
			});
		}	
	});



