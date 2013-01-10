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
	 * Image class
	 * Provides for the HTML img tag
	 *
	 * Requires:
	 *		element.js
	 **/
	var clazz = $class.create( {
		namespace : 'display.image',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			markup : '<img />'
		},
		props : {
			border : 'none'
		},
		methods : {
			// Sets the image source location
			src : function( $t ) {
				if ( !!$t ) {
					if ($t.search('http') == -1 ) $t = types.core.serverPath + $t;
					this.$node().attr( 'src', $t );
				}
				return this.$node().attr( 'src' );
			},
			initialise : function() {
				this.clearSrc();
			},
			
			// Updates attributes' values, prepending the server path if the src path value is relative.
			attribute : function( attr, value, updateState ) {
				if ( !!value ) {
					if ( !!updateState ) {
						if ( attr == 'src' && value.search('http') == -1 ) value = types.core.serverPath + value;
						this.states.setAttributeOnCurrentState( attr, value );
					}
					if ( attr == 'src' ) {
						if ( !!assets[value] ) {
							if ( assets[value].url.search('http') == -1 ) assets[value].url = types.core.serverPath + assets[value].url;
							this.$node().attr( attr, assets[value].url );
							if ( assets[value].height ) this.$node().attr( 'height', assets[value].height );
							if ( assets[value].width ) this.$node().attr( 'width', assets[value].width );
						} else this.clearSrc();
					}
					else
						this.$node().attr( attr, value );
				}
				return this.$node().attr( attr );
			},
			style : function( type, prop, updateState ) {
				if ( type == 'fill' ) return; // supress fills...
				return clazz.Super.style.call( this, type, prop, updateState );
			},
			resetSize : function( cb ) {
				var me = this;
				$("<img/>")
					.attr( "src", me.src() )
					.load( function() {
						var w = this.width, h = this.height;
						me.width( w );
						me.height( h );
						if ( !!cb ) cb( w, h );
					} );
			},

			// Uses a preset holding image for images when their src is cleared.
			clearSrc : function() {
				this.src( 'http://placehold.it/' + this.width() + 'x' + this.height() );
			}
		}
	} );
	
} )(jQuery,this);
