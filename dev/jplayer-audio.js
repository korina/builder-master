( function( $ ) {
	
	$().fluxui.initialise( { debug : true } );

	var jplayer = {
		assets : {
			jpaudio1 : {
				m4a:"http://www.jplayer.org/audio/m4a/TSP-01-Cro_magnon_man.m4a",
				oga:"http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg"
			},
			'play.png' : {
				url : 'jplayer_images/play.png',
				height : '28',
				width : '28'
			},
			'pause.png' : {
				url : 'jplayer_images/pause.png',
				height : '28',
				width : '28'
			},
			'stop.png' : {
				url : 'jplayer_images/stop.png',
				height : '28',
				width : '28'
			},
			'loop.png' : {
				url : 'jplayer_images/loop.png',
				height : '26',
				width : '30'
			},
			'unloop.png' : {
				url : 'jplayer_images/unloop.png',
				height : '26',
				width : '30'
			},
			'mute.png' : {
				url : 'jplayer_images/mute.png',
				height : '28',
				width : '28'
			},
			'unmute.png' : {
				url : 'jplayer_images/unmute.png',
				height : '28',
				width : '28'
			}
		},
		library : {},
		movie : {
			initial : {
				props : {
					'overflow-y' : 'hidden',
					'overflow-x' : 'hidden',
					top : 0,
					left : 0,
					height : 600,
					width : 800,
					'border-radius' : 40,
					fill : {
						type : 'solid',
						colors : [
							{ rgb : '#343434',
							opacity: 1 }
						]
					}
				}
			},
			type: 'element',
			children : {
				keys : ['audio-player-simple'],
				hash : {
					'audio-player-simple' : {
						type : 'element',
						initial : {
							props : {
								top : 280,
								height : 40,
								width : 720,
								left : 40,
								'border-radius' : 19
							},
							attr : {
								id : 'jp_container_' + Math.floor(Math.random()*256),
								class : 'jp-audio',
							}
						},
						children : {
							keys : ['controls'],
							hash : {
								'controls' : {
									type : 'element',
									initial : {
										props : {
											height : 40,
											width : 720,
											fill : {
												type : 'linear',
												colors : [
													{
														rgb : '#eeeeee',
														opacity : 0.4
													},
													{
														rgb : '#ffffff',
														opacity: 1
													}
												]
											},
											'border-radius' : 19
										},
										attr : {
											class : 'jp-type-single'
										}
									},
									children : {
										keys : ['player-audio1', 'stop-audio1', 'pause-audio1', 'play-audio1', 'progress-audio1', 'loop-audio1', 'unloop-audio1', 'mute-audio1', 'unmute-audio1', 'volume-audio1'],
										hash : {
											'player-audio1' : {
												type : 'element',
												initial : {
													attr : {
														id : 'jquery_jplayer_' + Math.floor(Math.random()*256),
														class : 'jp-player'
													}
												}
											},
											'stop-audio1' : {
												type : 'image',
												initial : {
													props : {
														top : 6,
														height : 28,
														width : 28,
														left : 6,
														'cursor' : 'pointer',
													},
													attr : {
														class : 'jp-stop',
														src : 'stop.png',
													}
												}
											},
											'pause-audio1' : {
												type : 'image',
												initial : {
													props : {
														top : 6,
														height : 28,
														width : 28,
														left : 40,
														'cursor' : 'pointer',
													},
													attr : {
														class : 'jp-pause',
														src : 'pause.png',
													}
												}
											},
											'play-audio1' : {
												type : 'image',
												initial : {
													props : {
														top : 6,
														height : 28,
														width : 28,
														left : 40,
														'cursor' : 'pointer',
													},
													attr : {
														class : 'jp-play',
														src : 'play.png'
													}
												}
											},
											'progress-audio1' : {
												type : 'element',
												initial : {
													props : {
														top : 7,
														left : 76,
														height : 26,
														width : 461,
														'border-radius' : 14,
														'cursor' : 'pointer',
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#efefef',
																	opacity: 1
																}
															]
														},
													},
													attr : {
														class : 'jp-progress'
													}
												},
												children : {
													keys : ['seek-bar-audio1', 'current-time-audio1', 'duration-audio1'],
													hash : {
														'seek-bar-audio1' : {
															type : 'element',
															initial : {
																props : {
																	height : 26,
																	width : 461
																},
																attr : {
																	class : 'jp-seek-bar'
																}
															},
															children : {
																keys : ['play-bar-audio1'],
																hash : {
																	'play-bar-audio1' : {
																		type : 'element',
																		initial : {
																			props : {
																				height : 26,
																				'border-radius' : 14,
																				fill : {
																					type : 'solid',
																					colors : [
																						{ rgb : '#343434',
																						opacity: 1 }
																					]
																				}
																			},
																			attr : {
																				class : 'jp-play-bar'
																			}
																		}
																	}
																}
															}
														},
														'current-time-audio1' : {
															type : 'label',
															initial : {
																props : {
																	top : 8,
																	left: 10,
																	'font-size' : 11,
																	'font-weight' : 'bold',
																	'line-height' : 11,
																	color : '#dd00aa'
																},
																attr : {
																	class : 'jp-current-time'
																}
															}
														},
														'duration-audio1' : {
															type : 'label',
															initial : {
																props : {
																	top : 8,
																	left : 424,
																	'font-size' : 11,
																	'font-weight' : 'bold',
																	'line-height' : 11,
																	color : '#dd00aa'
																},
																attr : {
																	class : 'jp-duration'
																}
															}
														}
													}
												}
											},
											'loop-audio1' : {
												type : 'image',
												initial : {
													props : {
														top : 7,
														height : 26,
														width : 30,
														left : 543,
														'cursor' : 'pointer'
													},
													attr : {
														src : 'loop.png',
														class : 'jp-repeat'
													}
												}
											},
											'unloop-audio1' : {
												type : 'image',
												initial : {
													props : {
														top : 7,
														height : 26,
														width : 30,
														left : 543,
														'cursor' : 'pointer',
													},
													attr : {
														class : 'jp-repeat-off',
														src : 'unloop.png',
													}
												}
											},
											'mute-audio1' : {
												type : 'image',
												initial : {
													props : {
														top : 6,
														height : 28,
														width : 28,
														left : 578,
														'cursor' : 'pointer',
													},
													attr : {
														src : 'mute.png',
														class : 'jp-mute'
													}
												}
											},
											'unmute-audio1' : {
												type : 'image',
												initial : {
													props : {
														top : 6,
														height : 28,
														width : 28,
														left : 578,
														'cursor' : 'pointer',
													},
													attr : {
														src : 'unmute.png',
														class : 'jp-unmute'
													}
												}
											},
											'volume-audio1' : {
												type : 'element',
												initial : {
													props : {
														top : 7,
														left : 612,
														height : 26,
														width : 100,
														'border-radius' : 14,
														'cursor' : 'pointer',
														fill : {
															type : 'solid',
															colors : [
																{ rgb : '#efefef',
																opacity: 1 }
															]
														}
													},
													attr : {
														class : 'jp-volume-bar'
													}
												},
												children : {
													keys : ['set-volume-audio1'],
													hash : {
														'set-volume-audio1' : {
															type : 'element',
															initial : {
																props : {
																	height : 26,
																	'border-radius' : 14,
																	fill : {
																		type : 'solid',
																		colors : [
																			{ rgb : '#343434',
																			opacity: 1 }
																		]
																	}
																},
																attr : {
																	class : 'jp-volume-bar-value'
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
	$.fn.fluxui.evt().addListener( 'app.loaded', function() {
		var data = $('#movie-container').fluxui( jplayer );
		// Architypal single audio track player
		var containerId = '#' + jplayer.movie.children.hash['audio-player-simple'].initial.attr.id;
		var playerId = '#' + jplayer.movie.children.hash['audio-player-simple'].children.hash.controls.children.hash['player-audio1'].initial.attr.id;
		$( playerId ).jPlayer({
			ready: function (event) {
				$(this).jPlayer('setMedia', {
					m4a : jplayer.assets.jpaudio1.m4a,
					oga : jplayer.assets.jpaudio1.oga
				});
			},
			swfPath : 'js',
			supplied : 'm4a, oga',
			wmode : 'window',
			cssSelectorAncestor : containerId
		});
	} );
} )(jQuery);
	
