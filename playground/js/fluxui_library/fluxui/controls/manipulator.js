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
	 * Manipulator class
	 * The manipulator is the stage element used to select and thereafter modify target elements from the composition. 
	 *
	 * Requires:
	 *		../display/element.js
	 **/
	
	var clazz = $class.create( {
		namespace : 'controls.manipulator',
		inherits : types.display.element,
		constructor : function( $id, $decorator ) {
			clazz.Super.constructor.call( this, $id, $decorator );
		},
		methods : {
			initialise : function() {
				var me = this;
				eventDispatcher.addListener( 'stage.element.selected', function( $ns, $prev, $cur, $e ) {
					if ( !!$cur ) {
						me.attach( $cur, $e );
						me.applyAttributes( me.states.initial.attr );
					} else {
						me.remove();
					}
					types.controls.manipulator.child = $cur;
				} );
				this.style( 'border', 'solid 1px #333333' );
				this.style( 'overflow', 'visible' );
				this.remove();

				// Create the eight resize buttons.
				var s = types.controls.manipulator.hndWidth;
				var btnState = {
					type : 'element',
					initial : {
						props : {
							background : '#ffffff',
							width : s,
							height : s
						}
					}
				};
				this.$node().bind( 'click', this.stopPropogation );
				this.$node().bind( 'dblclick', function( $evt ) {
					me.doubleClick( $evt );
				} );
				// Add overlay handles.
				for ( var i = 0; i < 8; i++ ) {
					var btn = new types.display.element( 'handle_' + i, btnState );
					btn.applyStateStyles();
					btn.style( 'border', 'solid 1px #333333' );
					if ( i == 0 || i >= 6 )
						btn.style( 'left', -( s / 2 ) );
					else if ( i >= 2 && i <= 4 ) {
						btn.style( 'right', -( s / 2 ) )
						btn.removeStyle( 'left' );
					} else {
						btn.style( 'left', '50%' );
						btn.style( 'margin-left', -(s/2) );
					}
					if ( i <= 2 )
						btn.style( 'top', -( s / 2 ) );
					else if ( i >= 4 && i <= 6 ) {
						btn.style( 'bottom', -( s / 2 ) )
						btn.removeStyle( 'top' );
					} else {
						btn.style( 'top',  '50%' );
						btn.style( 'margin-top', -(s/2) );
					}
					// Attach drag functionality to both mobile and desktop interaction events.
					btn.$node().bind( 'click', this.stopPropogation );
					if ( types.interaction.eventSupport( 'touchstart' ) === true ) {
						btn.$node().bind( 'touchstart', this.btnDrag );
						$(document).bind( 'touchend', this.btnDrop );
					} else {
						btn.$node().bind( 'mousedown', this.btnDrag );
						$(document).bind( 'mouseup', this.btnDrop );
					}
					this.addChild( btn.node );
					btn.applyStateAttributes();
				}
				
			},
			stopPropogation : function( e ) {
				if ( e )
					e.stopPropagation();
				if ( window.event )
					window.event.cancelBubble = true;
			},
			// Go one level deeper into the composition (see breadcrumb class).
			doubleClick : function( $evt ) {
				if ( selection.length() != 2 ) return this.stopPropogation( $evt );
				var c, j;
				for ( var i = 0; i < selection.length(); i++ ) {
					j = types.display.element.getInstance( selection.targets()[i] );
					if ( !!j.fluxid && j.fluxid() != 'overlay' )
						c = j;
				}
				if ( !c ) return;
				eventDispatcher._dispatch( 'events.element.open', c );
				this.stopPropogation( $evt );
			},
			// If the shift key is depressed then add an element to the targets list, else set that element as the only target.
			attach : function( $child, $e ) {
				if ( $e.shiftKey === false )
					this.remove();
				var c = types.display.element.getInstance( $child );
				selection.add( c.fluxid() );
				for ( i = 0; i < 8; i++ )
					this.getChildById( 'handle_' + i ).$node().toggle( selection.length() == 1 );
				this.update();
			},
			// Update the manipulator to reflect its targets.
			update : function() {
				var d = this.getDimentions();
				if ( !!d ) {
					this.width( d.w - d.l )
					this.height( d.h - d.t );
					this.x( d.l );
					this.y( d.t )
				}
			},
			// Returns the outer bounds of the collection of targets as an object.
			getDimentions : function() {
				var i, b, tl, tt, t = 9999, l = 9999, w = 0, h = 0, e;
				var j = selection.targets();
				if ( !!j ) {
					for ( i = 0; i < j.length; i++ ) {
						if ( j[i].attr( 'fluxid' ) !== 'overlay' ) {
							b = tl = parseInt( j[i].css( 'left' ) );
							if ( !isNaN( b ) && b < l ) l = b;
							b = tt = parseInt( j[i].css( 'top' ) );
							if ( !isNaN( b ) && b < t ) t = b;
							b = tl + j[i].outerWidth();
							if ( !isNaN( b ) && b > w ) w = b;
							b = tt + j[i].outerHeight();
							if ( !isNaN( b ) && b > h ) h = b;
						}
					}
					return { l : l, t : t, w : w, h : h };
				}
			},
			// Removes the manipulator from the stage.
			remove : function() {
				selection.clear();
				this.rect( { x : -9999, y : -9999, w : 10, h : 10 } );
				types.controls.manipulator.child = null;
			},
			// Button drag prepares a button (corner or edge) of the manipulator to be moved, setting th initial values for that move.
			btnDrag : function( e ) {
				var i = types.controls.manipulator.getInstance();
	
				if ( e == null ) 
					e = window.event; 
	
				var t = e.target != null ? e.target : e.srcElement;
				
				var hnd = $(t).attr('fluxid');
				if ( hnd.indexOf( 'handle_' ) == -1 ) return;
				var id = parseInt( hnd.split( 'handle_' ).join('') );
				var posX = 0, posY = 0;
				var s = types.controls.manipulator.hndWidth;
				
				if ( id >= 2 && id <= 4 )
					posX = i.$node().width();
				else if ( id == 1 || id == 5 )
					posX = i.$node().width() / 2;
				if ( id >= 4 && id <= 6 )
					posY = i.$node().height();
				else if ( id == 3 || id == 7 )
					posY = i.$node().height() / 2;
				
				i.selectedHndId = id;
				i._w = i.$node().width();
				i._h = i.$node().height();
				i._lo = parseInt( i.$node().offset().left );
				i._to = parseInt( i.$node().offset().top );
				i._l = parseInt( i.$node().css( 'left' ) );
				i._t = parseInt( i.$node().css( 'top' ) );
				i.dragElement = t;

				document.onmousemove = i.btnMove;

				document.body.focus();
				document.onselectstart = function () { return false; };
				t.ondragstart = function() { return false; };

				return false;
			},
			// Sets the button (corner or edge) in its new position.
			btnDrop : function( e ) {
				var i = types.controls.manipulator.getInstance();
				if ( i.dragElement != null ) {
					document.onmousemove = null;
					document.onselectstart = null;
					i.dragElement.ondragstart = null;
			
					i.dragElement = i.selectedHndId = i._h = i._w = i._l = i._t = i._lo = i._to = null;
					eventDispatcher.dispatch( i, 'stage.element.change' );
				}
			},
			// Moves a button (corner or edge) of the manipulator.
			btnMove : function( e ) {
				var i = types.controls.manipulator.getInstance(),
					j = types.display.element.getInstance( $(selection.targets(0)) ),
					me = i.$node(),
					id = i.selectedHndId,
					w = null,
					b = parseInt( j.$node().css( 'border-left-width' ) ) * 2;
				if ( e == null ) 
					var e = window.event;
				
				if ( id >= 4 && id <= 6 ) {
					var l = e.clientY - i._to;
					if ( e.shiftKey === true ) {
						me.width( i._w + ( l - i._h ) );
						j.width( i._w + ( l - i._h ) - b, 1 );
					}
					me.height( l );
					j.height( l - b, 1 );
				}
				else if ( id >= 0 && id <= 2 ) {
					var $y = e.clientY,
						t = { 'top' : $y - ( i._to - i._t ) },
						h = ( i._to + i._h ) - $y;
					me.css( t );
					j.y( t.top, 1 );
					me.height( h );
					j.height( h - b, 1 );
				}
				if ( id >= 2 && id <= 4 ) {
					w = e.clientX - i._lo;
					if ( e.shiftKey === true ) {
						me.height( i._h + ( w - i._w ) );
						j.height( i._h + ( w - i._w ) - b, 1 );
					}
					me.width( w );
					j.width( w -b, 1 );
				}
				else if ( id == 0 || id >= 6 ) {
					var $x = e.clientX,
						l = { 'left' : $x - ( i._lo - i._l ) }
						w = ( i._lo + i._w ) - $x;
					
					me.css( l );
					j.x( l.left, 1 );
					me.width( w );
					j.width( w - b, 1 );
				}
			},
			getChildIds : function() {
				return [];
			},
			getChildren : function() {
				return [];
			}
		},
		statics : {
			child : null,
			hndWidth : 10,
			getInstance : function( $id, $descriptor ) {
				var _ = types.controls.manipulator
				if ( !_._inst ) _._inst = new _( $id, $descriptor );
				return _._inst;
			}
		}
	} );
	
} )(jQuery,this);
