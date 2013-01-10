{
	"movie" : {
		"type" : "display.container",
		"initial" : {
			"props" : {
				"width" : 400,
				"height" : 300
			}
		},
		"children" : {
			"keys" : [ "sketch" ],
			"hash" : {
				"sketch" : {
					"type" : "social-sketching",
					"initial" : {
						"props" : {
							"width" : 400,
							"height" : 300
						},
						"attr" : {
							"id" : "social-sketch",
							"brush-color" : "random",
							"brush-size" : 8,
							"rub-color" : "rgba(255,255,255,0.4)",
							"rub-size" : 25,
							"rub-key" : 16,
							"socket-settings" : "js/components/social-sketch/socket.io.js",
							"socket-server" : "http://184.173.168.225:8080/"
						}
					}
				}
			}
		}
	}
}
