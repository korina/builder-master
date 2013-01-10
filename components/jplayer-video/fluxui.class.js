/**
 * @author Ed Rogers
 * @contributor Lee Sylvester
 * @copyright Influxis
 **/
 
( function( $ ) {

	var types = $.fn.fluxui.types;
	var fdata = $.fn.fluxui.fdata;
	var assets = $.fn.fluxui.assets;
	var $class = $.fn.fluxui.$class;
	var jplayerInstance;

	/**
	 * JPlayer video component class
	 * JPlayer offers a ready-made and tested way of delivering video to a variety of browsers through HTML5 and Flash.
	 *
	 * Requires;
	 *		./js/fluxui_library/fluxui/controls/components.js
	 **/
	 
	var clazz = $class.create( {
		namespace : 'jplayer-video',
		inherits : types.display.component,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			isContainer : true
		},
		methods : {
			// Load the component's scripts and subsequently build a JPlayer object.
			// To prevent the video from running whilst the user is editing the composition
			// devmode keeps the audio forever paused.
			initialise : function( $id, $descriptor ) {
				var me = this;
				this.video = this.$node().find( '.jp-video .jp-player' );
				this.controls = this.$node().find( '.jp-video .jp-controls' );
				if ( !types.core.devMode ) {
					types.loader.load( 
						[ 
							types.core.serverPath + "js/components/jplayer/jquery.jplayer.min.js", 
							types.core.serverPath + "js/components/jplayer/jplayer.playlist.min.js" 
						], 
						function() {
							me.buildPlayer( $id );
						} 
					)
				}
			},
			// Create a JPlayer object, passing it all the relevent information from the JSON.
			buildPlayer : function( $id ) {
				var me = this;
				this.video.jPlayer({
					ready: function() {
						var s = me.states.getCurrentStateData();
						me.setMedia( s.attr.m4v, s.attr.ogv );
					},
					swfPath : types.core.serverPath + 'js/components/jplayer',
					supplied : 'm4v, ogv',
					wmode : 'window',
					size : {
						width : me.video.width(),
						height : me.video.height()
					},
					cssSelectorAncestor : '[fluxid="' + me.fluxid() + '"]'
				});
				this.video.jPlayer( 'play', 10 );
			},
			// Change the video source files.
			setMedia : function( $m4v, $ogv ) {
				var a = this.states.getCurrentStateData().attr;
				if ( !!$m4v ) this.states.setAttributeOnCurrentState( 'm4v', $m4v );
				if ( !!$ogv ) this.states.setAttributeOnCurrentState( 'ogv', $ogv );
				this.video.jPlayer( 'setMedia', {
					m4v : a.m4v,
					ogv : a.ogv
				} );
			},
			// Binding a permanent 'pause' feature.
			permaPause : function() {
				var me = this;
				this.$node().click( function() { me.video.jPlayer( 'clearMedia' ) } );
			},
		}
	} );
	
} )(jQuery,this);

