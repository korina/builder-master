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
	 * Gradient picker class
	 * Provides user interaction to pick a background color with the mouse from the properties panel. 
	 * This class also allows for a very fine grained control over the background's gradient, including direction and number of gradient points.
	 *
	 * Requires:
	 *		../display/element.js
	 *		../color.js
	 *		colorpicker.js
	 **/
	
	var clazz = $class.create( {
		namespace : 'controls.gradientpicker',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			_counter : 0,
			xOffset : 30,
			color : {
				type : 'solid',
				direction : 'top',
				colors : [
					{
						rgb : '#999999',
						opacity : 1,
						pos : 0.01
					},
					{
						rgb : '#999999',
						opacity : 1,
						pos : 0.99
					}
				]
			}
		},
		methods : {
			// In this initialising the children are being given short forms of address and are being bound with functions to update them.
			// Secondly, it is adding listeners to each binding from the JSON.
			initialise: function( $id, $descriptor ) {
				var me = this;
				this.type = this.getChildById( 'color-type' );
				this.type.$node().bind( 'change', function(e) {
					me.updateGradient();
				} );
				this.angle = this.getChildById( 'color-angle' );
				this.angle.$node().bind( 'change', function(e) {
					me.updateGradient();
				} );
				this.view = this.getChildById( 'color-viewer' );
				this.swatches = this.getChildById( 'swatch-panel' );
				this.swatches.$node().bind( 'dblclick', function(e) {
					me.addSwatch( e.pageX - me.xOffset );
					me.updateSwatches();
				} );
				var b = $descriptor.bind;
				if ( !!b )
					for ( var i in b ) {
						if ( b.hasOwnProperty( i ) ) {
							if ( !!b[i].event )
								types.events.dispatcher.getInstance().addListener( b[i].event, function( $ns, $data ) {
									if ( i == 'color' ) {
										if ( !!$data )
											me.setColor( $data, true );
									} else 
										me.$node().attr( i, $data );
								} );
						}
					}
				types.events.dispatcher.getInstance().addListener( 'events.colorpicker.update', function( ns, c, $discreet ) { me.setColor( c, !!$discreet ); } );
				this.updateSwatches();
			},
			// Add a colour swatch based on the passed values to the swatches child element.
			addSwatch: function( $x, $rgb, $opacity ) {
				var me = this;
				$opacity = $opacity || 1;
				var id = 'swatch_' + this._counter++;
				var data = { initial : { props : { width : 10, height : 10 } }, states : {} };
				var s = new types.controls.gradientswatch( id, data );
				this.swatches.addChildFromClass( s );
				s.applyStateStyles();
				s.x( $x );
				s.initialise( id, data );
				if ( !!$rgb ) s.setColor( $rgb, $opacity, false );
				s.$node().bind( 'change', function( e ) { me.updateSwatches( true ); } );
				return s;
			},
			// Setting the color to match the value passed, then dispatching an event to acknowledge this (or not, as the case may be).
			setColor: function( $color, $discreet ) {
				if ( !types.core.isColor( $color ) ) return;
				this.type.value( $color.type );
				this.angle.value( $color.direction );
				this.color = types.core.clone( $color );
				this.swatches.empty();
				for ( var i = 0; i < this.color.colors.length; i++ ) {
					var c = this.color.colors[i];
					var x = ( this.swatches.width() * c.pos );
					var s = this.addSwatch( x, c.rgb, c.opacity );
				}
				this.updateGradient( !$discreet );
			},
			// Update the swatches and the gradient, passing on the command to broadcast (or not).
			updateSwatches: function( $broadcast ) {
				var c = this.swatches.getChildren();
				this.color.colors = [];
				for ( var i = 0; i < c.length; i++ ) {
					if ( types.core.isString( c[i].color ) )
						c[i].setColor( c[i].color, true );
					if ( c[i].include == true )
						this.color.colors.push( c[i].color );
				}
				this.updateGradient( $broadcast );
			},
			// Update the gradient.
			updateGradient: function( $broadcast ) {
				var c;
				if ( this.color.colors.length < 1 ) {
					c = '';
					this.view.style( 'fill', c );
				}
				else {
					c = {
						type: 'linear',
						direction: 360,
						colors: this.color.colors
					};
					this.view.style( 'fill', c );
				}
				c.direction = this.angle.value();
				c.type = this.type.value();
				if ( $broadcast == true )
					types.events.dispatcher.getInstance().dispatch( this, 'color.gradient.update', c );
			}
		}
	} );
	
	/**
	 * Gradient swatch class
	 * Swatches for use in the gradient picker.
	 *
	 * Requires:
	 *		../display/element.js
	 *		../color.js
	 *		colorpicker.js
	 *		gradientpicker.js
	 **/
	
	var clazb = $class.create( {
		namespace : 'controls.gradientswatch',
		inherits : types.controls.colorpicker,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			include : true // used to remove the swatch from the gradient
		},
		props : {
			width : 10,
			height : 10
		},
		methods : {
			// Initialise includes support for touchscreen as well as mouse based event bindings for drag and drop.
			initialise : function( $id, $descriptor ) {
				clazb.Super.initialise.call( this, $id, $descriptor );
				var me = this;
				if ( types.interaction.eventSupport( 'touchstart' ) === true ) {
					this.$node().bind( 'touchstart', function(e) { me.selected = true; me.btnDrag(e); } );
					$(document).bind( 'touchend', function(e) { if ( me.selected ) me.btnDrop(e); me.selected = false; } );
				} else {
					this.$node().bind( 'mousedown', function(e) { me.selected = true; me.btnDrag(e); } );
					$(document).bind( 'mouseup', function(e) { if ( me.selected ) me.btnDrop(e); me.selected = false; } );
				}
			},
			setColor : function( c, o ) {
				if ( isNaN( o ) ) o = 1;
				if ( types.core.isColor( c ) )
					c = c.colors[0].rgb;
				var color = this.makeColor( c );
				color.opacity = o;
				this.getChildAt( 1 ).style( 'fill', { type: 'solid', colors: [ color ] } );
				this.color = color;
				//this.$node().trigger('change');
			},
			makeColor: function( c ) {
				return { rgb: c, pos: ( this.x() + ( this.width() / 2 ) ) / this.parent().width() };
			},
			pickerData: function() {
				var me = this;
				return {
					color: '#0000ff',
					onShow: function (colpkr) {
						if ( me.preventClick == true ) {
							me.preventClick = false;
							return false;
						}
						var c = me;
						$(colpkr).fadeIn(500);
						$(colpkr).ColorPickerSetColor( c.color, c.opacity );
						return false;
					},
					onHide: function (colpkr) {
						$(colpkr).fadeOut(500);
						return false;
					},
					onChange: function (hsb, hex, rgb) {
						var c = me;
						c.color = me.makeColor( '#' + hex.substr( 0, 6 ) );
						c.color.opacity = c.opacity = rgb.a / 255;
						c.getChildAt( 1 ).style( 'fill', { type: 'solid', colors: [ c.color ] } );
						c.$node().trigger('change');
					}
				}
			},
			// Button drag
			btnDrag : function( e ) {
				if ( e == null ) 
					e = window.event;

				//var t = e.target != null ? e.target : e.srcElement;
				var me = this;
				me.startX = me.x();
				me.startY = e.clientY;
				document.onmousemove = function(e) { me.btnMove(e); };

				document.body.focus();
				document.onselectstart = function () { return false; };
				this.$node().ondragstart = function() { return false; };

				return false;
			},
			// Button drop
			btnDrop : function( e ) {
				document.onmousemove = null;
				document.onselectstart = null;
				this.color.pos = this.x() / this.parent().width();
				this.$node().trigger('change');
				if ( this.startX != this.x() )
					this.preventClick = true;
				if ( this.include == false )
					this.remove();
			},
			// Button move
			btnMove : function( e ) {
				var c = types.display.element.getInstance( this.$node() ),
					x = e.clientX - 30;
				c.x( x );
				this.visible( this.include = ( e.clientY - this.startY < 50 ) );
				this.color.pos = x / this.parent().width();
				this.$node().trigger('change');
			},
			stopPropogation : function( e ) {
				if ( e )
					e.stopPropagation();
				if ( window.event )
					window.event.cancelBubble = true;
			}
		}
	} );
	
} )(jQuery,this);
