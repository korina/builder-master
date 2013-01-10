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
		type: 'properties.chat-with-sockets',
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
				height: 310
			}
		},
		children: {
			keys: [ 'left', 'left-label', 'top', 'top-label', 'width', 'width-label', 'height', 'height-label', 'id', 'id-label', 'class', 'class-label', 'flux-id', 'flux-id-label', 'socket-settings', 'socket-settings-label', 'socket-server', 'socket-server-label', 'conversation-style', 'conversation-style-label', 'standard-picture', 'standard-picture-label', 'instruction' ],
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
							event: 'events.chat-with-sockets.left.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.chat-with-sockets.left'
						},
						keyup: {
							event: 'properties.chat-with-sockets.left'
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
							event: 'events.chat-with-sockets.top.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.chat-with-sockets.top'
						},
						keyup: {
							event: 'properties.chat-with-sockets.top'
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
							event: 'events.chat-with-sockets.width.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.chat-with-sockets.width'
						},
						keyup: {
							event: 'properties.chat-with-sockets.width'
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
							event: 'events.chat-with-sockets.height.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.chat-with-sockets.height'
						},
						keyup: {
							event: 'properties.chat-with-sockets.height'
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
							event: 'events.chat-with-sockets.id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.chat-with-sockets.id'
						},
						keyup: {
							event: 'properties.chat-with-sockets.id'
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
							event: 'events.chat-with-sockets.class.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.chat-with-sockets.class'
						},
						keyup: {
							event: 'properties.chat-with-sockets.class'
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
							event: 'events.chat-with-sockets.flux-id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.chat-with-sockets.flux-id'
						},
						keyup: {
							event: 'properties.chat-with-sockets.flux-id'
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
				'socket-settings': {
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
							event: 'events.chat-with-sockets.socket-settings.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.chat-with-sockets.socket-settings'
						},
						keyup: {
							event: 'properties.chat-with-sockets.socket-settings'
						}
					}
				},
				'socket-settings-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 130,
							width: 80
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
							top: 170,
							width: 180
						}
					},
					bind: {
						text: {
							event: 'events.chat-with-sockets.socket-server.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.chat-with-sockets.socket-server'
						},
						keyup: {
							event: 'properties.chat-with-sockets.socket-server'
						}
					}
				},
				'socket-server-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 170,
							width: 70
						},
						attr: {
							text: 'Socket server'
						}
					}
				},
				'conversation-style': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 200,
							width: 180
						}
					},
					bind: {
						text: {
							event: 'events.chat-with-sockets.conversation-style.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.chat-with-sockets.conversation-style'
						},
						keyup: {
							event: 'properties.chat-with-sockets.conversation-style'
						}
					}
				},
				'conversation-style-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 200,
							width: 80
						},
						attr: {
							text: 'Conversation style'
						}
					}
				},
				'standard-picture': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 230,
							width: 180
						}
					},
					bind: {
						text: {
							event: 'events.chat-with-sockets.standard-picture.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.chat-with-sockets.standard-picture'
						},
						keyup: {
							event: 'properties.chat-with-sockets.standard-picture'
						}
					}
				},
				'standard-picture-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 230,
							width: 80
						},
						attr: {
							text: 'Standard picture'
						}
					}
				},
				instruction: {
					type: 'display.label',
					initial: {
						props: {
							left: 10,
							top: 265,
							width: 270,
							height: 110
						},
						attr: {
							text: 'To change the socket settings or server requires the application to be saved and reloaded.'
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
		namespace : 'properties.chat-with-sockets',
		inherits : types.properties.propsheet,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			ens : 'chat-with-sockets'
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
				d.dispatch( this, $prefix + '.socket-settings.changed', s.attr['socket-settings'] );
				d.dispatch( this, $prefix + '.socket-server.changed', s.attr['socket-server'] );
				d.dispatch( this, $prefix + '.conversation-style.changed', s.attr['conversation-style'] );
				d.dispatch( this, $prefix + '.standard-picture.changed', s.attr['standard-picture'] );
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
					case 'class':
					case 'id':
						t.attribute( fid, s, 1 );
						break;
					case 'flux-id':
						t.fluxid( s );
						break;
					case 'socket-settings':
						t.setSockets( s, null );
						break;
					case 'socket-server':
						t.setSockets( null, s );
						break;
					case 'conversation-style':
						t.setConversationStyle( s );
						break;
					case 'standard-picture':
						t.setStandardPicture( s );
						break;
				}
			}
		},
		statics : {
			create : function() {
				var ns = 'chat-with-sockets';
				types.serialiser.parse( ns + '.props', props, types.controls.properties.getInstance() );
			}
		}
	} );

} )(jQuery,this);
