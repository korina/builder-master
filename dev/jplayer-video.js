( function( $ ) {
	
	$().fluxui.initialise( { debug : true } );

	var jplayer = {
		assets : {
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
			'film.png' : {
				url : 'jplayer_images/film.png',
				height : '23',
				width : '17'
			},
			'full_screen.png' : {
				url : 'jplayer_images/full_screen.png',
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
			type: 'element',
			initial: {
				props: {
					height : 600,
					width : 800
				}
			},
			children: {
				keys: ['video-player' ],
				hash: {
					'video-player': {
						type : 'jplayer-video',
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
							},
							attr : {
								ogv : "http://mirrorblender.top-ix.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_stereo.ogg",
								mp4 : "http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_surround-fix.avi"
							}
						},
						children : {
							keys : ['video-player-simple'],
							hash : {
								'video-player-simple' : {
									type : 'element',
									initial : {
										props : {
											top : 40,
											height : 520,
											width : 720,
											left : 40,
											'border-radius' : 19,
											fill : {
												type : 'linear',
												colors : [
													{
														rgb : '#ffffff',
														opacity : 0.1
													}
												]
											}
										},
										attr : {
											id : 'jp_container_' + Math.floor(Math.random()*256),
											class : 'jp-video',
										}
									},
									children : {
										keys : ['player-video1', 'controls-video1'],
										hash : {
											'player-video1' : {
												type : 'element',
												initial : {
													props : {
														top: 0,
														height : 480,
														width : 720
													},
													attr : {
														id : 'jquery_jplayer_' + Math.floor(Math.random()*256),
														class : 'jp-player'
													}
												}
											},
											'controls-video1' : {
												type : 'element',
												initial : {
													props : {
														top : 480,
														height : 40,
														width : 720,
														fill : {
															type : 'linear',
															colors : [
																{
																	rgb : '#bbbbbb',
																	opacity: 1
																},
																{
																	rgb : '#ffffff',
																	opacity: 1
																}
															]
														},
														'border-bottom-left-radius' : 19,
														'border-bottom-right-radius' : 19
													}
												},
												children : {
													keys : ['stop-video1', 'pause-video1', 'play-video1', 'progress-video1', 'loop-video1', 'unloop-video1', 'mute-video1', 'unmute-video1', 'volume-video1'],
													hash : {
														'stop-video1' : {
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
																	src : 'stop.png'
																}
															}
														},
														'pause-video1' : {
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
																	src : 'pause.png'
																}
															}
														},
														'play-video1' : {
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
														'progress-video1' : {
															type : 'element',
															initial : {
																props : {
																	top : 7,
																	left : 76,
																	height : 26,
																	width : 461,
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
																	class : 'jp-progress'
																}
															},
															children : {
																keys : ['seek-bar-video1', 'current-time-video1', 'duration-video1'],
																hash : {
																	'seek-bar-video1' : {
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
																			keys : ['play-bar-video1'],
																			hash : {
																				'play-bar-video1' : {
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
																	'current-time-video1' : {
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
																	'duration-video1' : {
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
														'loop-video1' : {
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
																	class : 'jp-repeat',
																	src : 'loop.png'
																}
															}
														},
														'unloop-video1' : {
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
																	src : 'unloop.png'
																}
															}
														},
														'mute-video1' : {
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
																	class : 'jp-mute',
																	src : 'mute.png'
																}
															}
														},
														'unmute-video1' : {
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
																	class : 'jp-unmute',
																	src : 'unmute.png'
																}
															}
														},
														'volume-video1' : {
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
																keys : ['set-volume-video1'],
																hash : {
																	'set-volume-video1' : {
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
				}
			}
		}
	};
	$.fn.fluxui.evt().addListener( 'app.loaded', function() {
		var data = $('#movie-container').fluxui( jplayer );
	} );
} )(jQuery);
	
