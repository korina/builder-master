
//We setup the application for when the document is ready
	$(document).ready(function() {

	//We create a instance of the socket.io client
		var socket = io.connect( 'http://184.173.168.225:8080/' );

	//We then handle when we have a connection with the server 
		socket.on('connect', function () {

		//Creating a variable for the users colour value
			var userColour = {
				r : ('0' + Math.floor(Math.random() * 256).toString(16)).substr(-2),
				g : ('0' + Math.floor(Math.random() * 256).toString(16)).substr(-2),
				b : ('0' + Math.floor(Math.random() * 256).toString(16)).substr(-2),
			},
			userColour = '#' + userColour.r + userColour.g + userColour.b;

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
	});



