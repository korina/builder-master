$( document ).ready( function() { 
	var socket = io.connect( 'http://184.173.168.225:8080/' );
	socket.on( 'reconnect_failed', function () { 
		$( '#connectionModal' ).modal( { backdrop:'static', keyboard: false, show: true });
	});
	var userColor = { 
		r : ( '0' + Math.floor( Math.random() * 256 ).toString( 16 ) ).substr( -2 ),
		g : ( '0' + Math.floor( Math.random() * 256 ).toString( 16 ) ).substr( -2 ),
		b : ( '0' + Math.floor( Math.random() * 256 ).toString( 16 ) ).substr( -2 ),
	}
	userColor = '#' + userColor.r + userColor.g + userColor.b;
	socket.on( 'connect', function () {
		var list = $( '#conversationList' );
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
			var arrow = $( '<img src=assets/img/arrow.png />' ).addClass( 'arrow' );
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
			var list = $( '#conversationList' );
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
	$( '#commentButton' ).click( function( event ) { 
		event.preventDefault();
		var data = { 
			username : $( '#usernameInput' ).val(),
			pict : $( '#pictInput' ).val(),
			location : $( '#locationInput' ).val(),
			message : $( '#messageInput' ).val(),
			colour : userColor
		}
		$( '#messageInput' ).val( '' ); 
		socket.emit( 'message', data );
	});
 });

