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
	 * The manipulator is the stage element used to select and thereafter modify
	 * target elements from the composition. 
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
					if ( i <= 2 ) btn.style( 'top', -( s / 2 ) );
					else if ( i >= 4 && i <= 6 ) {
						btn.style( 'bottom', -( s / 2 ) )
						btn.removeStyle( 'top' );
					} else {
						btn.style( 'top', '50%' );
						btn.style( 'margin-top', -(s/2) );
					}
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
			bindEvents : function() {
				var me = this;
				this.addListener( 'stage.element.selected', function( $ns, $prev, $cur, $e ) {
					if ( !!$cur ) {
						me.attach( $cur, $e );
						me.applyAttributes( me.states.initial.attr );
					} else me.remove();
					types.controls.manipulator.child = $cur;
				} );
				this.addListener( 'events.manipulator.click', function( $ns, $x, $y ) {
					me.lookUnder( $x, $y );
				} );
				clazz.Super.bindEvents.apply( this, Array.prototype.slice.call( arguments ) );
			},
			stopPropogation : function( e ) {
				if ( e ) e.stopPropagation();
				if ( window.event ) window.event.cancelBubble = true;
			},
			// Go one level deeper into the composition (see breadcrumb class).
			doubleClick : function( $evt ) {
				if ( selection.length() != 2 ) return this.stopPropogation( $evt );
				var i, c, j;
				for ( i = 0; i < selection.length(); i++ ) {
					j = types.display.element.getInstance( selection.targets()[i] );
					if ( !!j.fluxid && j.fluxid() != 'overlay' ) c = j;
				}
				if ( !c ) return;
				this.dispatch( 'events.element.open', c );
				this.stopPropogation( $evt );
			},
			// If the shift key is depressed then add an element to the targets
			// list, else set that element as the only target.
			attach : function( $child, $e ) {
				if ( $e.shiftKey === false ) this.remove();
				var c = types.display.element.getInstance( $child );
				selection.add( c.fluxid() );
				this.reset();
			},
			// Merge this method with update now we have multiadjust.
			reset : function() {
				for ( var i = 0; i < 8; i++ ) {
					this.getChildById( 'handle_' + i ).$node().toggle( true );
				}
				this.update();
			},
			// Update the manipulator to reflect its targets.
			update : function() {
				var i,
					d = this.getDimentions(),
					t = selection.sansTarget( 'overlay' );
				if ( !!d ) {
					this.width( d.w - d.l )
					this.height( d.h - d.t );
					this.x( d.l );
					this.y( d.t )
				}
			},
			// Looks for elements under the manipulator element that the user is trying
			// to select, ignoring cases where a current target is already under the mouse.
			lookUnder : function( $x, $y ) {
				var i, t = [], pos = [], matchingElement, underneith;
				for ( i = 0; i < selection.targets().length; i++ ) {
					t.push( selection.targets()[i][0] );
				}
				underneith = this.comparePosition( t, $x, $y, 'overlay' );
				if ( underneith == false ) {
					matchingElement = this.comparePosition(
						$( '[fluxid=stage]' ).children(), $x, $y, 'overlay' 
					);
					if ( matchingElement != false) {
						selection.add( $( matchingElement ).attr( 'fluxid' ) );
					}
				} else selection.remove( $(underneith ).attr( 'fluxid' ) );
				this.reset();
			},
			// Compare a list of elements positions with a stated position.
			comparePosition : function( $j, $x, $y, $ignore ) {
				var i, pos = [],
					s = 1 / ( ( types.editor ) ? types.editor.getInstance().stageScale : 1 ),
					$x = $x * s, $y = $y * s;
				for ( i = $j.length - 1; i >= 0; i-- ) {
					if ( $( $j[i] ).attr( 'fluxid' ) != $ignore ) {
						pos = this.truePosition( $j[i] );
						if ( 
							$x > pos[0] && $x < ( pos[0] + $( $j[i] ).outerWidth() ) && 
							$y > pos[1] && $y < ( pos[1] + $( $j[i] ).outerHeight() ) 
						) return $j[i];
					}
				}
				return false;
			},
			// Returns the outer bounds of the collection of targets as an object.
			getDimentions : function() {
				var i, b, tl, tt, e,
					t = 9999, l = 9999, w = -9999, h = -9999,
					j = selection.targets();
				if ( !!j ) {
					for ( i = 0; i < j.length; i++ ) {
						var s = j[i].attr( 'fluxid' );
						if ( s !== 'overlay' && s !== 'stage-container' ) {
							c = types.display.element.getInstance( j[i] );
							b = tl = c.x();
							if ( !isNaN( b ) && b < l ) l = b;
							b = tt = c.y();
							if ( !isNaN( b ) && b < t ) t = b;
							b = tl + c.$node().outerWidth();
							if ( !isNaN( b ) && b > w ) w = b;
							b = tt + c.$node().outerHeight();
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
			// Button drag prepares a button (corner or edge) of the manipulator
			// to be moved, setting the initial values for that move.
			btnDrag : function( e ) {
				if ( e == null ) e = window.event; 
				var i = types.controls.manipulator.getInstance(),
					t = e.target != null ? e.target : e.srcElement,
					hnd = $(t).attr('fluxid');
				if ( hnd.indexOf( 'handle_' ) == -1 ) return;
				var id = parseInt( hnd.split( 'handle_' ).join('') );
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
					i.dragElement = i.selectedHndId = 
						i._h = i._w = i._l = i._t = i._lo = i._to = null;
					i.dispatch( 'stage.element.change' );
					i.reset();
				}
			},
			// Moves a button (corner or edge) of the manipulator, adjusting the 
			// positioning and dimentions of all selected elements, scaling
			// elements according to their size and position inside the manipulator
			// and --- if the shift key is held --- to scale individually.
			// Consider breaking into two methods.
			btnMove : function( e ) {
				var ii, w, h, x, y, jw, jh, jx, jy, dim = {},
					i = types.controls.manipulator.getInstance(),
					ei = types.display.element.getInstance,
					e = ( e != null ) ? e : window.event,
					t = selection.sansTarget( 'overlay' ),
					id = i.selectedHndId,
					s = 1 / ( ( types.editor ) ? types.editor.getInstance().stageScale : 1 ),
					b = 2; // Accounting for the manipulator border
				var set = {
					width : function( $w, $matchH ) {
						w = ( !!$w ) ? $w : ( !!$matchH ) ? 
							i.width() * ( $matchH / i.height() ) : ( e.clientX - i._lo ) * s;
						for ( ii = 0; ii < t.length; ii++ ) {
							j = ei( $( t[ii] ) );
							jw = ( w + b ) * ( j.width() / ( i.width() + b ) );
							if ( jw < w + 3 && jw > w - 3 && !$matchH ) j.width( w, 1 );
							else if ( jw < 4 ) j.width( 4, 1 );
							else j.width( jw, 1 );
						}
						return { x : i.x(), w : ( w > 3 ) ? w : 4 };
					}, height : function( $h, $matchW ) {
						h = ( !!$h ) ? $h : ( !!$matchW ) ? 
							i.height() * ( $matchW / i.width() ) : ( e.clientY - i._to ) * s;
						for ( ii = 0; ii < t.length; ii++ ) {
							j = ei( $( t[ii] ) );
							jh = ( h + b ) * ( j.height() / ( i.height() + b ) );
							if ( jh < h + 3 && jh > h - 3 && !$matchW ) j.height( h, 1 );
							else if ( jh < 4 ) j.height( 4, 1 );
							else j.height( jh, 1 );
						}
						return { y : i.y(), h : ( h > 3 ) ? h : 4 };
					}, x : function( $x, $w ) {
						x = ( !!$x ) ? $x : e.clientX * s - ( i._lo * s - i._l )
						w = ( !!$w ) ? $w : ( i._lo * s + i._w ) - ( e.clientX * s ) + b;
						for ( ii = 0; ii < t.length; ii++ ) {
							j = ei( $( t[ii] ) );
							jx = x + ( ( ( j.x() - i.x() ) / i.width() ) * w );
							if ( jx < x + 4 && jx > x - 3 ) j.x( x, 1 );
							else if (
								jx + j.width() < i.x() + i.width() + 3 && 
								jx + j.width() > i.x() + i.width() - 3
							) j.x( ( i.x() + i.width() ) - j.width(), 1 )
							else j.x( jx, 1 );
						}
						return { x : x, w : w };
					}, y : function( $y, $h ) {
						y = ( !!$y ) ? $y : e.clientY * s - ( i._to * s - i._t )
						h = ( !!$h ) ? $h : ( i._to * s + i._h ) - ( e.clientY * s ) + b;
						for ( ii = 0; ii < t.length; ii++ ) {
							j = ei( $( t[ii] ) );
							jy = y + ( ( ( j.y() - i.y() ) / i.height() ) * h );
							if ( jy < y + 4 && jy > y - 3 ) j.y( y, 1 );
							else if (
								jy + j.height() < i.y() + i.height() + 3 && 
								jy + j.height() > i.y() + i.height() - 3
							) j.y( ( i.y() + i.height() ) - j.height(), 1 )
							else j.y( jy, 1 );
						}
						return { y : y, h : h };
					}, yThenHeight : function() {
						dim = set.y();
						dim.h = set.height( dim.h ).h;
						i.y( dim.y );
						i.height( dim.h );
					}, heightThenY : function() {
						dim = set.height();
						dim.y = set.y( dim.y, dim.h ).y;
						i.y( dim.y );
						i.height( dim.h );
					}
				}
				// Representing buttons, advancing clockwise from the top right.
				if ( id == 0 ) {
					dim = set.x();
					dim.w = set.width( dim.w ).w;
					if ( e.shiftKey == true ) set.height( null, dim.w );
					i.x( dim.x );
					i.width( dim.w );
					if ( e.shiftKey == false ) set.yThenHeight();
				} else if ( id == 1 ) {
					dim = set.y();
					dim.h = set.height( dim.h ).h;
					if ( e.shiftKey == true ) set.width( null, dim.h );
					i.y( dim.y );
					i.height( dim.h );
				} else if ( id == 2 ) {
					dim = set.width();
					set.x( dim.x, dim.w );
					if ( e.shiftKey == true ) set.height( null, dim.w );
					i.width( dim.w );
					if ( e.shiftKey == false ) set.yThenHeight();
				} else if ( id == 3 ) {
					dim = set.width();
					set.x( dim.x, dim.w );
					if ( e.shiftKey == true ) set.height( null, dim.w );
					i.width( dim.w );
				} else if ( id == 4 ) {
					dim = set.width();
					set.x( dim.x, dim.w );
					if ( e.shiftKey == true ) set.height( null, dim.w );
					i.width( dim.w );
					if ( e.shiftKey == false ) set.heightThenY();
				} else if ( id == 5 ) {
					dim = set.height();
					set.y( dim.y, dim.h );
					if ( e.shiftKey == true ) set.width( null, dim.h );
					i.height( dim.h );
				} else if ( id == 6 ) {
					dim = set.x();
					dim.w = set.width( dim.w ).w;
					if ( e.shiftKey == true ) set.height( null, dim.w );
					i.x( dim.x );
					i.width( dim.w );
					if ( e.shiftKey == false ) set.heightThenY();
				} else if ( id == 7 ) {
					dim = set.x();
					dim.w = set.width( dim.w ).w;
					if ( e.shiftKey == true ) set.height( null, dim.w );
					i.x( dim.x );
					i.width( dim.w );
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
