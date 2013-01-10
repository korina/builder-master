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
		type: 'properties.label',
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
							pos: 0.42
						},
						{
							rgb: '#000000',
							opacity: 1,
							pos: 0.42
						},
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0.425
						}
	
					]
				},
				position: 'relative',
				width: 300,
				height: 295
			}
		},
		children: {
			keys: [ 'left', 'left-label', 'top', 'top-label', 'width', 'width-label', 'height', 'height-label', 'color', 'color-label', 'id', 'id-label', 'class', 'class-label', 'flux-id', 'flux-id-label', 'text', 'text-label', 'font-family', 'font-family-label', 'text-align', 'text-align-label', 'text-decoration', 'text-decoration-label', 'font-size', 'font-size-label', 'font-weight', 'font-weight-label' ],
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
							event: 'events.display.label.left.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.label.left'
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
							event: 'events.display.label.top.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.label.top'
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
							event: 'events.display.label.width.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.label.width'
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
							event: 'events.display.label.height.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.label.height'
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
				'color': {
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
							event: 'events.display.label.color.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.label.color'
						},
						click: {
							event: 'color.request'
						}
					}
				},
				'color-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 10
						},
						attr: {
							text: 'color'
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
							event: 'events.display.label.id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.label.id'
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
							event: 'events.display.label.class.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.label.class'
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
				},
				'flux-id': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 100,
							width: 200
						}
					},
					bind: {
						text: {
							event: 'events.display.label.flux-id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.label.flux-id'
						}
					}
				},
				'flux-id-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 100,
							width: 40
						},
						attr: {
							text: 'flux id'
						}
					}
				},
				'text': {
					type: 'display.form.textarea',
					initial: {
						props: {
							left: 10,
							top: 130,
							width: 200,
							height: 55
						}
					},
					bind: {
						text: {
							event: 'events.display.label.text.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.label.text'
						}
					}
				},
				'text-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 130,
							width: 40
						},
						attr: {
							text: 'html content'
						}
					}
				},
				'font-family' : {
					type : 'display.form.dropdown',
					initial : {
						props : {
							left: 10,
							top: 200,
							width: 200
						},
						attr: {
							labels : ['Arial', 'Courier New', 'Georgia', 'Impact', 'Times New Roman', 'Trebuchet MS', 'Verdana'],
							values : ['Arial', 'Courier New', 'Georgia', 'Impact', 'Times New Roman', 'Trebuchet MS', 'Verdana']
						}
					},
					bind : {
						text : {
							event : 'events.display.label.font-family.changed'
						}
					},
					behavior : {
						change : {
							event : 'properties.label.font-family'
						}
					}
				},
				'font-family-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 200
						},
						attr: {
							text: 'typeface'	
						}
					}
				},
				'font-size': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 260,
							width: 50
						},
						attr: {
							text: '12'
						}
					},
					bind: {
						text: {
							event: 'events.display.label.font-size.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.label.font-size'
						}
					}
				},
				'font-size-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 70,
							top: 260
						},
						attr: {
							text: 'font-size'
						}
					}
				},
				'text-align' : {
					type : 'display.form.dropdown',
					initial : {
						props : {
							left: 10,
							top: 230,
							width: 65
						},
						attr: {
							labels : ['Left', 'Right', 'Center', 'Justify'],
							values : ['left', 'right', 'center', 'justify']
						}
					},
					bind : {
						text : {
							event : 'events.display.label.text-align.changed'
						}
					},
					behavior : {
						change : {
							event : 'properties.label.text-align'
						}
					}
				},
				'text-align-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 85,
							top: 230
						},
						attr: {
							text: 'align'
						}
					}
				},
				'text-decoration' : {
					type : 'display.form.dropdown',
					initial : {
						props : {
							left: 125,
							top: 230,
							width: 100
						},
						attr: {
							labels : ['None', 'Underline', 'Overline', 'Line-through', 'Blink'],
							values : ['none', 'underline', 'overline', 'line-through', 'blink']
						}
					},
					bind : {
						text : {
							event : 'events.display.label.text-decoration.changed'
						}
					},
					behavior : {
						change : {
							event : 'properties.label.text-decoration'
						}
					}
				},
				'text-decoration-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 235,
							top: 230
						},
						attr: {
							text: 'decorate'
						}
					}
				},
				'font-weight' : {
					type : 'display.form.dropdown',
					initial : {
						props : {
							left: 125,
							top: 260,
							width: 100
						},
						attr: {
							labels : ['Normal', 'Bold'],
							values : ['normal', 'bold']
						}
					},
					bind : {
						text : {
							event : 'events.display.label.font-weight.changed'
						}
					},
					behavior : {
						change : {
							event : 'properties.label.font-weight'
						}
					}
				},
				'font-weight-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 235,
							top: 260
						},
						attr: {
							text: 'weight'
						}
					}
				}
			}
		}
	}
	
	/**
	 * Label property sheet class
	 * Provides functionality for the label (text only element) property sheets.
	 *
	 * Requires:
	 *		propsheet.js
	 *		../controls/properties.js
	 **/
	 
	var clazz = $.fn.fluxui.$class.create( {
		namespace : 'properties.label',
		inherits : types.properties.propsheet,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			ens : 'display.label'
		},
		methods : {
			initialise : function( $id, $decorator ) {
				var me = this;
				eventDispatcher.addListener( 'properties.label.*', function( $ns, $evt ) {
					me.handlePropertyChange( $($evt.target) );
				} );
				clazz.Super.initialise.call( this, $id, $decorator );
			},
			update : function() {
				types.controls.colorpicker.current( this.getChildById( 'color' ) );
			}
		},
		statics : {
			create : function() {
				var ns = 'display.label';
				types.serialiser.parse( ns + '.props', props, types.controls.properties.getInstance() );
			}
		}
	} );
	
} )(jQuery,this);
