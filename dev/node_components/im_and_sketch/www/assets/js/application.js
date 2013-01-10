
//We setup the application for when the document is ready
	$(document).ready(function() {



	//Hide message sending and sketching capacity
		$('.commentForm').hide();
		$('#canvasContainer').hide();


	
	//We set the initial status of the comment button to be loading while we connect
		$('#commentButton').button('loading');

	

	//We create a instance of the socket.io client
		var socket = io.connect();



	//We then display a message if we could not reconnect to the socket.io server
		socket.on('reconnect_failed', function () {
			$('#connectionModal').modal({ backdrop:"static", keyboard: false, show: true });
			//$('#connectionModal').modal('hide');
		});



	//We then handle when we have a connection with the server 
		socket.on('connect', function () {



		//Creating a variable for the users colour value
			var userColor;


		
		//We then reset the comment button 
			$('#commentButton').button('reset');



		//We then handle when we receive a message from the server
			socket.on('message', function (data) { 


				
			//We create a reference to the conversation list
				var list = $('#conversationList');



			//We remove the "no message" intial comment 
				list.find(".noMessages").fadeOut('slow', function() {
 					$(this).remove()
				});



			//We then create a new comment in the conversation
				var commentContainer = $('<div></div>').addClass('commentContainer').hide(); 
				var comment = $('<div></div>').addClass("comment");
				var postmeta = $('<div></div>').addClass("postmeta");
				var time = $('<span></span>').addClass("time").html(jQuery.timeago(data.timestamp));
				var name = $('<span></span>').addClass("name").html(data.username);
				var location = $('<span></span>').addClass("location").html(data.location);
				var pict = $('<img src="' + data.pict + '" alt="[Profile Picture]"' + 'style="border-color:' + data.colour + '" />').addClass('profile-pict');
				var arrow = $('<img src=assets/img/arrow.png />').addClass('arrow');
				var message = $('<p></p>').addClass("message").html(data.message);
				time.attr("timestamp", data.timestamp );	



			//We then append all the elements in the new comment
				comment.append(postmeta);
				comment.append(name);
				comment.append(location);
				comment.append(message);
				postmeta.append(time);
				commentContainer.append(pict);
				commentContainer.append(arrow);
				commentContainer.append(comment);
				list.prepend(commentContainer);
				commentContainer.fadeIn('slow');
			});



		//We handle a login confirmation sent from the server by hiding the required form elements
			socket.on('login', function(user){
				console.log(user);
				$('.nameGroup').hide();
				$('.commentForm').show();
				$('#loggedin').html('Logged in as <em>' + user.username + '</em> in ...');
				$('.profile_pict').attr('src', user.pict);
				userColour = user.colour;
				$('.profile_pict').css('border-color', userColour);
				$('#canvasContainer').show();
			});


			
		//We handle a login error sent from the server by asking the user to try again
			socket.on('loginerror', function(data){
					$('#loginerror').html(data);
				$('.nameGroup').show();
				$('.commentForm').hide();
			});



		//We then setup a interval to update all the timestamps
			setInterval(function() {
				var list = $('#conversationList');
				list.children().map(function() {
					var comment = $(this);
					if(comment.has(".time").children().length > 0 ){
						var time = comment.find(".time");	
						var timestamp = parseFloat(time.attr("timestamp"));
						time.html(jQuery.timeago(timestamp));
					}
				});
			}, 30000);	
 		});
	


		//We then configure the typeahead for the location of the user
			var locations = new Array("Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burma", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Mongolia", "Morocco", "Monaco", "Mozambique", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Neverneverland", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", " Sao Tome", "Saudi Arabia", "Sealand", "Senegal", "Serbia and Montenegro", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Wales", "Yemen", "Zambia", "Zimbabwe");
			$('#locationInput').typeahead({ source:locations, items:8 });



		//We then handle submitting new comments to the conversation
			$('#commentButton').click( function( event ) {


					
			//We prevent the defualt action for the button
				event.preventDefault();


				
			//We then validate the form before send the comement
				if( $("form.commentForm").validate().form() ){ 



				//We then generate the data which we are going to send to the server
					var data = {};
					data.location = $('#locationInput').val(); 
					data.message = $('#messageInput').val();
					data.tweet = $("#tweet:checked").length;	
					$('#messageInput').val(""); 



				//We then broadcast the messsage	
					socket.emit('message', data );
				}		
			});



		//We set up the canvas for drawing
			var canvas, context, tool;

			function init () {
				// Find the canvas element.
				canvas = document.getElementById('imageView');
				context = canvas.getContext('2d');
				localCoods = {};

				// Pencil tool instance.
				tool = new tool_pencil();

				// Attach the mousedown, mousemove and mouseup event listeners.
				canvas.addEventListener('mousedown', ev_canvas, false);
				canvas.addEventListener('mousemove', ev_canvas, false);
				canvas.addEventListener('mouseup',	 ev_canvas, false);
			}

			// This painting tool works like a drawing pencil which tracks the mouse 
			// movements.
			function tool_pencil () {
				var tool = this;
				this.started = false;

				// This is called when you start holding down the mouse button.
				// This starts the pencil drawing.
				this.mousedown = function (ev) {
						localCoods.x = ev._x;
						localCoods.y = ev._y;
						tool.started = true;
				};

				// This function is called every time you move the mouse. Obviously, it only 
				// draws if the tool.started state is set to true (when you are holding down 
				// the mouse button).
				this.mousemove = function (ev) {
					if (tool.started) {
						context.beginPath();
						context.moveTo(localCoods.x, localCoods.y);
						context.lineTo(ev._x, ev._y);
						context.strokeStyle = userColour;
						context.stroke();
						socket.emit('stroke', { _x : localCoods.x, _y : localCoods.y, x : ev._x, y : ev._y, c : userColour});
						localCoods.x = ev._x;
						localCoods.y = ev._y;
					}
				};

				//Drawing remote strokes to the canvas
				socket.on('stroke', function(stroke){
					context.beginPath();
					context.moveTo(stroke._x, stroke._y);
					context.lineTo(stroke.x, stroke.y);
					context.strokeStyle = stroke.c;
					context.stroke();
				});

				// This is called when you release the mouse button.
				this.mouseup = function (ev) {
					if (tool.started) {
						tool.mousemove(ev);
						tool.started = false;
						socket.emit('strokeEnd');
					}
				};
			}

			// The general-purpose event handler. This function just determines the mouse 
			// position relative to the canvas element.
			function ev_canvas (ev) {
				if (ev.offsetX || ev.offsetX == 0) { // Opera
					ev._x = ev.offsetX;
					ev._y = ev.offsetY;
				} else if (ev.layerX || ev.layerX == 0) { // Firefox
					ev._x = ev.layerX;
					ev._y = ev.layerY;
				}

				// Call the event handler of the tool.
				var func = tool[ev.type];
				if (func) {
					func(ev);
				}
			}

			init();
	});



