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
	var selection = types.selection.getInstance();
	var eventDispatcher = types.events.dispatcher.getInstance();

	/**
	 * Interaction class
	 * Provides methods for interacting with elements, including mouse movement and key presses
	 **/
	
	$class.create( {
		namespace : 'interaction',
		constructor : function( $inst, $behavior, $bind ) {
			this.inst = $inst;
			this.behavior = types.core.clone( $behavior ) || {};
			this.bind = types.core.clone( $bind ) || {};
			
			this.keymap = {};
			this.keyEvent = {};
			this.pressed = {};
			this.shiftpressed = {};
			this.ctrlpressed = {};
			this.released = {};
			this.toggled = {};
		},
		methods : {
			
			/**
			 * Behaviors
			 * Applies behaviors to the node. May need re-adding on remove / re-add.
			 **/
			
			applyBehaviors : function() {
				var b = this.behavior;
				if ( !!b )
					for ( var i in b ) {
						if ( b.hasOwnProperty( i ) ) {
							if ( !!b[i].action ) 
								this.inst.$node().bind( i, { caller : this, event : b[i] }, function( e ) {
									// Passing 'doAction' the action, event, and also the whole event object for pageX &c. and 'this' hack
									e.data.caller.doBehavior( e.data.event.action, e.data.event, e );
								} );
							if ( !!b[i].event )
								$.fn.fluxui.evt().bind( this.inst.$node(), i, b[i].event );
						}
					}
			},
			
			// Performs a given action (from string)
			doBehavior : function( $action, $data, $e ) {
				this.inst[$action]( $data, $e );
			},
			
			/**
			 * Drag handlers
			 **/

			// Check for mobile events support, else use mouse events.
			initDrag : function( $c, $d ) {
				if ( types.interaction.eventSupport( 'touchstart' ) === true ) {
					$c.$node().unbind( 'touchstart', this.dragHandler ) // Reset to avoid multiples when using 'overlay'
					$c.$node().bind( 'touchstart', { params : $d, caller : $c, mobile : true }, this.dragHandler );
				} else {
					$c.$node().unbind( 'mousedown', this.dragHandler ) // Reset to avoid multiples when using 'overlay'
					$c.$node().bind( 'mousedown', { params : $d, caller : $c }, this.dragHandler );
				}
			},
			
			// Mouse dragging handler sets starting positions and binds move and drop handlers
			dragHandler : function( $event ) {
				var sk = $event.shiftKey,
					d = $event.data,
					c = d.caller,
				    m = d.mobile,
					mp = c.mousePosition( $event ),
					p = ( typeof d.params === 'object' ) ? d.params : {},
					t = p.target;
				if ( !t ) t = c.fluxid();
				if ( m !== true ) $event.preventDefault();
				selection.select( sk, t.toString() );
				if ( sk === false ) {
				// Starting positions
					for ( var t = 0; t < selection.length(); t++ ) {
						selection.targetsRelativePos.x[t] = mp.x - parseInt( selection.targets(t).css( 'left' ) );
						selection.targetsRelativePos.y[t] = mp.y - parseInt( selection.targets(t).css( 'top' ) );
						selection.targets(t).trigger( 'dragged' ); // Trigger for each target with an 'onDrag'
					}
					var data = { c : c, sk : sk };
					if ( m === true ) {
						$( 'body' ).bind( 'touchmove', data, c.actions.moveHandler );
						$( 'body' ).bind( 'touchend', data, c.actions.dropHandler );
					} else {
						$( 'body' ).bind( 'mousemove', data, c.actions.moveHandler );
						$( 'body' ).bind( 'mouseup', data, c.actions.dropHandler );
					}
				}
				
				if ( $event )
					$event.stopPropagation();
				if ( window.event )
					window.event.cancelBubble = true;
			},

			// Move handler watches for drops and dispatches stage updates.
			moveHandler : function( $event ) {
				$event.preventDefault();
				var c = $event.data.c, mp = c.mousePosition( $event );
				$( 'body' ).css( 'cursor', 'move' );
				var move = c.actions.move.call( c, mp );
				if ( move === 'drop' )
					c.actions.dropHandler( $event );
				eventDispatcher.dispatch( this, 'stage.element.change' );
			},

			// Unbinds movement handlers when element is dropped
			dropHandler : function( $event ) {
				var d = $event.data, c = d.c, sk = d.sk;
				if ( sk === false ) {
					for ( var t = 0; t < selection.length(); t++ )
						selection.targets(t).fadeTo( 0, 1 );
					$( 'body' ).unbind( 'touchmove', this.moveHandler );
					$( 'body' ).unbind( 'touchstop', this.dropHandler );
					$( 'body' ).unbind( 'mousemove', this.moveHandler );
					$( 'body' ).unbind( 'mouseup', this.dropHandler );
					$( 'body' ).css( 'cursor', 'default' );
				}
				if ( $event )
					$event.stopPropagation();
				if ( window.event )
					window.event.cancelBubble = true;
				eventDispatcher.dispatch( this, 'stage.element.dropped' );
			},
			
			// Moves elements ( also should drop if mouse goes offscreen ) Arguments:
			// mouse position (relative to document or false), movement (relative to targets or undefined)
			move : function( $mp, $m ) {
				var x, y;
				if ( $mp !== false ) {
					for ( var t = 0; t < selection.length(); t++ ) {
						var c = types.display.element.getInstance( selection.targets(t) );
						c.$node().fadeTo( 0, 0.6 );
						x = $mp.x - selection.targetsRelativePos.x[t];
						y = $mp.y - selection.targetsRelativePos.y[t];
						if ( !isNaN( x ) ) c.x( x, 1 );
						if ( !isNaN( y ) ) c.y( y, 1 );
					}
				} else if ( $m )
					for ( var t = 0; t < selection.length(); t++ ) {
						var c = types.display.element.getInstance( selection.targets(t) );
						x = parseInt( selection.targets(t).css( 'left' ) ) + $m.x;
						y = parseInt( selection.targets(t).css( 'top' ) ) + $m.y;
						if ( !isNaN( x ) ) c.x( x, 1 );
						if ( !isNaN( y ) ) c.y( y, 1 );
					}
			},

			stopPropogation : function( e ) {
				if ( e ) {
					e.stopPropagation();
					e.preventDefault();
				}
				if ( window.event )
					window.event.cancelBubble = true;
			},
			
			/**
			 * Key handlers
			 **/
			initKeys: function() {
				var i = this;
				$(window).keydown( function( e ) { if ( i.keyDown( e ) ) i.stopPropogation( e ); } );
				$(window).keyup( function( e ) { if ( i.keyUp( e ) ) i.stopPropogation( e ); } );
			},
			
			bindKey: function( key, ev ) {
				this.keymap[key] = ev;
			},
			
			unbindKey: function( key ) {
				this.keymap[key] = null;
				this.released[ this.keymap[key] ] = true;
			},
	
			isPressed: function( ev ) {
				return this.pressed[ev];
			},
			
			hasReleased: function( ev ) {
				return this.released[ev];
			},
			
			hasShiftPressed: function( ev ) {
				return this.shiftpressed[ev];
			},
			
			hasCtrlPressed: function( ev ) {
				return this.ctrlpressed[ev];
			},

			clearKeys: function() {
				for( var ev in this.released ) {
					this.keyEvent[ev] = false;
					this.toggled[ev] = false;
				}
				this.released = {};
				this.pressed = {};
				this.shiftpressed = {};
				this.ctrlpressed = {};
			},

			// Sets keydown event behaviour according to context.
			keyDown: function( e ) {
				if ( e.target.type == 'text' || e.target.type == 'password' || e.target.type == 'textarea' || e.type != 'keydown' ) return;
				var ev = this.keymap[e.keyCode];
				if ( !!ev ) {
					this.keyEvent[ev] = true;
					if ( !this.toggled[ev] ) {
						this.pressed[ev] = true;
						this.toggled[ev] = true;
						if ( e.shiftKey ) this.shiftpressed[ev] = true;
						if ( e.ctrlKey ) this.ctrlpressed[ev] = true;
					}
					this.stopPropogation();
					eventDispatcher.dispatch( this, 'events.keys.press', ev, e.shiftKey, e.ctrlKey );
				}
				return true;
			},

			// Sets keyup event behaviour according to context.
			keyUp: function( e ) {
				if ( e.target.type == 'text' || e.target.type == 'password' || e.type == 'keyup' ) return;
				var ev = this.keyEvent[e.keyCode];
				if( !!ev ) {
					this.released[ev] = true;
					this.stopPropogation();
					eventDispatcher.dispatch( this, 'events.keys.release', ev );
				}
				return true;
			}
		},
		statics : {
			/**
			 * Event support
			 * Detect browser support for events ( used to detect mobiles, among other things )
			 * Does not work for detecting 'contextMenu' in Opera as this is too convoluted
			 **/
			
			eventSupport : function( $eventName ) {
				var el = document.createElement('div');
				$eventName = 'on' + $eventName;
				var isSupported = ( $eventName in el );
				if ( !isSupported ) {
					el.setAttribute( $eventName, 'return;' );
					isSupported = typeof el[$eventName] === 'function';
				}
				el = null;
				return isSupported;
			},
			
			keys : {
				'BACKSPACE': 8,
				'TAB': 9,
				'ENTER': 13,
				'SHIFT': 16,
				'CTRL': 17,
				'ALT': 18,
				'PAUSE': 19,
				'CAPS': 20,
				'ESC': 27,
				'SPACE': 32,
				'PAGE_UP': 33,
				'PAGE_DOWN': 34,
				'END': 35,
				'HOME': 36,
				'LEFT_ARROW': 37,
				'UP_ARROW': 38,
				'RIGHT_ARROW': 39,
				'DOWN_ARROW': 40,
				'INSERT': 45,
				'DELETE': 46,
				'DIGITS': [
					48,
					49,
					50,
					51,
					52,
					53,
					54,
					55,
					56,
					57
				],
				'A': 65,
				'B': 66,
				'C': 67,
				'D': 68,
				'E': 69,
				'F': 70,
				'G': 71,
				'H': 72,
				'I': 73,
				'J': 74,
				'K': 75,
				'L': 76,
				'M': 77,
				'N': 78,
				'O': 79,
				'P': 80,
				'Q': 81,
				'R': 82,
				'S': 83,
				'T': 84,
				'U': 85,
				'V': 86,
				'W': 87,
				'X': 88,
				'Y': 89,
				'Z': 90,
				'NUMPAD_0': 96,
				'NUMPAD_1': 97,
				'NUMPAD_2': 98,
				'NUMPAD_3': 99,
				'NUMPAD_4': 100,
				'NUMPAD_5': 101,
				'NUMPAD_6': 102,
				'NUMPAD_7': 103,
				'NUMPAD_8': 104,
				'NUMPAD_9': 105,
				'MULTIPLY': 106,
				'ADD': 107,
				'SUBSTRACT': 109,
				'DECIMAL': 110,
				'DIVIDE': 111,
				'F1': 112,
				'F2': 113,
				'F3': 114,
				'F4': 115,
				'F5': 116,
				'F6': 117,
				'F7': 118,
				'F8': 119,
				'F9': 120,
				'F10': 121,
				'F11': 122,
				'F12': 123,
				'PLUS': 187,
				'COMMA': 188,
				'MINUS': 189,
				'PERIOD': 190
			}
		}
	} );
	
} )(jQuery,this);
