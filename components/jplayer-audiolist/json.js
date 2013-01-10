{
	"assets" : {
		"play.png" : {
			"url" : "/assets/jplayer_images/controls/play.png",
			"height" : "28",
			"width" : "28"
		},
		"pause.png" : {
			"url" : "/assets/jplayer_images/controls/pause.png",
			"height" : "28",
			"width" : "28"
		},
		"stop.png" : {
			"url" : "/assets/jplayer_images/controls/stop.png",
			"height" : "28",
			"width" : "28"
		},
		"shuffle.png" : {
			"url" : "/assets/jplayer_images/controls/shuffle.png",
			"height" : "20",
			"width" : "28"
		},
		"loop.png" : {
			"url" : "/assets/jplayer_images/controls/loop.png",
			"height" : "26",
			"width" : "30"
		},
		"unloop.png" : {
			"url" : "/assets/jplayer_images/controls/unloop.png",
			"height" : "26",
			"width" : "30"
		},
		"mute.png" : {
			"url" : "/assets/jplayer_images/controls/mute.png",
			"height" : "28",
			"width" : "28"
		},
		"unmute.png" : {
			"url" : "/assets/jplayer_images/controls/unmute.png",
			"height" : "28",
			"width" : "28"
		},
		"left.png" : {
			"url" : "/assets/jplayer_images/icons1/left.png",
			"height" : "28",
			"width" : "28"
		},
		"right.png" : {
			"url" : "/assets/jplayer_images/icons1/right.png",
			"height" : "28",
			"width" : "28"
		}
	},
	"movie" : {
		"type" : "display.container",
		"initial" : {
			"props" : {
				"overflow-y" : "hidden",
				"overflow-x" : "hidden",
				"height" : 304,
				"width" : 400
			}
		},
		"children" : {
			"keys" : ["audio-player-list"],
			"hash" : {
				"audio-player-list" : {
					"type" : "jplayer-audiolist",
					"initial" : {
						"props" : {
							"height" : 304,
							"width" : 400
						},
						"attr" : {
							"id" : "",
							"class" : "jp-audio",
							"audiolist" : [
								{
									"title" :"Cro Magnon Man",
									"artist" :"The Stark Palace",
									"mp3" :"http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3",
									"oga" :"http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg"
								},
								{
									"title" :"Your Face",
									"artist" :"The Stark Palace",
									"mp3" :"http://www.jplayer.org/audio/mp3/TSP-05-Your_face.mp3",
									"oga" :"http://www.jplayer.org/audio/ogg/TSP-05-Your_face.ogg"
								},
								{
									"title" :"Hidden",
									"artist" :"Miaow",
									"mp3" :"http://www.jplayer.org/audio/mp3/Miaow-02-Hidden.mp3",
									"oga" :"http://www.jplayer.org/audio/ogg/Miaow-02-Hidden.ogg"
								},
								{
									"title" :"Tempered Song",
									"artist" :"Miaow",
									"mp3" :"http://www.jplayer.org/audio/mp3/Miaow-01-Tempered-song.mp3",
									"oga" :"http://www.jplayer.org/audio/ogg/Miaow-01-Tempered-song.ogg"
								},
								{
									"title" :"Lentement",
									"artist" :"Miaow",
									"mp3" :"http://www.jplayer.org/audio/mp3/Miaow-03-Lentement.mp3",
									"oga" :"http://www.jplayer.org/audio/ogg/Miaow-03-Lentement.ogg"
								}
							]
						}
					},
					"children" : {
						"keys" : ["playlist-audio2", "controls-audio2"],
						"hash" : {
							"playlist-audio2" : {
								"type" : "display.container",
								"initial" : {
									"attr" : {
										"class" : "jp-playlist",
										"id" : ""
									},
									"props" : {
										"height" : 300,
										"width" : 400,
										"overflow" : "auto"
									}
								},
								"children" : {
									"keys" : ["tracks-audio2"],
									"hash" : {
										"tracks-audio2" : {
											"type" : "display.unorderedList",
											"initial" : {
												"props" : {
													"padding-left" : 20,
													"padding-right" : 20,
													"padding-top" : 18,
													"padding-bottom" : 20,
													"width" : 400,
													"height" : "blank",
													"border-width" : 4,
													"border-top-width" : 45,
													"border-color" : "#343434",
													"border-style" : "solid",
													"color" : "#acacac",
													"list-style-type" : "none",
													"fill" : {
														"type" : "solid",
														"colors" : [
															{
																"rgb" : "#808080"
															}
														]
													}
												},
												"attr" : {
													"class" : "jp-playlist-ul",
													"id" : ""
												}
											}
										}
									}
								}
							},
							"controls-audio2" : {
								"type" : "display.container",
								"initial" : {
									"props" : {
										"height" : 40,
										"width" : 400,
										"fill" : {
											"type" : "linear",
											"colors" : [
												{
													"rgb" : "#bbbbbb",
													"opacity" : 1
												},
												{
													"rgb" : "#ffffff",
													"opacity" : 1
												}
											]
										}
									},
									"attr" : {
										"id" : "",
										"class" : "jp-controls-audio"
									}
								},
								"children" : {
									"keys" : ["player-audio2", "stop-audio2", "pause-audio2", "play-audio2", "progress-audio2", "loop-audio2", "unloop-audio2", "mute-audio2", "unmute-audio2", "volume-audio2"],
									"hash" : {
										"player-audio2" : {
											"type" : "display.container",
											"initial" : {
												"props" : {
													"height" : "20",
													"width" : "20",
													"overflow" : "visible"
												},
												"attr" : {
													"id" : "",
													"class" : "jp-player-audio"
												}
											}
										},
										"stop-audio2" : {
											"type" : "display.image",
											"initial" : {
												"props" : {
													"top" : 6,
													"height" : 28,
													"width" : 28,
													"left" : 6,
													"cursor" : "pointer"
												},
												"attr" : {
													"class" : "jp-stop",
													"src" : "stop.png",
													"id" : ""
												}
											}
										},
										"pause-audio2" : {
											"type" : "display.image",
											"initial" : {
												"props" : {
													"top" : 6,
													"height" : 28,
													"width" : 28,
													"left" : 40,
													"cursor" : "pointer"
												},
												"attr" : {
													"class" : "jp-pause",
													"src" : "pause.png",
													"id" : ""
												}
											}
										},
										"play-audio2" : {
											"type" : "display.image",
											"initial" : {
												"props" : {
													"top" : 6,
													"height" : 28,
													"width" : 28,
													"left" : 40,
													"cursor" : "pointer"
												},
												"attr" : {
													"class" : "jp-play",
													"src" : "play.png",
													"id" : ""
												}
											}
										},
										"progress-audio2" : {
											"type" : "display.container",
											"initial" : {
												"props" : {
													"top" : 7,
													"left" : 76,
													"height" : 26,
													"width" : 141,
													"border-radius" : 14,
													"cursor" : "pointer",
													"fill" : {
														"type" : "solid",
														"colors" : [
															{
																"rgb" : "#efefef",
																"opacity" : 1
															}
														]
													}
												},
												"attr" : {
													"class" : "jp-progress",
													"id" : ""
												}
											},
											"children" : {
												"keys" : ["seek-bar-audio2", "current-time-audio2", "duration-audio2"],
												"hash" : {
													"seek-bar-audio2" : {
														"type" : "display.container",
														"initial" : {
															"props" : {
																"height" : 26,
																"width" : 141
															},
															"attr" : {
																"class" : "jp-seek-bar",
																"id" : ""
															}
														},
														"children" : {
															"keys" : ["play-bar-audio2"],
															"hash" : {
																"play-bar-audio2" : {
																	"type" : "display.container",
																	"initial" : {
																		"props" : {
																			"height" : 26,
																			"width" : 26,
																			"border-radius" : 14,
																			"fill" : {
																				"type" : "solid",
																				"colors" : [
																					{
																						"rgb" : "#343434",
																						"opacity" : 1
																					}
																				]
																			}
																		},
																		"attr" : {
																			"class" : "jp-play-bar",
																			"id" : ""
																		}
																	}
																}
															}
														}
													},
													"current-time-audio2" : {
														"type" : "display.label",
														"initial" : {
															"props" : {
																"top" : 8,
																"left" : 10,
																"font-size" : 11,
																"height" : 12,
																"width" : 36,
																"overflow" : "visible",
																"font-weight" : "bold",
																"line-height" : 11,
																"color" : "#dd00aa"
															},
															"attr" : {
																"class" : "jp-current-time",
																"id" : "",
																"text" : ""
															}
														}
													},
													"duration-audio2" : {
														"type" : "display.label",
														"initial" : {
															"props" : {
																"height" : 12,
																"width" : 36,
																"overflow" : "visible",
																"top" : 8,
																"left" : 104,
																"font-size" : 11,
																"font-weight" : "bold",
																"line-height" : 11,
																"color" : "#dd00aa"
															},
															"attr" : {
																"class" : "jp-duration",
																"id" : "",
																"text" : ""
															}
														}
													}
												}
											}
										},
										"loop-audio2" : {
											"type" : "display.image",
											"initial" : {
												"props" : {
													"top" : 7,
													"height" : 26,
													"width" : 30,
													"left" : 223,
													"cursor" : "pointer"
												},
												"attr" : {
													"class" : "jp-repeat",
													"id" : "",
													"src" : "loop.png"
												}
											}
										},
										"unloop-audio2" : {
											"type" : "display.image",
											"initial" : {
												"props" : {
													"top" : 7,
													"height" : 26,
													"width" : 30,
													"left" : 223,
													"cursor" : "pointer"
												},
												"attr" : {
													"class" : "jp-repeat-off",
													"id" : "",
													"src" : "unloop.png"
												}
											}
										},
										"mute-audio2" : {
											"type" : "display.image",
											"initial" : {
												"props" : {
													"top" : 6,
													"height" : 28,
													"width" : 28,
													"left" : 258,
													"cursor" : "pointer"
												},
												"attr" : {
													"class" : "jp-mute",
													"id" : "",
													"src" : "mute.png"
												}
											}
										},
										"unmute-audio2" : {
											"type" : "display.image",
											"initial" : {
												"props" : {
													"top" : 6,
													"height" : 28,
													"width" : 28,
													"left" : 258,
													"cursor" : "pointer"
												},
												"attr" : {
													"class" : "jp-unmute",
													"id" : "",
													"src" : "unmute.png"
												}
											}
										},
										"volume-audio2" : {
											"type" : "display.container",
											"initial" : {
												"props" : {
													"top" : 7,
													"left" : 292,
													"height" : 26,
													"width" : 100,
													"border-radius" : 14,
													"cursor" : "pointer",
													"fill" : {
														"type" : "solid",
														"colors" : [
															{
																"rgb" : "#efefef",
																"opacity" : 1
															}
														]
													}
												},
												"attr" : {
													"class" : "jp-volume-bar",
													"id" : ""
												}
											},
											"children" : {
												"keys" : ["set-volume-audio2"],
												"hash" : {
													"set-volume-audio2" : {
														"type" : "display.container",
														"initial" : {
															"props" : {
																"height" : 26,
																"width" : 26,
																"border-radius" : 14,
																"fill" : {
																	"type" : "solid",
																	"colors" : [
																		{
																			"rgb" : "#343434",
																			"opacity" : 1
																		}
																	]
																}
															},
															"attr" : {
																"class" : "jp-volume-bar-value",
																"id" : ""
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
