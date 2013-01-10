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
		type: 'properties.social-sketching',
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
						}
					]
				},
				position: 'relative',
				width: 300,
				height: 460
			}
		},
		children: {
			keys: [ 'left', 'left-label', 'top', 'top-label', 'width', 'width-label', 'height', 'height-label', 'id', 'id-label', 'class', 'class-label', 'flux-id', 'flux-id-label', 'brush-color', 'brush-color-label', 'brush-size', 'brush-size-label', 'rub-color', 'rub-color-label', 'rub-size', 'rub-size-label', 'rub-key', 'rub-key-label', 'socket-settings', 'socket-settings-label', 'socket-server', 'socket-server-label', 'instruction' ],
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
							event: 'events.social-sketching.left.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.left'
						},
						keyup: {
							event: 'properties.social-sketching.left'
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
							event: 'events.social-sketching.top.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.top'
						},
						keyup: {
							event: 'properties.social-sketching.top'
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
							event: 'events.social-sketching.width.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.width'
						},
						keyup: {
							event: 'properties.social-sketching.width'
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
							event: 'events.social-sketching.height.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.height'
						},
						keyup: {
							event: 'properties.social-sketching.height'
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
							event: 'events.social-sketching.id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.id'
						},
						keyup: {
							event: 'properties.social-sketching.id'
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
							event: 'events.social-sketching.class.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.class'
						},
						keyup: {
							event: 'properties.social-sketching.class'
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
							event: 'events.social-sketching.flux-id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.flux-id'
						},
						keyup: {
							event: 'properties.social-sketching.flux-id'
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
				'brush-color': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 130,
							width: 180
						}
					},
					bind: {
						text: {
							event: 'events.social-sketching.brush-color.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.brush-color'
						},
						keyup: {
							event: 'properties.social-sketching.brush-color'
						}
					}
				},
				'brush-color-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 130,
							width: 70
						},
						attr: {
							text: 'Brush color'
						}
					}
				},
				'brush-size': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 160,
							width: 180
						}
					},
					bind: {
						text: {
							event: 'events.social-sketching.brush-size.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.brush-size'
						}.
						keyup: {
							event: 'properties.social-sketching.brush-size'
						}
					}
				},
				'brush-size-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 160,
							width: 70
						},
						attr: {
							text: 'Brush size'
						}
					}
				},
				'rub-color': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 190,
							width: 180
						}
					},
					bind: {
						text: {
							event: 'events.social-sketching.rub-color.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.rub-color'
						},
						keyup: {
							event: 'properties.social-sketching.rub-color'
						}
					}
				},
				'rub-color-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 190,
							width: 70
						},
						attr: {
							text: 'Rub color'
						}
					}
				},
				'rub-size': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 220,
							width: 180
						}
					},
					bind: {
						text: {
							event: 'events.social-sketching.rub-size.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.rub-size'
						},
						keyup: {
							event: 'properties.social-sketching.rub-size'
						}
					}
				},
				'rub-size-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 220,
							width: 70
						},
						attr: {
							text: 'Rub size'
						}
					}
				},
				'rub-key': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 250,
							width: 180
						}
					},
					bind: {
						text: {
							event: 'events.social-sketching.rub-key.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.rub-key'
						},
						keyup: {
							event: 'properties.social-sketching.rub-key'
						}
					}
				},
				'rub-key-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 250,
							width: 70
						},
						attr: {
							text: 'Rub keycode'
						}
					}
				},
				'socket-settings': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 280,
							width: 180
						}
					},
					bind: {
						text: {
							event: 'events.social-sketching.socket-settings.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.socket-settings'
						},
						keyup: {
							event: 'properties.social-sketching.socket-settings'
						}
					}
				},
				'socket-settings-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 280,
							width: 70
						},
						attr: {
							text: 'Socket settings'
						}
					}
				},
				'socket-server': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 310,
							width: 180
						}
					},
					bind: {
						text: {
							event: 'events.social-sketching.socket-server.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.social-sketching.socket-server'
						},
						keyup: {
							event: 'properties.social-sketching.socket-server'
						}
					}
				},
				'socket-server-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 310,
							width: 70
						},
						attr: {
							text: 'Socket server'
						}
					}
				},
				instruction: {
					type: 'display.label',
					initial: {
						props: {
							left: 10,
							top: 345,
							width: 250,
							height: 110
						},
						attr: {
							text: 'To switch to rub mode press shift key, <a href="http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes">or whichever key you replace it with</a>.<br>Changing attributes deletes previous data from the stage.<br>To change the socket settings or server requires the application to be saved and reloaded.'
						}
					}
				}
			}
		}
	}
	
	/**
	 * HTML5 media component property sheet class
	 * Provides functionality for the HTML5 video property sheets.
	 **/
	var clazz = $.fn.fluxui.$class.create( {
		namespace : 'properties.social-sketching',
		inherits : types.properties.propsheet,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			ens : 'social-sketching'
		},
		methods : {
			updatePropertyFields : function( $cls, $prefix ) {
				var d = eventDispatcher;
				var s = $cls.states.getCurrentStateData();
				d.dispatch( this, $prefix + '.width.changed', $cls.width() );
				d.dispatch( this, $prefix + '.height.changed', $cls.height() );
				d.dispatch( this, $prefix + '.left.changed', parseInt( $cls.x() ) );
				d.dispatch( this, $prefix + '.top.changed', parseInt( $cls.y() ) );
				d.dispatch( this, $prefix + '.id.changed', $cls.attribute( 'id' ) );
				d.dispatch( this, $prefix + '.class.changed', $cls.attribute( 'class' ));
				d.dispatch( this, $prefix + '.flux-id.changed', $cls.fluxid() );
				d.dispatch( this, $prefix + '.brush-color.changed', s.attr['brush-color'] );
				d.dispatch( this, $prefix + '.brush-size.changed', s.attr['brush-size'] );
				d.dispatch( this, $prefix + '.rub-color.changed', s.attr['rub-color'] );
				d.dispatch( this, $prefix + '.rub-size.changed', s.attr['rub-size'] );
				d.dispatch( this, $prefix + '.rub-key.changed', s.attr['rub-key'] );
				d.dispatch( this, $prefix + '.socket-settings.changed', s.attr['socket-settings'] );
				d.dispatch( this, $prefix + '.socket-server.changed', s.attr['socket-server'] );
			},
			handlePropertyChange : function( $control ) {
				if ( this.selection._targets.length < 1 ) return;
				var t = types.display.element.getInstance( this.selection.targets(0).get(0) ),
					i = this.manipulator,
					n = parseInt( $control.val() ),
					s = $control.val(),
					fid = $control.attr( 'fluxid' );
				switch( fid ) {
					case 'left':
					case 'top':
					case 'width':
					case 'height':
						i.style( fid, n );
						t.style( fid, n );
						break;
					case 'brush-color':
						t.setBrush( s, null );
						break;
					case 'brush-size':
						t.setBrush( null, s );
						break;
					case 'rub-color':
						t.setRub( s, null, null );
						break;
					case 'rub-size':
						t.setRub( null, s, null );
						break;
					case 'rub-key':
						t.setRub( null, null, s );
						break;
					case 'socket-settings':
						t.setSockets( s, null );
						break;
					case 'socket-server':
						t.setSockets( null, s );
						break;
				}
			}
		},
		statics : {
			create : function() {
				var ns = 'social-sketching';
				types.serialiser.parse( ns + '.props', props, types.controls.properties.getInstance() );
			}
		}
	} );

} )(jQuery,this);
