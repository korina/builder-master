$(window).load(function () {
	$().fluxui.initialise({
		debug : true
	});
	var movie1 = {
		assets : {
			'face_02.png' : {
				type : 'image',
				url : 'http://lh6.ggpht.com/hfSm3qdWjciLW5_zFJRHT-0UtQZhsX-5J_ubyXwNvIpvRZS5n5EXjya0EKbGTmxWiFf7uOU8c_3u69xwk5ZK1z3U=s80',
				height : 40,
				width : 80
			},
			'face_03.png' : {
				type : 'image',
				url : 'http://lh5.ggpht.com/M8WRyxcz3q7T5kImhQH4tJXZ80yu1it3joxdneajfhlSTk9hxfeOWpIes-nz9TdJrXzQuTmVhdyOUgIg8Or35vJx=s80',
				height : 40,
				width : 80
			},
			'mountain.png' : {
				type : 'image',
				url : 'http://lh5.ggpht.com/VhpNxvK6GbFXIR6vt14jur_oVMggx7eLDviF6Lq0hpKfgRQiGcd1ol_m30mSrk5A35FpIGUbJ_CRTZIemsfPbz8s=s170',
				height : 170,
				width : 140
			},
			'face_01.png' : {
				type : 'image',
				url : 'http://lh5.ggpht.com/nnywc4-8IYg7UtRlr-s8l6AiAHUNQ6AGiwi1-hKfILApQTsB69kD9Q-6Jr66_xS6NKfSrGCzpodmgTJZLPOeMg=s80',
				height : 40,
				width : 80
			},
			'face_06.png' : {
				type : 'image',
				url : 'http://lh4.ggpht.com/oQgevVlV2PY94OKp35uHndnhMF1FJkoabbrXi6HxxBvC7QcW22GAc_-s3flBVZlX8gH45D3yBqWzeBrac87XWnU=s80',
				height : 40,
				width : 80
			},
			'face_04.png' : {
				type : 'image',
				url : 'http://lh5.ggpht.com/UXAc-ovpzGWCMKuKLWdxdSHvxoVX_7ndznRIF14nVge9Mliwewy8j1k61dX3qDUpPSbIy4ubewY1iWxLmgtH9Q=s80',
				height : 40,
				width : 80
			},
			'face_05.png' : {
				type : 'image',
				url : 'http://lh6.ggpht.com/-_XoZJAwebc3-CuuOj7Pcc2r2dtwfqUtNl8ARGice-6wYvfGBmGNxdEZ2hErs1m621eW9PpM17Odo_EHnvjgmw=s80',
				height : 40,
				width : 80
			},
			'2123773ed57ubrzo1.gif' : {
				type : 'image',
				url : 'http://lh3.ggpht.com/u_YgKcmKxBybLDl8Ka3spKLSk1TrsPxhMWRWa5VeHENhMeHW6fQclNtuoyC7r8AXQEMJqCXLhcP5isiP4paebQ=s90',
				height : 90,
				width : 90
			},
			'rocket_launch.png' : {
				type : 'image',
				url : 'http://lh4.ggpht.com/gSiqD6rWYYSCjFS_7491dD6sQfYLIZn1MySNHlhGVIZPzE-F0WfU5SiI-SCJN3DoP14l58OSa7bqCJEHJ5Tjc5k=s155',
				height : 151,
				width : 155
			},
			'sun.png' : {
				type : 'image',
				url : 'http://lh5.ggpht.com/os_yYRygush_fHtA5BINO8AOQZAol_8wXJ-Rhm3vtNogKvE3UP2XH4um6xL3uGBinuJvJwap7u9vL977ZO7WW7o=s151',
				height : 151,
				width : 151
			},
			'rocket.png' : {
				type : 'image',
				url : 'http://lh4.ggpht.com/sU2ywvHHFWw8kdSw3QGaiJ3_fG1vxdRFFEq8IziPtSuSsdDt1nJEOuhfXWXhAKKEBnynfq91DHJVbAZxx_dqzg=s141',
				height : 141,
				width : 96
			},
			'grass.png' : {
				type : 'image',
				url : 'http://lh4.ggpht.com/Rn9MF2JIb4ipTms1Lta54r7F0Pzz39BrYd_RQE3lvHwvwoSKXh33bVwztuAfa31HGIRd5RnCQMb21gAJmhbAaUqw=s1280',
				height : 122,
				width : 1280
			},
			'cloud.png' : {
				type : 'image',
				url : 'http://lh6.ggpht.com/AlD5ipr4N_Pb7GeBXxJxpNpwiav_pDlamk0ey354inqis1BjHKi7mxd5M1_QHjnnA3myjIq7a85RJBTRzJL1sxcS=s110',
				height : 77,
				width : 110
			},
			'arrow_previous.png' : {
				type : 'image',
				url : 'http://lh6.ggpht.com/RAJH3gaQpj7Y8h92-zkXtasWqdrP7U4BW_H4xgT_aDnTGrdDzLuMLfkyYY1odU0UVINFSm3sLUXP-Vc6dtsgaMI=s100',
				height : 100,
				width : 40
			},
			'sign.png' : {
				type : 'image',
				url : 'http://lh6.ggpht.com/HqThwy88ssVx6JfdTjwMKkdwj1DukjUkVdRlAy-smHC3nHa3pel1JAFv7E-P5ALiV2GkTGaj2UbgNU-IK8yt65A=s240',
				height : 190,
				width : 240
			},
			'seattle.png' : {
				type : 'image',
				url : 'http://lh6.ggpht.com/k5dW3BgcHX81uiiKqgxRXsVUXQHN1UJQq-Tlxmr0t9x23jv282xEVkf3egdVzwm-hCIwu8ikXBsAhqzGU1w71IfU=s453',
				height : 185,
				width : 453
			},
			'text.png' : {
				type : 'image',
				url : 'http://lh3.ggpht.com/KLyMajXG1hF7PbpiIgjYaVVtFhyR6AHQuz3-3buMg1QRY8B5bQHxTPJvUeYU-Jv7dC766aGnfeN6KxP1Kmoijw=s1280',
				height : 85,
				width : 1280
			},
			'arrow_next.png' : {
				type : 'image',
				url : 'http://lh5.ggpht.com/clKfPNEIAXLL6x3u-Ryyj39Ylbo4zT2iDmaKpj_v1U4OagDnwhypsKQXjIAq5yPsIyQJINKxc1Ig6DXGQCrRyAA=s100',
				height : 100,
				width : 40
			}
		},
		library : {
			'button previous' : {
				type : 'formSubmit',
				states : {
					_default : {
						props : {
							'overflow-y' : 'hidden',
							'overflow-x' : 'hidden',
							height : 100,
							width : 40,
							'background-color' : { rgb : '#ffffff', opacity : 0 }
						},
						frames : {
							keys : ['_default', '_over', '_down', '_selected'],
							hash : {
								_over : {},
								_default : {},
								_down : {},
								_selected : {}
							}
						},
						children : {
							keys : ['child_1'],
							hash : {
								child_1 : {
									types : 'image',
									states : {
										_over : {
											props : {
												opacity : 1
											}
										},
										_default : {
											src : 'arrow_previous.png',
											props : {
												opacity : .5,
												top : 0,
												height : 100,
												width : 40,
												left : 0
											}
										},
										_down : {
											props : {
												opacity : 1,
												top : 0,
												left : -5
											}
										}
									}
								}
							}
						}
					}
				}
			},
			button : {
				type : 'button',
				states : {
					_default : {
						props : {
							'overflow-y' : 'hidden',
							'overflow-x' : 'hidden',
							height : 20,
							width : 100,
							'background-color' : { rgb : '#ffffff', opacity : 0 }
						},
						frames : {
							keys : ['_default', '_over', '_down', '_selected'],
							hash : {
								_over : {},
								_default : {},
								_down : {},
								_selected : {}
							}
						}
					}
				}
			},
			'button next' : {
				type : 'button',
				states : {
					_default : {
						props : {
							'overflow-y' : 'hidden',
							'overflow-x' : 'hidden',
							height : 100,
							width : 40,
							'background-color' : { rgb : '#ffffff', opacity : 0 }
						},
						frames : {
							keys : ['_default', '_over', '_down', '_selected'],
							hash : {
								_over : {},
								_default : {},
								_down : {
									transition : {
										duration : 0,
										easing : 'linearTween',
										after : 'stop'
									}
								},
								_selected : {}
							}
						},
						children : {
							keys : ['child_1'],
							hash : {
								child_1 : {
									type : 'image',
									states : {
										_over : {
											props : {
												opacity : 1
											}
										},
										_default : {
											src : 'arrow_next.png',
											props : {
												opacity : .5,
												top : 0,
												height : 100,
												width : 40,
												left : 0
											}
										},
										_down : {
											props : {
												opacity : 1,
												top : 0,
												left : 5
											}
										}
									}
								}
							}
						}
					}
				}
			}
		},
		movie : {
			states : {
				_default : {
					props : {
						'overflow-y' : 'hidden',
						'overflow-x' : 'hidden',
						top : 0,
						left : 0,
						height : 480,
						width : 320,
						'background-color' : {
							r : 255,
							g : 255,
							b : 255,
							a : 1
						}
					},
					frames : {
						keys : ['_default', 'frame_1', 'frame_2', 'frame_3'],
						hash : {
							frame_1 : {},
							_default : {},
							frame_2 : {},
							frame_3 : {}
						}
					},
					children : {
						keys : ['child_1', 'child_8', 'child_4', 'child_10', 'child_2', 'child_3', 'child_5', 'child_7', 'child_9', 'child_12', 'child_14', 'child_17', 'child_18', 'child_19', 'child_21', 'child_6', 'child_13', 'child_26', 'child_16', 'child_22', 'child_23', 'child_25', 'child_27', 'child_28'],
						hash : {
							child_8 : {
								type : 'image',
								states : {
									frame_1 : {
										props : {
											top : 220,
											left : 507
										}
									},
									_default : {
										src : 'seattle.png',
										props : {
											height : 185,
											width : 453,
											top : 220,
											left : 827
										}
									},
									frame_2 : {
										props : {
											top : 220,
											left : 187
										}
									},
									frame_3 : {
										props : {
											top : 220,
											left : -133
										}
									}
								}
							},
							child_9 : {
								type : 'image',
								states : {
									frame_1 : {
										props : {
											top : 240,
											left : 40
										}
									},
									_default : {
										src : 'sign.png',
										props : {
											height : 190,
											width : 240,
											top : 240,
											left : 360
										}
									},
									frame_2 : {
										props : {
											top : 240,
											left : -280
										}
									},
									frame_3 : {
										props : {
											top : 240,
											left : -600
										}
									}
								}
							},
							child_4 : {
								type : 'image',
								states : {
									frame_1 : {
										props : {
											top : 246,
											left : -280
										}
									},
									_default : {
										src : 'rocket.png',
										props : {
											height : 141,
											width : 96,
											top : 246,
											left : 40
										}
									},
									frame_2 : {
										props : {
											top : 246,
											left : -600
										}
									},
									frame_3 : {
										props : {
											top : 246,
											left : -920
										}
									}
								}
							},
							child_5 : {
								type : 'image',
								states : {
									frame_1 : {
										props : {
											top : -20,
											left : -40
										}
									},
									_default : {
										src : 'sun.png',
										props : {
											height : 151,
											width : 151,
											top : -30,
											left : 220
										}
									},
									frame_2 : {
										props : {
											top : -20,
											left : 210
										}
									},
									frame_3 : {
										props : {
											top : -40,
											left : -160
										}
									}
								}
							},
							child_6 : {
								type : 'image',
								states : {
									frame_1 : {
										props : {
											top : 60,
											left : 205
										}
									},
									_default : {
										src : 'cloud.png',
										props : {
											height : 77,
											width : 110,
											top : 60,
											left : 320
										}
									},
									frame_2 : {
										props : {
											top : 70,
											left : 5
										}
									},
									frame_3 : {
										props : {
											top : 60,
											left : -135
										}
									}
								}
							},
							child_7 : {
								type : 'image',
								states : {
									frame_1 : {
										props : {
											top : 10,
											left : -310
										}
									},
									_default : {
										src : 'cloud.png',
										props : {
											height : 77,
											width : 110,
											top : 10,
											left : 10
										}
									},
									frame_2 : {
										props : {
											top : 10,
											left : -630
										}
									},
									frame_3 : {
										props : {
											top : 10,
											left : -950
										}
									}
								}
							},
							child_1 : {
								type : 'element',
								states : {
									frame_1 : {
										props : {
											top : 0,
											left : -320
										}
									},
									_default : {
										props : {
											height : 480,
											width : 1280,
											top : 0,
											left : 0,
											fill : {
												colors : [
													{
														rgb : '#d0fffe',
														opacity : 1
													},
													{
														rgb : '#ffffff',
														opacity : 0
													},
												],
												type : 'linear'
											}
										}
									},
									frame_2 : {
										props : {
											top : 0,
											left : -640
										}
									},
									frame_3 : {
										props : {
											top : 0,
											left : -960
										}
									}
								}
							},
							child_2 : {
								type : 'image',
								states : {
									frame_1 : {
										props : {
											top : 358,
											left : -320
										}
									},
									_default : {
										src : 'grass.png',
										props : {
											height : 122,
											width : 1280,
											top : 358,
											left : 0
										}
									},
									frame_2 : {
										props : {
											top : 358,
											left : -640
										}
									},
									frame_3 : {
										props : {
											top : 358,
											left : -960
										}
									}
								}
							},
							child_3 : {
								type : 'image',
								states : {
									frame_1 : {
										props : {
											top : 160,
											left : -320
										}
									},
									_default : {
										src : 'text.png',
										props : {
											height : 85,
											width : 1280,
											top : 160,
											left : 0
										}
									},
									frame_2 : {
										props : {
											top : 160,
											left : -640
										}
									},
									frame_3 : {
										props : {
											top : 160,
											left : -960
										}
									}
								}
							},
							child_16 : {
								type : 'textarea',
								states : {
									frame_1 : {
										props : {
											top : 250,
											left : 60
										}
									},
									_default : {
										text : '<script src="https ://rocketui.com/embed/55001"></script> <div class="ruitarget_55001"></div>',
										props : {
											'font-size' : 12,
											top : 250,
											'border-width' : 0,
											height : 120,
											padding : '10',
											width : 200,
											'text-align' : 'center',
											'font-family' : 'arial',
											'line-height' : 20,
											left : 380
										}
									},
									frame_2 : {
										props : {
											top : 250,
											left : -270
										}
									},
									frame_3 : {
										props : {
											top : 250,
											left : -590
										}
									}
								},
							},
							child_14 : {
								type : 'image',
								states : {
									frame_1 : {
										src : 'face_01.png',
										props : {
											top : 75,
											left : 20
										}
									},
									_default : {
										src : 'face_03.png',
										props : {
											height : 40,
											width : 80,
											top : 60,
											left : 240
										}
									},
									frame_2 : {
										src : 'face_05.png',
										props : {
											top : 60,
											left : 220
										}
									},
									frame_3 : {
										props : {
											top : 60,
											left : -120
										}
									}
								}
							},
							child_12 : {
								type : 'image',
								states : {
									frame_1 : {
										props : {
											top : 50,
											left : -280
										}
									},
									_default : {
										src : 'face_01.png',
										props : {
											height : 40,
											width : 80,
											top : 50,
											left : 40
										}
									},
									frame_2 : {
										props : {
											top : 50,
											left : -600
										}
									},
									frame_3 : {
										props : {
											top : 50,
											left : -920
										}
									}
								}
							},
							child_13 : {
								type : 'image',
								states : {
									frame_1 : {
										src : 'face_03.png',
										props : {
											top : 100,
											height : 40,
											width : 80,
											left : 210
										}
									},
									_default : {
										src : 'face_05.png',
										props : {
											height : 40,
											width : 80,
											top : 100,
											left : 335
										}
									},
									frame_2 : {
										src : 'face_04.png',
										props : {
											top : 110,
											left : 30
										}
									},
									frame_3 : {
										props : {
											top : 100,
											left : -130
										}
									}
								}
							},
							child_10 : {
								type : 'image',
								states : {
									frame_1 : {
										props : {
											top : 310,
											left : 300
										}
									},
									_default : {
										src : 'mountain.png',
										props : {
											height : 170,
											width : 140,
											top : 250,
											left : 620
										}
									},
									frame_2 : {
										props : {
											top : 250,
											left : 10
										}
									},
									frame_3 : {
										props : {
											top : 250,
											left : -150
										}
									}
								}
							},
							child_18 : {
								type : 'image',
								states : {
									frame_1 : {},
									_default : {
										src : 'cloud.png',
										props : {
											height : 77,
											width : 110,
											top : 20,
											left : 490
										}
									},
									frame_2 : {
										props : {
											top : 60,
											left : 490
										}
									},
									frame_3 : {
										props : {
											top : 70,
											left : 200
										}
									}
								}
							},
							child_19 : {
								type : 'image',
								states : {
									frame_1 : {},
									_default : {
										src : 'face_05.png',
										props : {
											height : 40,
											width : 80,
											top : 50,
											left : 500
										}
									},
									frame_2 : {
										props : {
											top : 90,
											left : 500
										}
									},
									frame_3 : {
										src : 'face_06.png',
										props : {
											top : 100,
											height : 40,
											width : 80,
											left : 210
										}
									}
								}
							},
							child_17 : {
								type : 'image',
								states : {
									frame_1 : {},
									_default : {
										src : '2123773ed57ubrzo1.gif',
										props : {
											height : 90,
											width : 90,
											top : 340,
											left : 370
										}
									},
									frame_2 : {},
									frame_3 : {
										props : {
											top : 340,
											left : 120
										}
									}
								}
							},
							child_23 : {
								type : 'button',
								states : {
									frame_1 : {
										props : {
											top : 152,
											left : 0
										}
									},
									_default : {
										props : {
											'overflow-y' : 'hidden',
											'overflow-x' : 'hidden',
											top : 152,
											height : 100,
											width : 40,
											'background-color' : { rgb : '#ffffff', opacity : 0 },
											left : -40
										},
										behaviour : {
											click : {
												action : 'gotoPrevState'
											}
										},
										asset : 'button previous',
										frames : {
											keys : ['_default', '_over', '_down', '_selected'],
											hash : {
												_over : {},
												_default : {},
												_down : {},
												_selected : {}
											}
										},
										children : {
											keys : ['child_1'],
											hash : {
												child_1 : {
													type : 'image',
													states : {
														_over : {
															props : {
																opacity : 1
															}
														},
														_default : {
															src : 'arrow_previous.png',
															props : {
																opacity : .5,
																top : 0,
																height : 100,
																width : 40,
																left : 0
															}
														},
														_down : {
															props : {
																opacity : 1,
																top : 0,
																left : -5
															}
														}
													}
												}
											}
										}
									},
									frame_2 : {
										props : {
											top : 152,
											left : 0
										}
									},
									frame_3 : {
										props : {
											top : 152,
											left : 0
										}
									}
								}
							},
							child_22 : {
								type : 'button',
								states : {
									frame_1 : {},
									_default : {
										props : {
											'overflow-y' : 'hidden',
											'overflow-x' : 'hidden',
											top : 152,
											left : 280,
											height : 100,
											width : 40,
											'background-color' : { rgb : '#ffffff', opacity : 0 }
										},
										behaviour : {
											click : {
												action : 'gotoNextState'
											}
										},
										asset : 'button next',
										frames : {
											keys : ['_default', '_over', '_down', '_selected'],
											hash : {
												_over : {},
												_default : {},
												_down : {
													transition : {
														duration : 0,
														easing : 'linearTween',
														after : 'stop'
													}
												},
												_selected : {}
											}
										},
										children : {
											keys : ['child_1'],
											hash : {
												child_1 : {
													type : 'image',
													states : {
														_over : {
															props : {
																opacity : 1
															}
														},
														_default : {
															src : 'arrow_next.png',
															props : {
																opacity : .5,
																top : 0,
																height : 100,
																width : 40,
																left : 0
															}
														},
														_down : {
															props : {
																opacity : 1,
																top : 0,
																left : 5
															}
														}
													}
												}
											}
										}
									},
									frame_2 : {},
									frame_3 : {
										props : {
											top : 152,
											left : 320
										}
									}
								}
							},
							child_21 : {
								type : 'label',
								states : {
									frame_1 : {},
									_default : {
										text : 'Made with Rocket UI',
										props : {
											color : {
												rgb : '#406618',
												opacity : 1
											},
											top : 450,
											height : 30,
											width : 320,
											left : 0,
											'text-align' : 'center'
										}
									},
									frame_2 : {},
									frame_3 : {}
								}
							},
							child_27 : {
								type : 'image',
								states : {
									frame_1 : {},
									_default : {
										src : 'rocket_launch.png',
										props : {
											width : 155,
											top : 190,
											left : -160,
											height : 151
										}
									},
									frame_2 : {},
									frame_3 : {
										props : {
											top : 40,
											left : 0
										}
									}
								}
							},
							child_26 : {
								type : 'element',
								states : {
									_default : {
										props : {
											opacity : 0.1,
											top : 0,
											'border-width' : 1,
											height : 480,
											width : 320,
											left : 0,
											fill : {
												colors : [
													{
														rgb : '#000000',
														opacity : 0.1
													},
													{
														rgb : '#ffffff',
														opacity : 0
													}
													
												],
												type : 'solid'
											}
										}
									},
									frame_1 : {},
									frame_2 : {},
									frame_3 : {}
								}
							},
							child_25 : {
								type : 'button',
								states : {
									frame_1 : {
									},
									_default : {
										props : {
											'overflow-y' : 'hidden',
											'overflow-x' : 'hidden',
											fill : {
												type : 'solid',
												colors : [
													{
														rgb : '#ff11aa',
														opacity : 0.5
													}
												]
											},
											left : 0,
											top : 440,
											height : 40,
											width : 320,
										},
										attr : {
											drag: {
												restraint : 'root_0',
												target : ['child_25', 'child_22'],
												onDrag : 'my.event.for.ondrag',
												onDrop : 'my.event.for.ondrop'
											},
											touch : 'my.event.for.touch',
											swipe : 'my.event.for.swipe'
										},
										asset : 'button',
										frames : {
											keys : ['_default', '_over', '_down', '_selected'],
											hash : {
												_over : {},
												_default : {},
												_down : {},
												_selected : {}
											}
										}
									},
									frame_2 : {},
									frame_3 : {}
								}
							},
							child_28 : {
								type : 'element',
								states : {
									frame_1 : {
										props : {
											top : 0,
											left : 10,
											fill : {
												type : 'solid',
												colors : [
													{
														rgb : '#ddddff',
														opacity : 0.7
													}
												]
											}
										}
									},
									_default : {
										props : {
											top : 50,
											'border-width' : 0,
											height : 120,
											padding : '10',
											width : 200,
											'text-align' : 'center',
											'font-family' : 'arial',
											'line-height' : 20,
											left : 350
										},
										attr : {
											drag: true,
											swipe : 'my.event.for.otherswipe'
										},
										children : {
											keys : ['child_01', 'child_02'],
											hash : {
												'child_01' : {
													type : 'dropdown',
													states : {
														frame_1 : {
															props : {
																top : 0,
																left : 0
															}
														},
														_default : {
															text : 'testGroup',
															formName : 'testForm',
															subElems : ['Option 1', 'Option 2', 'Option 3'],
															subElVals : ['Option1', 'Option2', 'Option3'],
															props : {
																top : 0,
																width : 100,
																left : 0
															},
														},
														frame_2 : {
															props : {
																top : 0,
																left : 0
															}
														},
														frame_3 : {
															props : {
																top : 0,
																left : 0
															}
														}
													}
												},
												'child_02' : {
													type : 'radioGroup',
													states : {
														frame_1 : {
															props : {
																top : 0,
																left : 0
															}
														},
														_default : {
															text : 'testGroup',
															formName : 'testForm',
															subElems : ['Option 1', 'Option 2', 'Option 3'],
															subElVals : ['Option1', 'Option2', 'Option3'],
															props : {
																top : 0,
																width : 100,
																left : 120
															},
														},
														frame_2 : {
															props : {
																top : 0,
																left : 0
															}
														},
														frame_3 : {
															props : {
																top : 0,
																left : 0
															}
														}
													}
												},
											}
										}
									},
									frame_2 : {
										props : {
											top : 50,
											left : 200
										}
									},
									frame_3 : {
										props : {
											top : 0,
											left : 200
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
	$("#movie-container").fluxui(movie1);
});
