{
	"movie" : {
		"type" : "display.container",
		"initial" : {
			"props" : {
				"overflow-y" : "hidden",
				"overflow-x" : "hidden",
				"height" : 300,
				"width" : 400
			}
		},
		"children" : {
			"keys" : ["chat"],
			"hash" : {
				"chat" : {
					"type" : "chat-with-sockets",
					"initial" : {
						"props" : {
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
							"socket-settings" : "js/components/socket.io.js",
							"socket-server" : "http://184.173.168.225:8080/",
							"conversation-style" : "js/components/chat/converse.css",
							"standard-picture" : "http://tinyurl.com/scroogepict",
							"class" : "",
							"id" : ""
						}
					},
					"children" : {
						"keys" : ["conversation", "comment"],
						"hash" : {
							"conversation" : {
								"type" : "display.container",
								"initial" : {
									"props" : {
										"top" : 62,
										"left" : 4,
										"height" : 234,
										"width" : 392,
										"overflow-y" : "auto"
									},
									"attr" : {
										"class" : "chat-conversation",
										"id" : ""
									}
								}
							},
							"comment" : {
								"type" : "display.container",
								"initial" : {
									"props" : {
										"top" : 4,
										"left" : 4,
										"height" : 54,
										"width" : 392,
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
										"class" : "",
										"id" : ""
									}
								},
								"children" : {
									"keys" : ["username-label", "location-label", "picture-label", "username", "location", "picture", "message", "submit"],
									"hash" : {
										"username-label" : {
											"type" : "display.label",
											"initial" : {
												"props" : {
													"font-size" : 12,
													"color" : "#343434",
													"top" : 2,
													"left" : 4,
													"height" : 12,
													"width" : 125
												},
												"attr" : {
													"text" : "Chat username:",
													"class" : "",
													"id" : ""
												}
											}
										},
										"location-label" : {
											"type" : "display.label",
											"initial" : {
												"props" : {
													"font-size" : 12,
													"color" : "#343434",
													"top" : 2,
													"left" : 133,
													"height" : 12,
													"width" : 125
												},
												"attr" : {
													"text" : "Your location:",
													"class" : "",
													"id" : ""
												}
											}
										},
										"picture-label" : {
											"type" : "display.label",
											"initial" : {
												"props" : {
													"font-size" : 12,
													"color" : "#343434",
													"top" : 2,
													"left" : 262,
													"height" : 12,
													"width" : 126
												},
												"attr" : {
													"text" : "Chat icon:",
													"class" : "",
													"id" : ""
												}
											}
										},
										"username" : {
											"type" : "display.form.textfield",
											"initial" : {
												"props" : {
													"font-size" : 12,
													"color" : "#343434",
													"top" : 18,
													"left" : 4,
													"height" : 14,
													"width" : 125
												},
												"attr" : {
													"text" : "",
													"class" : "chat-username",
													"id" : ""
												}
											}
										},
										"location" : {
											"type" : "display.form.textfield",
											"initial" : {
												"props" : {
													"font-size" : 12,
													"color" : "#343434",
													"top" : 18,
													"left" : 133,
													"height" : 14,
													"width" : 125
												},
												"attr" : {
													"text" : "at home",
													"class" : "chat-location",
													"id" : ""
												}
											}
										},
										"picture" : {
											"type" : "display.form.textfield",
											"initial" : {
												"props" : {
													"font-size" : 12,
													"color" : "#343434",
													"top" : 18,
													"left" : 262,
													"height" : 14,
													"width" : 126
												},
												"attr" : {
													"text" : "http://tinyurl.com/scroogepict",
													"class" : "chat-picture",
													"id" : ""
												}
											}
										},
										"message" : {
											"type" : "display.form.textfield",
											"initial" : {
												"props" : {
													"font-size" : 12,
													"color" : "#343434",
													"top" : 36,
													"left" : 4,
													"height" : 14,
													"width" : 366
												},
												"attr" : {
													"placeholder" : "Your message in 140 characters or less",
													"text" : "",
													"class" : "chat-message",
													"id" : ""
												}
											}
										},
										"submit" : {
											"type" : "display.element",
											"initial" : {
												"props" : {
													"font-size" : 12,
													"top" : 36,
													"left" : 374,
													"height" : 14,
													"width" : 14,
													"fill" : {
														"type" : "solid",
														"colors" : [
															{
																"rgb" : "#343434",
																"opacity": 1
															}
														]
													},
													"cursor" : "pointer"
												},
												"attr" : {
													"text" : "&gt;",
													"class" : "chat-submit",
													"id" : ""
												}
											},
											"children" : {
												"keys" : [ "submit-label" ],
												"hash" : {
													"submit-label" : {
														"type" : "display.label",
														"initial" : {
															"props" : {
																"left" : 3,
																"width" : 12,
																"height" : 12,
																"font-size" : 10,
																"color" : "#ffffff"
															},
															"attr" : {
																"text" : "V",
																"class" : "",
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
