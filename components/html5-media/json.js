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
			"keys" : [ "media" ],
			"hash" : {
				"media" : {
					"type" : "html5-media",
					"initial" : {
						"props" : {
							"width" : 400,
							"height" : 300,
							"overflow" : "visible"
						},
						"attr" : {
							"media-type" : "video",
							"mpeg" : "http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v",
							"ogg" : "http://www.jplayer.org/video/ogv/Big_Buck_Bunny_Trailer.ogv",
							"flash-player" : "",
							"flash-vars" : "",
							"class" : "",
							"id" : ""
						}
					}
				}
			}
		}
	}
}
