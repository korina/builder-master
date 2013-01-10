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
		type: 'properties.container',
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
							pos: 0.34
						},
						{
							rgb: '#000000',
							opacity: 1,
							pos: 0.345
						},
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0.35
						},
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0.665
						},
						{
							rgb: '#000000',
							opacity: 1,
							pos: 0.67
						},
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0.675
						}
					]
				},
				position: 'relative',
				width: 300,
				height: 185
			}
		},
		children: {
			keys: [ 'left', 'left-label', 'top', 'top-label', 'width', 'width-label', 'height', 'height-label', 'fill', 'fill-label', 'border-width', 'border-width-label', 'border-color', 'border-color-label', 'border-radius', 'border-radius-label', 'id', 'id-label', 'class', 'class-label', 'flux-id', 'flux-id-label' ],
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
							event: 'events.display.container.left.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.container.left'
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
							event: 'events.display.container.top.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.container.top'
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
							event: 'events.display.container.width.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.container.width'
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
							event: 'events.display.container.height.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.container.height'
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
				'fill': {
					type: 'controls.colorpicker',
					initial: {
						props: {
							left: 190,
							top: 8
						},
						attr: {
							allowGradient: true
						}
					},
					bind: {
						color: {
							event: 'events.display.container.fill.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.container.fill'
						},
						click: {
							event: 'color.request'
						}
					}
				},
				'fill-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 10
						},
						attr: {
							text: 'bgcolor'
						}
					}
				},
				'border-color': {
					type: 'controls.colorpicker',
					initial: {
						props: {
							left: 190,
							top: 68
						}
					},
					bind: {
						color: {
							event: 'events.display.container.border-color.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.container.border-color'
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
							left: 220,
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
							event: 'events.display.container.border-width.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.container.border-width'
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
							event: 'events.display.container.border-radius.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.container.border-radius'
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
				'id': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 130,
							width: 80
						}
					},
					bind: {
						text: {
							event: 'events.display.container.id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.container.id'
						}
					}
				},
				'id-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 100,
							top: 130,
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
							top: 130,
							width: 80
						}
					},
					bind: {
						text: {
							event: 'events.display.container.class.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.container.class'
						}
					}
				},
				'class-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 130,
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
							top: 160,
							width: 200
						}
					},
					bind: {
						text: {
							event: 'events.display.container.flux-id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.container.flux-id'
						}
					}
				},
				'flux-id-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 160,
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
	 * Container property class
	 * Provides functionality for the container element in the property panel.
	 * Container is essentially just a div to which styles such as background gradients and border radius' can be applied.
	 *
	 * Requires:
	 *		propsheet.js
	 *		../controls/properties.js
	 **/
	 
	var clazz = $.fn.fluxui.$class.create( {
		namespace : 'properties.container',
		inherits : types.properties.propsheet,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			ens : 'display.container'
		},
		methods : {
			initialise : function( $id, $decorator ) {
				var me = this;
				eventDispatcher.addListener( 'properties.container.*', function( $ns, $evt ) {
					me.handlePropertyChange( $($evt.target) );
				} );
				clazz.Super.initialise.call( this, $id, $decorator );
			},
			// Update the color picker with the container's color.
			update : function() {
				types.controls.colorpicker.current( this.getChildById( 'fill' ) );
			}
		},
		statics : {
			create : function() {
				var ns = 'display.container';
				types.serialiser.parse( ns + '.props', props, types.controls.properties.getInstance() );
			}
		}
	} );

} )(jQuery,this);
