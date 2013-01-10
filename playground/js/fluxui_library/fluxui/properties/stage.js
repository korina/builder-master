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
		type: 'properties.stage',
		initial: {
			props: {
				fill: {
					type: 'linear',
					direction: 'top',
					colors: [
						{
							rgb: '#cccccc',
							opacity: 1,
							pos: 0
						},
						{
							rgb: '#cccccc',
							opacity: 1,
							pos: 0.63
						},
						{
							rgb: '#000000',
							opacity: 1,
							pos: 0.635
						},
						{
							rgb: '#cccccc',
							opacity: 1,
							pos: 0.64
						}
					]
				},
				position: 'relative',
				width: 300,
				height: 100,
				overflow: 'hidden'
			}
		},
		children: {
			keys: [ 'width', 'width-label', 'height', 'height-label', 'fill', 'fill-label', 'transparent', 'transparent-label', 'id', 'id-label', 'class', 'class-label' ],
			hash: {
				width: {
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
							event: 'events.stage.width.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.stage.width'
						}
					}
				},
				'width-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 70,
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
							left: 10,
							top: 40,
							width: 50
						}
					},
					bind: {
						text: {
							event: 'events.stage.height.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.stage.height'
						}
					}
				},
				'height-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 70,
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
							left: 100,
							top: 8
						},
						attr: {
							allowGradient: false
						}
					},
					bind: {
						color: {
							event: 'events.stage.fill.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.stage.fill'
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
							left: 130,
							top: 10,
							width: 100
						},
						attr: {
							text: 'bgcolor'
						}
					}
				},
				'transparent': {
					type: 'display.form.checkbox',
					initial: {
						props: {
							left: 104,
							top: 40
						},
						attr: {
							checked: true
						}
					},
					bind: {
						text: {
							event: 'events.stage.transparent.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.stage.transparent'
						}
					}
				},
				'transparent-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 130,
							top: 40
						},
						attr: {
							text: 'transparent'
						}
					}
				},
				'id': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 70,
							width: 80
						}
					},
					bind: {
						text: {
							event: 'events.stage.id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.stage.id'
						}
					}
				},
				'id-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 100,
							top: 70,
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
							top: 70,
							width: 80
						}
					},
					bind: {
						text: {
							event: 'events.stage.class.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.stage.class'
						}
					}
				},
				'class-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 70,
							width: 40
						},
						attr: {
							text: 'class'
						}
					}
				}
			}
		}
	}
	
	/**
	 * Stage property sheet class
	 * Provides functionality for the stage property sheets.
	 *
	 * Requires:
	 *		propsheet.js
	 *		../controls/properties.js
	 **/
	 
	var clazz = $.fn.fluxui.$class.create( {
		namespace : 'properties.stage',
		inherits : types.properties.propsheet,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			ens : 'stage'
		},
		methods : {
			initialise : function( $id, $decorator ) {
				var me = this;
				eventDispatcher.addListener( 'properties.stage.*', function( $ns, $evt ) {
					me.handlePropertyChange( $($evt.target) );
				} );
				types.controls.colorpicker.current( this.getChildById( 'fill' ) );
				clazz.Super.initialise.call( this, $id, $decorator );
			},
			// Only the size and color of the stage are user definable.
			handlePropertyChange : function( $control ) {
				var t = $control.attr( 'fluxid' );
				switch( t ) {
					case 'width':
					case 'height':
						var n = parseInt( $control.val() );
						if ( !isNaN( n ) )
							eventDispatcher.dispatch( this, 'events.stage.' + t, n );
						break;
					case 'fill':
						var c = this.getChildById( 'fill' );
						eventDispatcher.dispatch( this, 'events.stage.fill', c );
						break;
				}
			},
			update : function() {
				types.controls.colorpicker.current( this.getChildById( 'fill' ) );
			}
		},
		statics : {
			create : function() {
				var ns = 'stage';
				types.serialiser.parse( ns + '.props', props, types.controls.properties.getInstance() );
			}
		}
	} );
	
} )(jQuery,this);
