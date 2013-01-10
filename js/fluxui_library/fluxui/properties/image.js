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
	var eventDispatcher = types.events.dispatcher.getInstance();
		
	var props = {
		type: 'properties.image',
		initial: {
			props: {
				fill: {
					type: 'linear',
					direction: 'top',
					colors: [
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0
						},
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0.295
						},
						{
							rgb: '#000000',
							opacity: 1,
							pos: 0.295
						},
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0.30
						},
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0.715
						},
						{
							rgb: '#000000',
							opacity: 1,
							pos: 0.72
						},
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0.725
						}

					]
				},
				position: 'relative',
				width: 300,
				height: 215
			}
		},
		children: {
			keys: [ 'left', 'left-label', 'top', 'top-label', 'width', 'width-label', 'height', 'height-label', 'reset-asset', 'reset-asset-label', 'border-width', 'border-width-label', 'border-color', 'border-color-label', 'border-radius', 'border-radius-label', 'src-label', 'src', 'placeholder-asset-label', 'placeholder-asset', 'id', 'id-label', 'class', 'class-label', 'flux-id', 'flux-id-label' ],
			hash: {
				left: {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 10,
							width: 50
						}
					},
					bind: {
						text: {
							event: 'events.display.image.left.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.image.left'
						},
						keyup: {
							event: 'properties.image.left'
						}
					}
				},
				'left-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 70,
							top: 10,
							width: 20
						},
						attr: {
							text: 'x'
						}
					}
				},
				top: {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 40,
							width: 50
						}
					},
					bind: {
						text: {
							event: 'events.display.image.top.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.image.top'
						},
						keyup: {
							event: 'properties.image.top'
						}
					}
				},
				'top-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 70,
							top: 40,
							width: 20
						},
						attr: {
							text: 'y'	
						}
					}
				},
				width: {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 100,
							top: 10,
							width: 50
						}
					},
					bind: {
						text: {
							event: 'events.display.image.width.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.image.width'
						},
						keyup: {
							event: 'properties.image.width'
						}
					}
				},
				'width-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 160,
							top: 10,
							width: 20
						},
						attr: {
							text: 'w'
						}
					}
				},
				height: {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 100,
							top: 40,
							width: 50
						}
					},
					bind: {
						text: {
							event: 'events.display.image.height.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.image.height'
						},
						keyup: {
							event: 'properties.image.height'
						}
					}
				},
				'height-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 160,
							top: 40,
							width: 20
						},
						attr: {
							text: 'h'
						}
					}
				},
				'placeholder-asset': {
					type: 'display.image',
					initial: {
						props: {
							left: 190,
							top: 10,
							width: 16,
							cursor: 'pointer'
						},
						attr: {
							src: 'btn-placeholder-asset'
						}
					},
					behavior: {
						click: {
							event: 'properties.image.placeholder'
						}
					}
				},
				'placeholder-asset-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 210,
							top: 10,
							width: 70
						},
						attr: {
							text: 'placeholder'
						}
					}
				},
				'reset-asset': {
					type: 'display.image',
					initial: {
						props: {
							left: 190,
							top: 40,
							width: 16,
							cursor: 'pointer'
						},
						attr: {
							src: 'btn-reset-asset'
						}
					},
					behavior: {
						click: {
							event: 'properties.image.reset-asset'
						}
					}
				},
				'reset-asset-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 210,
							top: 40,
							width: 60
						},
						attr: {
							text: 'reset size'
						}
					}
				},
				'border-color': {
					type: 'controls.colorpicker',
					initial: {
						props: {
							left: 185,
							top: 68
						}
					},
					bind: {
						color: {
							event: 'events.display.image.border-color.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.image.border-color'
						},
						click: {
							event: 'color.request'
						}
					}
				},
				'border-color-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 210,
							top: 70
						},
						attr: {
							text: 'border color'
						}
					}
				},
				'border-width': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 70,
							width: 50
						}
					},
					bind: {
						text: {
							event: 'events.display.image.border-width.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.image.border-width'
						},
						keyup: {
							event: 'properties.image.border-width'
						}
					}
				},
				'border-width-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 70,
							top: 70
						},
						attr: {
							text: 'border weight'
						}
					}
				},
				'border-radius-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 70,
							top: 100
						},
						attr: {
							text: 'border radius'
						}
					}
				},
				'border-radius': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 100,
							width: 50
						}
					},
					bind: {
						text: {
							event: 'events.display.image.border-radius.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.image.border-radius'
						},
						keyup: {
							event: 'properties.image.border-radius'
						}
					}
				},
				'src-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 130,
							width: 60
						},
						attr: {
							text: 'source'
						}
					}
				},
				'src': {
					type: 'display.form.dropdown',
					initial: {
						props: {
							left: 10,
							top: 130,
							width: 200
						}
					},
					bind: {
						text: {
							event: 'events.display.image.src.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.image.src'
						},
						keyup: {
							event: 'properties.image.src'
						}
					}
				},
				'id': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 160,
							width: 80
						}
					},
					bind: {
						text: {
							event: 'events.display.image.id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.image.id'
						},
						keyup: {
							event: 'properties.image.id'
						}
					}
				},
				'id-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 100,
							top: 160,
							width: 20
						},
						attr: {
							text: 'id'
						}
					}
				},
				'class': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 130,
							top: 160,
							width: 80
						}
					},
					bind: {
						text: {
							event: 'events.display.image.class.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.image.class'
						},
						keyup: {
							event: 'properties.image.class'
						}
					}
				},
				'class-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 160,
							width: 40
						},
						attr: {
							text: 'class'
						}
					}
				},
				'flux-id': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 190,
							width: 200
						}
					},
					bind: {
						text: {
							event: 'events.display.image.flux-id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.image.flux-id'
						},
						keyup: {
							event: 'properties.image.flux-id'
						}
					}
				},
				'flux-id-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 190,
							width: 40
						},
						attr: {
							text: 'flux id'
						}
					}
				}
			}
		}
	}
	 
	/**
	 * Image property class
	 * Provides functionality for the image element in the property panel.
	 *
	 * Requires:
	 *		propsheet.js
	 *		../controls/properties.js
	 **/
	 
	var clazz = $.fn.fluxui.$class.create( {
		namespace : 'properties.image',
		inherits : types.properties.propsheet,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			ens : 'display.image'
		},
		methods : {
			bindEvents : function() {
				var me = this;
				this.addListener( 'properties.image.*', function( $ns, $evt ) {
					me.handlePropertyChange( $($evt.target) );
				} );
				clazz.Super.bindEvents.apply( this, Array.prototype.slice.call( arguments ) );
			},
			// Update property field for the SRC value of the image.
			updatePropertyFields : function( $cls, $prefix ) {
				var d = eventDispatcher;
				var s = $cls.src(), fnd = false;
				for ( var u in assets )
					if ( assets.hasOwnProperty( u ) ) {
						if ( assets[u].url == s ) {
							d.dispatch( this, $prefix + '.src.changed', u );
							fnd = true;
							break;
						}
					}
				if ( fnd == false ) d.dispatch( this, $prefix + '.src.changed', '' )
				clazz.Super.updatePropertyFields.call( this, $cls, $prefix );
			},
			update : function() {
				types.controls.colorpicker.current( this.getChildById( 'border-color' ) );
			}
		},
		statics : {
			create : function() {
				var ns = 'display.image';
				types.serialiser.parse( ns + '.props', props, types.controls.properties.getInstance() );
			}
		}
	} );
	
} )(jQuery,this);
