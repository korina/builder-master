/**
 * @author Lee Sylvester
 * @contributor Ed Rogers
 * @copyright Influxis
 **/
( function( $ ) {

	var types = $.fn.fluxui.types;
	var fdata = $.fn.fluxui.fdata;
	var assets = $.fn.fluxui.assets;
	var $class = $.fn.fluxui.$class;

	/**
	 * Chat with Sockets class
	 * A drop-in chat client connecting to an external server. This will communicate with all clients on the server, whether FluxUI or not.
	 *
	 * Requires;
	 *		./js/fluxui_library/fluxui/controls/components.js
	 **/
	 
	var clazz = $class.create( {
		namespace : 'chat-with-sockets',
		inherits : types.display.component,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			isContainer : true
		},
		methods : {
			initialise : function( $id, $descriptor ) {
				var me = this,
					s = me.states.getCurrentStateData(),
					a = s.attr;
				// Only load the component's scripts, and subsequently build a chat client, if devmode is off.
				// This prevents the chat window from running whilst the user is editing the composition.
				// Each of the scripts who's path is specified in the JSON is prepended with the absolute server path if not already absolute.
				if ( types.core.devMode === false ) {
					var ss = a[ 'socket-settings' ],
						cs = a[ 'conversation-style' ];
					if (ss.search('http') == -1 ) ss = types.core.serverPath + ss;
					if (cs.search('http') == -1 ) cs = types.core.serverPath + cs;
					types.loader.load(
						[ ss, types.core.serverPath + 'js/components/chat/jquery.timeago.js', cs ],
						function() {
							me.setRandomColour();
							me.startChat();
						}
					)
				}
			},
			// Assigns each chat user with a random colour, which the server will store to differentiate comments.
			setRandomColour : function() {
				this.colour = {
					r : ( '0' + Math.floor( Math.random() * 256 ).toString( 16 ) ).substr( -2 ),
					g : ( '0' + Math.floor( Math.random() * 256 ).toString( 16 ) ).substr( -2 ),
					b : ( '0' + Math.floor( Math.random() * 256 ).toString( 16 ) ).substr( -2 ),
				}
				this.colour = '#' + this.colour.r + this.colour.g + this.colour.b;
			},
			// Connecting to the chat server via Web Sockets. Messages are sent to the server then bounced back to the client. Each message
			// coming back has its content decanted into a series of nested divs, spans and images, before being appended to the conversation.
			// Just for the look of the thing it periodically changes the time on messages from bare unix-time to a casual English rendering.
			startChat : function() {
				var me = this;
				var s = me.states.getCurrentStateData(),
					a = s.attr,
					socket = io.connect( a['socket-server'] );
				socket.on( 'connect', function () {
					var list = me.$node().find( '.chat-conversation' );
					socket.on( 'clear', function () {
						list.find( '.commentContainer' ).remove();
					});
					socket.on( 'message', function ( data ) {
						var commentContainer = $( '<div></div>' ).addClass( 'commentContainer' ).hide(); 
						var comment = $( '<div></div>' ).addClass( 'comment' );
						var name = $( '<span></span>' ).addClass( 'name' ).html( data.username );
						var location = $( '<span></span>' ).addClass( 'location' ).html( data.location );
						var time = $( '<span></span>' ).addClass( 'time' ).html( jQuery.timeago( data.timestamp ) );
						var pict = $( '<img src="' + data.pict + '" alt="[Profile Picture]"' + 'style="border-color:' + data.colour + '" />' ).addClass( 'profile-pict' );
						var arrow = $( '<img src=assets/chat-arrow.png />' ).addClass( 'arrow' );
						var message = $( '<span></span>' ).addClass( 'message' ).html( data.message );
						time.attr( 'timestamp', data.timestamp );
						comment.append( name );
						comment.append( location );	
						comment.append( time );
						comment.append( message );
						commentContainer.append( pict );
						commentContainer.append( arrow );
						commentContainer.append( comment );
						list.prepend( commentContainer );
						commentContainer.fadeIn( 'slow' );
					});
					setInterval( function() { 
						var list = me.$node().find( '.chat-conversation' );
						list.children().map( function() { 
							var comment = $( this );
							if( comment.has( '.time' ).children().length > 0 ){ 
								var time = comment.find( '.time' );	
								var timestamp = parseFloat( time.attr( 'timestamp' ) );
								time.html( jQuery.timeago( timestamp ) );
							}
						});
					}, 30000 );	
				});
				me.$node().find( '.chat-submit' ).click( function( event ) { 
					event.preventDefault();
					var data = { 
						username : me.$node().find( '.chat-username' ).val(),
						pict : me.$node().find( '.chat-picture' ).val(),
						location : me.$node().find( '.chat-location' ).val(),
						message : me.$node().find( '.chat-message' ).val(),
						colour : me.colour
					}
					if ( data.username != '' && data.message != '' ) {
						me.$node().find( '.chat-message' ).val( '' ); 
						socket.emit( 'message', data );
					}
				});
			},
			// Change the paths of the socket scripts.
			setSockets : function( $settings, $server ) {
				if ( !!$settings ) this.states.setAttributeOnCurrentState( 'socket-settings', $settings );
				if ( !!$server ) this.states.setAttributeOnCurrentState( 'socket-server', $server );
				this.applyStateAttributes();
			},
			// Change the path of the stylesheet describing the conversation.
			setConversationStyle : function( $stylesheet ) {
				this.states.setAttributeOnCurrentState( 'conversation-style', $stylesheet );
				this.applyStateAttributes();
			},
			// Change the standard picture representation of a chat user (default is a cartoon of Scrooge).
			setStandardPicture : function( $picUrl ) {
				this.states.setAttributeOnCurrentState( 'standard-picture', $picUrl );
				this.applyStateAttributes();
				this.$node().find( '.chat-picture' ).val( me.states.getCurrentStateData().attr( 'standard-picture' ) );
			},
			attribute : function( attr, value, updateState ) {
				if ( attr == 'socket-settings' || attr == 'socket-server' || attr == 'conversation-style' || attr == 'standard-picture' ) return "";
				return clazz.Super.attribute.call( this, attr, value, updateState );
			}
		},
		statics: {
			colour : {}
		}
	} );
	
} )( jQuery,this );
