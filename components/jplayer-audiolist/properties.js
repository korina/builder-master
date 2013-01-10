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
		type: 'properties.jplayer-audiolist',
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
				width: 280,
				height: 340
			}
		},
		children: {
			keys: [ 'left', 'left-label', 'top', 'top-label', 'width', 'width-label', 'height', 'height-label', 'id', 'id-label', 'class', 'class-label', 'flux-id', 'flux-id-label', 'audiotracks', 'saved', 'mock-track' ],
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
							event: 'events.jplayer-audiolist.left.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-audiolist.left'
						},
						keyup: {
							event: 'properties.jplayer-audiolist.left'
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
							event: 'events.jplayer-audiolist.top.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-audiolist.top'
						},
						keyup: {
							event: 'properties.jplayer-audiolist.top'
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
							event: 'events.jplayer-audiolist.width.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-audiolist.width'
						},
						keyup: {
							event: 'properties.jplayer-audiolist.width'
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
							event: 'events.jplayer-audiolist.height.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-audiolist.height'
						},
						keyup: {
							event: 'properties.jplayer-audiolist.height'
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
							event: 'events.jplayer-audiolist.id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-audiolist.id'
						},
						keyup: {
							event: 'properties.jplayer-audiolist.id'
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
							event: 'events.jplayer-audiolist.class.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-audiolist.class'
						},
						keyup: {
							event: 'properties.jplayer-audiolist.class'
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
							event: 'events.jplayer-audiolist.flux-id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.jplayer-audiolist.flux-id'
						},
						keyup: {
							event: 'properties.jplayer-audiolist.flux-id'
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
				audiotracks: {
					type: 'display.element',
					initial: {
						props: {
							position: 'relative',
							top: 130,
							width: 280,
							height: 210,
							'overflow-y': 'auto'
						}
					}
				},
				saved: {
					type: 'display.container',
					initial: {
						props: {
							left: 210,
							top: 4,
							height: 18,
							width: 40,
							'font-weight': 'bold',
							cursor: 'pointer',
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
							}
						}
					},
					behavior: {
						click: {
							event: 'properties.jplayer-audiolist.saved'
						}
					},
					children: {
						keys: [ 'saved-label' ],
						hash: {
							'saved-label': {
								type: 'display.label',
								initial: {
									attr: {
										text: 'Save'
									}
								}
							}
						}
					}
				},
				'mock-track': {
					type: 'display.element',
					initial: {
						props: {
							display: 'none'
						}
					},
					children: {
						keys: [ 'tracknumber', 'title', 'title-label', 'artist', 'artist-label', 'mpeg', 'mpeg-label', 'ogg', 'ogg-label', 'add', 'remove' ],
						hash: {
							tracknumber: {
								type: 'display.label',
								initial: {
									props: {
										position: 'relative',
										clear: 'left',
										left: 10,
										top: 14,
										height: 25,
									},
									attr: {
										text: 'Track 0'
									}
								}
							},
							title: {
								type: 'display.form.textfield',
								initial: {
									props: {
										position: 'relative',
										float: 'left',
										left: 10,
										top: 10,
										width: 200
									},
									attr : {
										class : ''
									}
								}
							},
							'title-label': {
								type: 'display.label',
								initial: {
									props: {
										position: 'relative',
										top: 14,
										left: 15,
										width: 60
									},
									attr: {
										text: 'Title'
									}
								}
							},
							artist: {
								type: 'display.form.textfield',
								initial: {
									props: {
										position: 'relative',
										float: 'left',
										left: 10,
										top: 10,
										width: 200
									},
									attr : {
										class : ''
									}
								}
							},
							'artist-label': {
								type: 'display.label',
								initial: {
									props: {
										position: 'relative',
										left: 15,
										top: 14,
										width: 60
									},
									attr: {
										text: 'Artist'
									}
								}
							},
							mpeg: {
								type: 'display.form.textfield',
								initial: {
									props: {
										position: 'relative',
										float: 'left',
										left: 10,
										top: 10,
										width: 200
									},
									attr : {
										class : ''
									}
								}
							},
							'mpeg-label': {
								type: 'display.label',
								initial: {
									props: {
										position: 'relative',
										left: 15,
										top: 14,
										width: 60
									},
									attr: {
										text: 'Mpeg'
									}
								}
							},
							ogg: {
								type: 'display.form.textfield',
								initial: {
									props: {
										position: 'relative',
										float: 'left',
										left: 10,
										top: 10,
										width: 200
									},
									attr : {
										class : ''
									}
								}
							},
							'ogg-label': {
								type: 'display.label',
								initial: {
									props: {
										position: 'relative',
										left: 15,
										top: 14,
										width: 60
									},
									attr: {
										text: 'Ogg'
									}
								}
							},
							add: {
								type: 'display.label',
								initial: {
									props: {
										position: 'relative',
										clear: 'both',
										float: 'left',
										left: 20,
										top: 14,
										height: 20,
										'font-weight': 'bold',
										cursor: 'pointer'
									},
									attr: {
										text: 'Add new'
									}
								},
								behavior: {
									click: {
										event: 'properties.jplayer-audiolist.add'
									}
								}
							},
							remove: {
								type: 'display.label',
								initial: {
									props: {
										position: 'relative',
										float: 'left',
										left:  30,
										top: 14,
										height: 20,
										'font-weight': 'bold',
										cursor: 'pointer'
									},
									attr: {
										text: 'Remove this'
									}
								},
								behavior: {
									click: {
										event: 'properties.jplayer-audiolist.remove'
									}
								}
							}
						}
					}
				}
			}
		}
	}
	
	/**
	 * JPlayer audiolist component property sheet class
	 * Provides functionality for the HTML5 video property sheets.
	 **/
	var clazz = $.fn.fluxui.$class.create( {
		namespace : 'properties.jplayer-audiolist',
		inherits : types.properties.propsheet,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			ens : 'jplayer-audiolist'
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
				var list = $cls.states.getCurrentStateData().attr.audiolist;
				this.$node().find( '[fluxid=audiotracks]' ).html( '' );
				for ( t = 0; t < list.length; t++ ) this.makeTrack( list[t], t );
			},
			handlePropertyChange : function( $control ) {
				if ( this.selection._targets.length < 1 ) return;
				var t = types.display.element.getInstance( this.selection.targets(0).get(0) ),
					i = this.manipulator,
					n = parseInt( $control.val() ),
					s = $control.val(),
					fid = $control.attr( 'fluxid' ),
					list = [],
					tracks = this.getChildById( 'audiotracks' ).$node().find( '[fluxid=tracknumber]' ).length - 1;
				for ( ii = 0; ii <= tracks; ii++ ) {
					var classPrefix = 'audiotrack-' + ii + '-';
					list[ii] = {};
					list[ii].title = this.$node().find( '.' + classPrefix + 'title' ).attr( 'value' );
					list[ii].artist = this.$node().find( '.' + classPrefix + 'artist' ).attr( 'value' );
					list[ii].mp3 = this.$node().find( '.' + classPrefix + 'mpeg' ).attr( 'value' );
					list[ii].oga = this.$node().find( '.' + classPrefix + 'ogg' ).attr( 'value' );
				}
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
					case 'saved' : case 'saved-label' :
						t.setPlaylist( list );
						break;
					case 'add' :
						var i = $control.attr( 'trackno' );
						var newTrack = { title : '?', artist : '?', mp3 : 'http://?.mp3', oga : 'http://?.oga' };
							newList = list, i = Number( i );
						newList.splice( ( i + 1 ), 0, newTrack );
						t.setPlaylist( newList );
						this.$node().find( '[fluxid=audiotracks]' ).html( '' );
						for ( ii = 0; ii <= newList.length - 1; ii++ ) this.makeTrack( newList[ii], ii );
						break;
					case 'remove':
						var i = $control.attr( 'trackno' );
						var newList = list, i = Number( i );
						console.log( 'Removing: ', i, newList[i] );
						newList.splice( i, 1 );
						t.setPlaylist( newList );
						this.$node().find( '[fluxid=audiotracks]' ).html( '' );
						for ( ii = 0; ii <= newList.length - 1; ii++ ) this.makeTrack( newList[ii], ii );
						break;
				};
			},
			makeTrack : function( $track, $n ) {
				if ( !$track ) var $track = { title : '', artist : '', mpeg : '', ogg : '' };
				var mock = this.getChildById( 'mock-track' ), 
					audiotracks = this.getChildById( 'audiotracks' ),
					classPrefix = 'audiotrack-' + $n + '-';
				mock.getChildById( 'tracknumber' ).$node().attr( 'class', classPrefix + 'tracknumber' );
				mock.getChildById( 'title' ).$node().attr( 'class', classPrefix + 'title' );
				mock.getChildById( 'artist' ).$node().attr( 'class', classPrefix + 'artist' );
				mock.getChildById( 'mpeg' ).$node().attr( 'class', classPrefix + 'mpeg' );
				mock.getChildById( 'ogg' ).$node().attr( 'class', classPrefix + 'ogg' );
				mock.getChildById( 'add' ).$node().attr( 'class', classPrefix + 'add' );
				mock.getChildById( 'remove' ).$node().attr( 'class', classPrefix + 'remove' );
				mock.getChildById( 'add' ).$node().attr( 'trackno', $n );
				mock.getChildById( 'remove' ).$node().attr( 'trackno', $n );
				mock.getChildById( 'tracknumber' ).$node().html( 'Track ' + $n );
				mock.getChildById( 'title' ).$node().attr( 'value', $track.title );
				mock.getChildById( 'artist' ).$node().attr( 'value', $track.artist );
				mock.getChildById( 'mpeg' ).$node().attr( 'value', $track.mp3 );
				mock.getChildById( 'ogg' ).$node().attr( 'value', $track.oga );
				audiotracks.$node().append( mock.$node().html() );
				eventDispatcher.bind( audiotracks.$node().find( '.' + classPrefix + 'add' ), 'click', 'properties.jplayer-audiolist.add' );
				eventDispatcher.bind( audiotracks.$node().find( '.' + classPrefix + 'remove' ), 'click', 'properties.jplayer-audiolist.remove' );
			}
		},
		statics : {
			create : function() {
				var ns = 'jplayer-audiolist';
				types.serialiser.parse( ns + '.props', props, types.controls.properties.getInstance() );
			}
		}
	} );

} )(jQuery,this);
