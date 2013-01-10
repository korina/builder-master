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
	var jplayerInstance;

	/**
	 * JPlayer audiolist component class
	 * JPlayer offers a ready-made and tested way of delivering an audiolist to a variety of browsers through HTML5 and Flash.
	 *
	 * Requires;
	 *		./js/fluxui_library/fluxui/controls/components.js
	 **/
	
	var clazz = $class.create( {
		namespace : 'jplayer-audiolist',
		inherits : types.display.component,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			isContainer : true
		},
		methods : {
			// Loading all key scripts (may be worth letting the list-items.css be user defined) then creating the JPlayer object.
			// Devmode keeps the audio forever paused whilst editing the composition.
			initialise : function( $id, $descriptor ) {
				var me = this;
				this.player = '[fluxid=' + me.fluxid() + ']';
				this.audio = this.player + ' .jp-player-audio';
				this.controls = this.player + ' .jp-controls-audio';
				types.loader.load(
					[
						types.core.serverPath + "js/components/jplayer/jquery.jplayer.min.js", 
						types.core.serverPath + "js/components/jplayer/jplayer.playlist.min.js", 
						types.core.serverPath + "js/components/jplayer/list-items.css"
					],
					function() {
						me.setPlayer( $id );
					}
				);
			},
			// Creating a JPlayer playlist object then saving the list to atributes.
			setPlayer : function( $id, $list ) {
				var s = this.states.getCurrentStateData(),
					details = { cssSelectorAncestor: this.player };
				if ( !$list ) $list = s.attr.audiolist;
				if ( types.core.devMode == false ) details.jPlayer = this.audio;
				this.jplayerInstance = new jPlayerPlaylist( details, $list, {
					swfPath: types.core.serverPath + "js/components/jplayer",
					supplied: "mp3, oga",
					wmode: "window"
				});
				this.states.setAttributeOnCurrentState( 'audiolist', $list );
				this.applyStateAttributes();
				this.setPlaylist( $list );
			},
			// Setting playlist.
			setPlaylist : function( $list ) {
				this.jplayerInstance.setPlaylist( $list );
			},
			attribute : function( attr, value, updateState ) {
				if ( attr == 'audiolist' ) return "";
				return clazz.Super.attribute.call( this, attr, value, updateState );
			}
		},
		statics : {
			jplayerInstance : {}
		}
	} );
	
} )(jQuery,this);

