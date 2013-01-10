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
	 * Colorpicker class
	 * Provides user interaction to pick a background color with the mouse from the properties panel. 
	 *
	 * Requires:
	 *		../display/element.js
	 *		../color.js
	 **/
	
	var clazz = $class.create( {
		namespace : 'controls.colorpicker',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			// force availability of the change event
			this.$node().bind( 'change', function(){} );
			// now it's safe to call extended class
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields: {
			color: '#999999',
			opacity: 1,
			allowGradient: false
		},
		props: {
			width: 20,
			height: 20
		},
		methods: {
			initialise : function( $id, $descriptor ) {
				var me = this;
				// Adding a transparent background image.
				this.bg = new types.display.image( $id + '_bg', {
					initial : {
						props : {
							width : me.width(),
							height : me.height()
						},
						attr : {
							src : 'alpha-bg'
						}
					}
				} );
				me.addChildFromClass( this.bg );
				this.bg.applyStateStyles();
				this.bg.applyStateAttributes();
				// Adding the colour swatch.
				this.swatch = new types.display.element( $id + '_swatch', { 
					initial : {
						props : {
							width : me.width(),
							height : me.height(),
							fill : { 
								type : 'solid',
								colors : [ { rgb : '#999999' } ]
							}
						}
					}
				} );
				me.addChildFromClass( this.swatch );
				this.swatch.applyStateStyles();
				me.$node().ColorPicker( this.pickerData() );
				if ( !!$descriptor.initial ) {
					var a = $descriptor.initial.attr;
					if ( !!a )
						this.allowGradient = a.allowGradient == true;
				}
				types.events.dispatcher.getInstance().addListeners( { 
					'stage.element.selected' : function() { 
						me.$node().ColorPicker().ColorPickerHide() 
					}
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
			},
			pickerData: function() {
				var me = this;
				return {
					color: '#0000ff',
					onShow: function (colpkr) {
						var c = types.controls.colorpicker.current( me );
						$(colpkr).fadeIn(500);
						$(colpkr).ColorPickerSetColor( c.color, c.opacity );
						return false;
					},
					onHide: function (colpkr) {
						$(colpkr).fadeOut(500);
						return false;
					},
					onChange: function (hsb, hex, rgb) {
						var c = types.controls.colorpicker.current( me );
						c.color = '#' + hex.substr( 0, 6 );
						c.opacity = rgb.a / 255;
						c.getChildAt( 1 ).style( 'fill', {
							type: 'solid',
							colors: [ { rgb: c.color, opacity: c.opacity } ]
						} );
						c.$node().trigger('change');
					}
				}
			},
			// Setting the color to match the value passed, then dispatching an event to acknowledge this (or not, as the case may be).
			setColor : function( color, $discreet ) {
				color = this.color = ( !types.core.isColor( color ) )
					? { type: 'solid', colors: [ { rgb: color } ] }
					: types.core.clone( color );
				
				this.swatch.style( 'fill', color );
				var c = color.colors;
				if ( !!c[0].opacity )
					this.setOpacity( c[0].opacity );
				else
					this.setOpacity( 1 );
				
				if ( !$discreet )
					this.$node().trigger('change');
				else if ( this.allowGradient == true && types.controls.colorpicker._current == this )
					types.events.dispatcher.getInstance().dispatch( this, 'events.colorpicker.update', color, true );
			},
			// Setting opacity value to match that passed.
			setOpacity : function( opacity ) {
				if ( isNaN( opacity ) ) return;
				this.opacity = opacity;
			}
		},
		statics: {
			_current: null,
			current: function( cp ) {
				var c = types.controls.colorpicker;
				if ( !!cp )
					c._current = cp;
				return c._current;
			}
		}
	} );
	
} )(jQuery,this);
