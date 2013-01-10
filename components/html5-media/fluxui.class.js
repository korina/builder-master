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

	/**
	 * HTML5 Media class
	 * A drop-in basic HTML5 media player. Controls are those default to the browser viewing it.
	 * This component is based on Video for Everybody by Kroc Camen (http://camendesign.com/code/video_for_everybody).
	 * Kroc's work forms the basis of a variety of other more polished HTML5 video solutions, and would be a good
	 * starting point for Influxis' own custom solution. It includes Flash fallback (needs testing).
	 *
	 * Requires;
	 *		./js/fluxui_library/fluxui/controls/components.js
	 **/
	
	var clazz = $class.create( {
		namespace : 'html5-media',
		inherits : types.display.component,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			isContainer : true,
			// The element used is a DIV to overcome difficulties in applying height and width to the video or audio element (HTML5 or Flash).
			// This way height and width are applied to the containing DIV, which the video or audio element (HTML5 or Flash) will then reference.
			markup : '<div />'
		},
		methods : {
			// In the event that any change is made to the properties of the element on stage then the whole video will be rebuilt.
			// Devmode keeps the video or audio forever paused whilst editing the composition.
			initialise : function( $id, $descriptor ) {
				var me = this;
				me.setMedia();
				this.addListener( 'stage.element.change', function() {
					me.setMedia();
				} )
			},
			// This is where Video For Everybody is rebuilt by FluxUI. Of particular 
			// importance is the order of preference and compatibility Kroc
			// set out. Examples; using source sub elements, as opposed to
			// attributes, has wider browser support; Mpeg has to come first
			// for iOS3; certain Internet Explorer versions require the first
			// param Flash sub element, where as most browsers relying on the
			// fallback don't. Now that Firefox 3.6 has finally fallen off the
			// usage charts we will probably switch to the WebM rather than Ogg
			// format soon.
			setMedia : function( $mediaType, $mpeg, $ogg, $flash, $flashvars ) {

				// Applying passed values to the attributes and back again. Checks for absolute paths, adding the server path if absent.
				if ( !!$mediaType ) this.states.setAttributeOnCurrentState( 'media-type', $mediaType );
				if ( !!$mpeg ) {
					if ( $mpeg.search('http') == -1 ) $mpeg = types.core.serverPath + $mpeg;
					this.states.setAttributeOnCurrentState( 'mpeg', $mpeg );
				}
				if ( !!$ogg ) {
					if ( $ogg.search('http') == -1 ) $ogg = types.core.serverPath + $ogg;
					this.states.setAttributeOnCurrentState( 'ogg', $ogg );
				}
				if ( !!$flash ) {
					if ( $flash.search('http') == -1 ) $flash = types.core.serverPath + $flash;
					this.states.setAttributeOnCurrentState( 'flash-player', $flash );
				}
				if ( !!$flashvars ) this.states.setAttributeOnCurrentState( 'flash-vars', $flashvars );
				this.applyStateAttributes();
				var s = this.states.getCurrentStateData();
				$mediaType = s.attr['media-type'];
				$mpeg = s.attr.mpeg;
				$ogg = s.attr.ogg;
				$flash = s.attr['flash-player'];
				$flashvars = s.attr['flash-vars'];

				// Defaults for the Flash fallback.
				if ( !$flash || $flash == '' ) {
					if ( $mediaType == 'video' ) $flash = types.core.serverPath + 'js/components/media/videoplayer.swf';
					if ( $mediaType == 'audio' ) $flash = types.core.serverPath + 'js/components/media/audioplayer.swf'
				}
				if ( !$flashvars || $flashvars == '' ) {
					if ( $mediaType === 'video' ) $flashvars = 'controlbar=over&amp;file=' + $mpeg;
					if ( $mediaType === 'audio' ) $flashvars = 'height=' + this.height() + '&amp;showvolume&amp;width=' + this.width() + '&amp;mp3=' + $mpeg
				}

				// Disabling playback in devmode.
				if ( types.core.devMode === true ) var controls =  '" controls onplay="this.pause()"';
				else var controls = '" controls ';

				// Creating the player.
				this.$node().html(
					'<' + $mediaType + ' width="' + this.width() + '" height="' + this.height() + controls + '>' +
						'<source fluxid="mpeg" src="' + $mpeg + '" type="' + $mediaType + '/mpeg" />' + 
						'<source fluxid="ogg" src="' + $ogg + '" type="' + $mediaType + '/ogg" />' + 
						'<object width="' + this.width() + '" height="' + this.height() + '" type="application/x-shockwave-flash" data="' + $flash + '">' +
							'<param name="movie" value="' + $flash + '" />' +
							'<param name="FlashVars" value="' + $flashvars + '" />' + 
						'</object>' +
					'</' + $mediaType + '>'
				)
			},

			// Sets the individual attributes of the media.
			setmediatype : function( $mediaType ) {
				this.setMedia( $mediaType );
			},
			setmpeg : function( $mpeg ) {
				this.setMedia( null, $mpeg );
			},
			setogg : function( $ogg ) {
				this.setMedia( null, null, $ogg );
			},
			setFlash : function( $flash, $flashvars ) {
				this.setMedia( null, null, null, $flash, $flashvars );
			},

			// Check if media is paused.
			isPaused : function() {
				var s = this.states.getCurrentStateData();
				return this.$node()[0].find( s.attr( 'media-type' ) ).paused;
			},
			// Pause media.
			pause : function() {
				var s = this.states.getCurrentStateData();
				return this.$node()[0].find( s.attr( 'media-type' ) ).pause();
			},
			// Play media.
			play : function() {
				var s = this.states.getCurrentStateData();
				return this.$node()[0].find( s.attr( 'media-type' ) ).play();
			},
			// Stop media.
			stop : function() {
				var s = this.states.getCurrentStateData();
				return this.$node()[0].find( s.attr( 'media-type' ) ).stop();
			},
			// Reload media.
			refresh : function() {
				var s = this.states.getCurrentStateData();
				return this.$node()[0].find( s.attr( 'media-type' ) ).load();
			},
			// Gets current time of the playback.
			currentTime : function( $t ) {
				var s = this.states.getCurrentStateData();
				if ( !isNaN( $t ) )
					this.$node()[0].find( s.attr( 'media-type' ) ).currentTime = $t;
				return this.$node()[0].find( s.attr( 'media-type' ) ).currentTime;
			},
			attribute : function( attr, value, updateState ) {
				if ( attr == 'mediatype' || attr == 'mpeg' || attr == 'ogg' || attr == 'flash-player' || attr == 'flash-vars' ) return "";
				return clazz.Super.attribute.call( this, attr, value, updateState );
			}
		}
	} );
	
} )(jQuery,this);
