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
	 * Social Sketching class
	 * A prototype social whiteboard client connecting to an external server (inactive as of 18th Sept, 2012)
	 * This will communicate with all clients on the server, whether FluxUI or not.
	 * Requires more work to make it fit in with some pre-existing Influxis services.
	 *
	 * Requires;
	 *		./js/fluxui_library/fluxui/controls/components.js
	 **/
	
	var clazz = $class.create( {
		namespace : 'social-sketching',
		inherits : types.display.component,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			isContainer : true,
			markup : '<canvas />'
		},
		methods : {
			initialise : function( $id, $descriptor ) {
				var me = this,
					s = me.states.getCurrentStateData(),
					a = s.attr;
				// Only load the component's scripts, and subsequently build a chat client, if devmode is off.
				// This prevents the chat window from running whilst the user is editing the composition. As stated above, the server is not
				// currently live and is therefore excluded. See Chat With Sockets for a functional example.
				// Each of the scripts who's path is specified in the JSON is prepended with the absolute server path if not already absolute.
				if ( types.core.devMode === false ) {
					var ss = a[ 'socket-settings' ];
					if (ss.search('http') == -1 ) ss = types.core.serverPath + ss;
					types.loader.load( ss, function() {
						me.canvas = document.getElementById( me.$node().attr( 'id' ) );
						me.setRandomColour();
						me.paint();
					} );
				}
			},
			// Assigns each whiteboard user with a random colour, which the server will store to differentiate brush strokes.
			// Can be over-ridden with a set colour in the component's property sheet.
			setRandomColour : function() {
				this.colour = {
					r : ( '0' + Math.floor( Math.random() * 256 ).toString( 16 ) ).substr( -2 ),
					g : ( '0' + Math.floor( Math.random() * 256 ).toString( 16 ) ).substr( -2 ),
					b : ( '0' + Math.floor( Math.random() * 256 ).toString( 16 ) ).substr( -2 ),
				}
				this.colour = '#' + this.colour.r + this.colour.g + this.colour.b;
			},
			// Setting up the canvas, brushes and rubber.
			setCanvasAttrs : function() {
				var me = this,
					s = me.states.getCurrentStateData(),
					a = s.attr;
				me.canvas.width = parseFloat( me.$node().css( 'width' ) );
				me.canvas.height = parseFloat( me.$node().css( 'height' ) );
				if ( a[ 'brush-color' ] != 'random' ) me.colour = a[ 'brush-color' ];
				me.brushSize = a[ 'brush-size' ]; // 8
				if ( a[ 'rub-color' ] == 'background' ) me.rubColour = me.$node().css( 'background-color' ); // #ffffff
				else me.rubColour = a[ 'rub-color' ];
				me.rubSize = a[ 'rub-size' ]; // 25
				me.rubKey = a[ 'rub-key' ]; // 16. Include link to key values in property sheet
			},
			// Connecting to the server via Web Sockets. Strokes are sent to the server and simultaneously drawn by the client. 
			// This avoids an obvious lag.
			paint : function() {
				var me = this;
				var s = me.states.getCurrentStateData(),
					a = s.attr;
					socket = io.connect( a['socket-server'] );
				socket.on( 'connect', function () {
					var userColour, context, tool, linewidth;
					me.setCanvasAttrs();
					userColour = me.colour;
					lineWidth = me.brushSize;
					function init () {
						context = me.canvas.getContext( '2d' );
						localCoods = {};
						tool = new tool_pencil();
						me.canvas.addEventListener( 'mousedown', ev_canvas, false );
						me.canvas.addEventListener( 'mousemove', ev_canvas, false );
						document.addEventListener( 'mouseup',	ev_canvas, false );
						document.addEventListener( 'keydown', ev_keydown, false );
						document.addEventListener( 'mouseup', ev_mouseup, false );
					}
					function ev_keydown ( ev ) {
						if ( ev.keyCode == me.rubKey ) {
							userColour = me.rubColour;
							lineWidth = me.rubSize;
						}
					}
					function ev_mouseup ( ev ) {
						userColour = me.colour;
						lineWidth = me.brushSize;
					}
					function tool_pencil () {
						var tool = this;
						this.started = false;
						this.mousedown = function ( ev ) {
							localCoods.x = ev._x;
							localCoods.y = ev._y;
							tool.started = true;
						};
						this.mousemove = function ( ev ) {
							if ( tool.started ) {
								context.beginPath();
								context.lineWidth = lineWidth;
								context.moveTo( localCoods.x, localCoods.y );
								context.lineTo( ev._x, ev._y );
								context.strokeStyle = userColour;
								context.stroke();
								socket.emit( 'stroke', { _x : localCoods.x, _y : localCoods.y, x : ev._x, y : ev._y, c : userColour, w : lineWidth } );
								localCoods.x = ev._x;
								localCoods.y = ev._y;
							}
						};
						socket.on( 'stroke', function( stroke ){
							context.beginPath();
							context.lineWidth( stroke.w );
							context.moveTo( stroke._x, stroke._y );
							context.lineTo( stroke.x, stroke.y );
							context.strokeStyle = stroke.c;
							context.stroke();
						} );
						this.mouseup = function ( ev ) {
							if ( tool.started ) {
								tool.mousemove( ev );
								tool.started = false;
								socket.emit( 'strokeEnd' );
								userColour = me.colour;
								lineWidth = me.brushSize;
							}
						};
					}
					function ev_canvas ( ev ) {
						if ( ev.offsetX || ev.offsetX == 0 ) { // Opera
							ev._x = ev.offsetX;
							ev._y = ev.offsetY;
						} else if ( ev.layerX || ev.layerX == 0 ) { // Firefox
							ev._x = ev.layerX;
							ev._y = ev.layerY;
						}
						var func = tool[ev.type];
						if ( func ) func( ev );
					}
					init();
				} );
			},
			// Chnages the brush to fit the values passed.
			setBrush : function( $colour, $size ) {
				if ( !!$colour ) this.states.setAttributeOnCurrentState( 'brush-color', $colour );
				if ( !!$size ) this.states.setAttributeOnCurrentState( 'brush-size', $size );
				this.applyStateAttributes();
				this.setCanvasAttrs();
			},
			// Set the rubber to fit the values passed.
			setRub : function( $colour, $size, $key ) {
				if ( !!$colour ) this.states.setAttributeOnCurrentState( 'rub-color', $colour );
				if ( !!$size ) this.states.setAttributeOnCurrentState( 'rub-size', $size );
				if ( !!$key ) this.states.setAttributeOnCurrentState( 'rub-key', $key );
				this.applyStateAttributes();
				this.setCanvasAttrs();
			},
			// Set the socket values to fit those passed.
			setSockets : function( $settings, $server ) {
				if ( !!$settings ) this.states.setAttributeOnCurrentState( 'socket-settings', $settings );
				if ( !!$server ) this.states.setAttributeOnCurrentState( 'socket-server', $server );
				this.applyStateAttributes();
			},
			attribute : function( attr, value, updateState ) {
				if ( attr == 'brush-color' || attr == 'brush-size' || attr == 'rub-color' || attr == 'rub-size' || attr == 'rub-key' || attr == 'socket-settings' || attr == 'socket-server' ) return "";
				return clazz.Super.attribute.call( this, attr, value, updateState );
			}
		},
		statics: {
			colour : {},
			brushSize : 0,
			rubColour : '',
			rubSize : 0,
			rubKey : 0,
			canvas : {}
		}
	} );
	
} )( jQuery,this );
