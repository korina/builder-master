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
		type: 'properties.jplayer-video',
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
				height: 190
			}
		},
		children: {
			keys: [ 'left', 'left-label', 'top', 'top-label', 'width', 'width-label', 'height', 'height-label', 'id', 'id-label', 'class', 'class-label', 'flux-id', 'flux-id-label', 'mpeg', 'mpeg-label', 'ogg', 'ogg-label' ],
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
							event: 'events.jplayer-video.left.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-video.left'
						},
						keyup: {
							event: 'properties.jplayer-video.left'
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
							event: 'events.jplayer-video.top.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-video.top'
						},
						keyup: {
							event: 'properties.jplayer-video.top'
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
							event: 'events.jplayer-video.width.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-video.width'
						},
						keyup: {
							event: 'properties.jplayer-video.width'
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
							event: 'events.jplayer-video.height.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-video.height'
						},
						keyup: {
							event: 'properties.jplayer-video.height'
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
							event: 'events.jplayer-video.id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-video.id'
						},
						keyup: {
							event: 'properties.jplayer-video.id'
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
							event: 'events.jplayer-video.class.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-video.class'
						},
						keyup: {
							event: 'properties.jplayer-video.class'
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
							event: 'events.jplayer-video.flux-id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-video.flux-id'
						},
						keyup: {
							event: 'properties.jplayer-video.flux-id'
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
				mpeg: {
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
							event: 'events.jplayer-video.mpeg.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-video.mpeg'
						},
						keyup: {
							event: 'properties.jplayer-video.mpeg'
						}
					}
				},
				'mpeg-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 130,
							width: 70
						},
						attr: {
							text: 'Mpeg (MP4)'
						}
					}
				},
				ogg: {
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
							event: 'events.jplayer-video.ogg.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-video.ogg'
						},
						keyup: {
							event: 'properties.jplayer-video.ogg'
						}
					}
				},
				'ogg-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 160,
							width: 70
						},
						attr: {
							text: 'Ogg (OGV)'
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
		namespace : 'properties.jplayer-video',
		inherits : types.properties.propsheet,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			ens : 'jplayer-video'
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
				d.dispatch( this, $prefix + '.mpeg.changed', s.attr.m4v );
				d.dispatch( this, $prefix + '.ogg.changed', s.attr.ogv );
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
					case 'mpeg':
						t.setMedia( s, null );
						break;
					case 'ogg':
						t.setMedia( null, s );
						break;
				}
			}
		},
		statics : {
			create : function() {
				var ns = 'jplayer-video';
				types.serialiser.parse( ns + '.props', props, types.controls.properties.getInstance() );
			}
		}
	} );

} )(jQuery,this);

