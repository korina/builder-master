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
		type: 'properties.html5-media',
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
				height: 290
			}
		},
		children: {
			keys: [ 'left', 'left-label', 'top', 'top-label', 'width', 'width-label', 'height', 'height-label', 'id', 'id-label', 'class', 'class-label', 'flux-id', 'flux-id-label', 'mediatype', 'mediatype-label', 'mpeg', 'mpeg-label', 'ogg', 'ogg-label', 'flash', 'flash-label', 'flashvars', 'flashvars-label' ],
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
							event: 'events.html5-media.left.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.html5-media.left'
						},
						keyup: {
							event: 'properties.html5-media.left'
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
							event: 'events.html5-media.top.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.html5-media.top'
						},
						keyup: {
							event: 'properties.html5-media.top'
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
							event: 'events.html5-media.width.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.html5-media.width'
						},
						keyup: {
							event: 'properties.html5-media.width'
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
							event: 'events.html5-media.height.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.html5-media.height'
						},
						keyup: {
							event: 'properties.html5-media.height'
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
							event: 'events.html5-media.id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.html5-media.id'
						},
						keyup: {
							event: 'properties.html5-media.id'
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
							event: 'events.html5-media.class.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.html5-media.class'
						},
						keyup: {
							event: 'properties.html5-media.class'
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
							event: 'events.html5-media.flux-id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.html5-media.flux-id'
						},
						keyup: {
							event: 'properties.html5-media.flux-id'
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
				mediatype: {
					type: 'display.form.dropdown',
					initial: {
						props: {
							left: 10,
							top: 130,
							width: 180
						},
						attr: {
							labels: [ 'Video', 'Audio' ],
							values: [ 'video', 'audio' ],
							selected: 'video'
						}
					},
					bind: {
						selected: {
							event: 'events.html5-media.mediatype.changed',
						}
					},
					behavior: {
						change: {
							event: 'properties.html5-media.mediatype',
						},
						keyup: {
							event: 'properties.html5-media.mediatype',
						}
					}
				},
				'mediatype-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 130,
							width: 70
						},
						attr: {
							text: 'Media type'
						}
					}
				},
				mpeg: {
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
							event: 'events.html5-media.mpeg.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.html5-media.mpeg'
						},
						keyup: {
							event: 'properties.html5-media.mpeg'
						}
					}
				},
				'mpeg-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 160,
							width: 70
						},
						attr: {
							text: 'MP4/MP3'
						}
					}
				},
				ogg: {
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
							event: 'events.html5-media.ogg.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.html5-media.ogg'
						},
						keyup: {
							event: 'properties.html5-media.ogg'
						}
					}
				},
				'ogg-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 190,
							width: 70
						},
						attr: {
							text: 'OGV/OGA'
						}
					}
				},
				flash: {
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
							event: 'events.html5-media.flash.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.html5-media.flash'
						},
						keyup: {
							event: 'properties.html5-media.flash'
						}
					}
				},
				'flash-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 220,
							width: 70
						},
						attr: {
							text: 'Flash player'
						}
					}
				},
				flashvars: {
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
							event: 'events.html5-media.flashvars.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.html5-media.flashvars'
						},
						keyup: {
							event: 'properties.html5-media.flashvars'
						}
					}
				},
				'flashvars-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 200,
							top: 250,
							width: 70
						},
						attr: {
							text: 'Flash variables'
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
		namespace : 'properties.html5-media',

		inherits : types.properties.propsheet,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			ens : 'html5-media'
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
				d.dispatch( this, $prefix + '.mediatype.changed', s.attr['media-type'] );
				d.dispatch( this, $prefix + '.mpeg.changed', s.attr.mpeg );
				d.dispatch( this, $prefix + '.ogg.changed', s.attr.ogg );
				d.dispatch( this, $prefix + '.flash.changed', s.attr['flash-player'] );
				d.dispatch( this, $prefix + '.flashvars.changed', s.attr['flash-vars'] );
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
						i.style( fid, n );
						t.style( fid, n );
						break;
					case 'width':
					case 'height':
						i.style( fid, n );
						t.style( fid, n );
						t.setMedia();
						break;
					case 'class':
					case 'id':
						t.attribute( fid, s, 1 );
						break;
					case 'flux-id':
						t.fluxid( s );
						break;
					case 'mediatype':
						t.setmediatype( s );
						break;
					case 'mpeg':
						t.setmpeg( s );
						break;
					case 'ogg':
						t.setogg( s );
						break;
					case 'flash':
						t.setFlash( s, null );
						break;
					case 'flashvars':
						t.setFlash( null, s );
						break;
				}
			}
		},
		statics : {
			create : function() {
				var ns = 'html5-media';
				types.serialiser.parse( ns + '.props', props, types.controls.properties.getInstance() );
			}
		}
	} );

} )(jQuery,this);
