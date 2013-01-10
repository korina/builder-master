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
		"film.png" : {
			"url" : "/assets/jplayer_images/icons2/film.png",
			"height" : "28",
			"width" : "28"
		}
	},
	"movie" : {
		"type": "display.container",
		"initial": {
			"props": {
				"height" : 600,
				"width" : 800
			}
		},
		"children": {
			"keys": ["video-player" ],
			"hash": {
				"video-player": {
					"type" : "jplayer-video",
					"initial" : {
						"props" : {
							"top" : 0,
							"left" : 0,
							"height" : 300,
							"width" : 400,
							"fill" : {
								"type" : "solid",
								"colors" : [
									{
										"rgb" : "#343434",
										"opacity": 1
									}
								]
							}
						},
						"attr" : {
							"m4v" : "http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v",
							"ogv" : "http://www.jplayer.org/video/ogv/Big_Buck_Bunny_Trailer.ogv",
							"id" : "",
							"class" : ""
						}
					},
					"children" : {
						"keys" : ["video-player-simple"],
						"hash" : {
							"video-player-simple" : {
								"type" : "display.container",
								"initial" : {
									"props" : {
										"height" : 300,
										"width" : 400
									},
									"attr" : {
										"id" : "",
										"class" : "jp-video"
									}
								},
								"children" : {
									"keys" : ["player-video1", "controls-video1"],
									"hash" : {
										"player-video1" : {
											"type" : "display.container",
											"initial" : {
												"props" : {
													"top": 4,
													"left" : 4,
													"height" : 252,
													"width" : 392,
													"fill" : {
														"type" : "linear",
														"colors" : [
															{
																"rgb" : "#ffffff",
																"opacity" : 0.1
															}
														]
													}
												},
												"attr" : {
													"id" : "",
													"class" : "jp-player"
												}
											}
										},
										"controls-video1" : {
											"type" : "display.container",
											"initial" : {
												"props" : {
													"top" : 260,
													"height" : 40,
													"width" : 400,
													"fill" : {
														"type" : "linear",
														"colors" : [
															{
																"rgb" : "#bbbbbb",
																"opacity": 1
															},
															{
																"rgb" : "#ffffff",
																"opacity": 1
															}
														]
													}
												},
												"attr" : {
													"id" : "",
													"class" : "jp-controls"
												}
											},
											"children" : {
												"keys" : ["stop-video1", "pause-video1", "play-video1", "progress-video1", "loop-video1", "unloop-video1", "mute-video1", "unmute-video1", "volume-video1"],
												"hash" : {
													"stop-video1" : {
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
																"id" : "",
																"src" : "stop.png"
															}
														}
													},
													"pause-video1" : {
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
																"id" : "",
																"class" : "jp-pause",
																"src" : "pause.png"
															}
														}
													},
													"play-video1" : {
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
																"id" : "",
																"src" : "play.png"
															}
														}
													},
													"progress-video1" : {
														"type" : "display.container",
														"initial" : {
															"props" : {
																"top" : 7,
																"left" : 76,
																"height" : 26,
																"width" : 161,
																"border-radius" : 14,
																"cursor" : "pointer",
																"fill" : {
																	"type" : "solid",
																	"colors" : [
																		{ "rgb" : "#efefef",
																		"opacity": 1 }
																	]
																}
															},
															"attr" : {
																"class" : "jp-progress",
																"id" : ""
															}
														},
														"children" : {
															"keys" : ["seek-bar-video1", "current-time-video1", "duration-video1"],
															"hash" : {
																"seek-bar-video1" : {
																	"type" : "display.container",
																	"initial" : {
																		"props" : {
																			"height" : 26,
																			"width" : 161
																		},
																		"attr" : {
																			"class" : "jp-seek-bar",
																			"id" : ""
																		}
																	},
																	"children" : {
																		"keys" : ["play-bar-video1"],
																		"hash" : {
																			"play-bar-video1" : {
																				"type" : "display.container",
																				"initial" : {
																					"props" : {
																						"height" : 26,
																						"width" : 26,
																						"border-radius" : 14,
																						"fill" : {
																							"type" : "solid",
																							"colors" : [
																								{ "rgb" : "#343434",
																								"opacity": 1 }
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
																"current-time-video1" : {
																	"type" : "display.label",
																	"initial" : {
																		"props" : {
																			"top" : 8,
																			"left": 10,
																			"width" : 36,
																			"height" : 12,
																			"overflow" : "visible",
																			"font-size" : 11,
																			"font-weight" : "bold",
																			"line-height" : 11,
																			"color" : "#dd00aa"
																		},
																		"attr" : {
																			"class" : "jp-current-time",
																			"text" : "00:00",
																			"id" : ""
																		}
																	}
																},
																"duration-video1" : {
																	"type" : "display.label",
																	"initial" : {
																		"props" : {
																			"top" : 8,
																			"left" : 124,
																			"width" : 36,
																			"height" : 12,
																			"overflow" : "visible",
																			"font-size" : 11,
																			"font-weight" : "bold",
																			"line-height" : 11,
																			"color" : "#dd00aa"
																		},
																		"attr" : {
																			"class" : "jp-duration",
																			"text" : "00:00",
																			"id" : ""
																		}
																	}
																}
															}
														}
													},
													"loop-video1" : {
														"type" : "display.image",
														"initial" : {
															"props" : {
																"top" : 7,
																"height" : 26,
																"width" : 30,
																"left" : 243,
																"cursor" : "pointer"
															},
															"attr" : {
																"class" : "jp-repeat",
																"src" : "loop.png",
																"id" : ""
															}
														}
													},
													"unloop-video1" : {
														"type" : "display.image",
														"initial" : {
															"props" : {
																"top" : 7,
																"height" : 26,
																"width" : 30,
																"left" : 243,
																"cursor" : "pointer"
															},
															"attr" : {
																"class" : "jp-repeat-off",
																"id" : "",
																"src" : "unloop.png"
															}
														}
													},
													"mute-video1" : {
														"type" : "display.image",
														"initial" : {
															"props" : {
																"top" : 6,
																"height" : 28,
																"width" : 28,
																"left" : 278,
																"cursor" : "pointer"
															},
															"attr" : {
																"class" : "jp-mute",
																"id" : "",
																"src" : "mute.png"
															}
														}
													},
													"unmute-video1" : {
														"type" : "display.image",
														"initial" : {
															"props" : {
																"top" : 6,
																"height" : 28,
																"width" : 28,
																"left" : 278,
																"cursor" : "pointer"
															},
															"attr" : {
																"class" : "jp-unmute",
																"id" : "",
																"src" : "unmute.png"
															}
														}
													},
													"volume-video1" : {
														"type" : "display.container",
														"initial" : {
															"props" : {
																"top" : 7,
																"left" : 312,
																"height" : 26,
																"width" : 82,
																"border-radius" : 14,
																"cursor" : "pointer",
																"fill" : {
																	"type" : "solid",
																	"colors" : [
																		{ "rgb" : "#efefef",
																		"opacity": 1 }
																	]
																}
															},
															"attr" : {
																"class" : "jp-volume-bar",
																"id" : ""
															}
														},
														"children" : {
															"keys" : ["set-volume-video1"],
															"hash" : {
																"set-volume-video1" : {
																	"type" : "display.container",
																	"initial" : {
																		"props" : {
																			"height" : 26,
																			"width" : 26,
																			"border-radius" : 14,
																			"fill" : {
																				"type" : "solid",
																				"colors" : [
																					{ "rgb" : "#343434",
																					"opacity": 1 }
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
		}
	}
}
