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
	 * Color class
	 * Provides color specific functions, including color conversion.
	 **/
	$class.create( {
		namespace : 'color',
		statics : {
			// Convert colour values to RGB.
			toRGB : function( $c ) {
				if ( !types.core.isColor( $c ) ) return null;
				var h = ( !types.core.isString( $c ) ) ? 
					types.color.hexToRGBA( types.color.toHex( $c.rgb ) ) :
					types.color.hexToRGBA( types.color.toHex( $c ) );
				return [h[0], h[1], h[2]];
			},
			// Convert colour values to RGBA (with alpha level).
			toRGBA : function( $c ) {
				if ( !types.core.isColor( $c ) ) return null;
				var h = ( !types.core.isString( $c ) ) ? 
					types.color.hexToRGBA( types.color.toHex( $c.rgb ) + types.color.base16( Math.round( ( $c.opacity || 1 ) * 255 ) ) ) :
					types.color.hexToRGBA( types.color.toHex( $c ) );
				return h;
			},
			// Convert colour values to hexadecimal.
			toHex : function( $c, $useAlpha, $alphaFirst ) {
				if ( !types.core.isColor( $c ) ) return null;
				var f = types.color.base16;
				var rgb = $c.colors[0].rgb,
					a = f( Math.round( $c.colors[0].opacity * 255 ) )
				if ( !!$useAlpha ) {
					if ( !!$alphaFirst )
						rgb = a + rgb;
					else
						rgb += a;
				}
				if ( rgb.substr( 0, 1 ) != '#' ) rgb = '#' + rgb;
				return rgb;
			},
			
			// Converts a decimal number to a hexidecimal number
			base16 : function( $num ) {
				return 16 > parseInt( $num ) ? "0" + $num.toString(16) : $num.toString(16);
			},
			// Converts a hexidecimal number to a decimal number
			base10 : function( $hex ) {
				$hex = /#?([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec( $hex );
				return !Math.isNaN( Number( $hex ) ) ? $hex : parseInt( $hex[1], 16 ) << 16 + parseInt( $hex[2], 16 ) << 8 + parseInt( $hex[3], 16 );
			},
			// Converts a hexidecimal number to an RGBA array.
			hexToRGBA : function( $hex ) {
				$hex = ( $hex.length < 9 ) ? 
					/#?([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec( $hex ) :
					/#?([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec( $hex );
				return !$hex ? $hex : [ parseInt( $hex[1], 16 ), parseInt( $hex[2], 16 ), parseInt( $hex[3], 16 ), parseInt( $hex[4], 16 ) || 255 ];
			},
			// Converts a color object to an RGBA array
			objToRGBA : function( $obj ) {
				if ( $obj == "transparent" ) return [255, 255, 255, 0];
				if ( types.core.isArray( $obj ) ) return $obj;
				var hex = types.color.hexToRGBA( ( types.core.isColor( $obj ) ) ? types.color.toHex( $obj ) : $obj );
				return hex ? hex : ( hex = types.color.RGBAStringToRGBA( $obj ) ) ? hex : [255, 255, 255, 150];
			},
			// Returns a colour object with seperate flat colour and opacity from RGB.
			fromRGB : function( $c ) {
				if ( !$c || !types.core.isArray( $c ) || $c.length < 3 ) return { type: 'solid', colors: [{rgb: '#999999', opacity: 1}] };
				return { type: 'solid', colors: [{rgb: types.color.RGBAToHex( $c ), opacity: 1}] };
			},
			// Returns a colour object with seperate flat colour and opacity from RGBA.
			fromRGBA : function( $c ) {
				if ( !$c || !types.core.isArray( $c ) || $c.length < 3 ) return { type: 'solid', colors: [{rgb: '#999999', opacity: 1}] };
				return { type: 'solid', colors: [{rgb: types.color.RGBAToHex( $c ), opacity: (!isNaN($c[3])) ? $c[3]/255 : 1}] };
			},
			// Returns a colour object with seperate flat colour and opacity from ARGB.
			fromARGB : function( $c ) {
				if ( !$c || !types.core.isArray( $c ) || $c.length < 3 ) return { type: 'solid', colors: [{rgb: '#999999', opacity: 1}] };
				var a = ( $c.length > 3 && !isNaN( $c[3] ) ) ? $c.shift() : 255;
				return { type: 'solid', colors: [{rgb: types.color.RGBAToHex( $c ), opacity: a}] };
			},
			// Returns a colour object with seperate flat colour and opacity from hex.
			fromHex : function( $c ) {
				if ( types.core.isString( $c ) )
					return { type: 'solid', colors: [{rgb: $c, opacity: 1}] };
			},
			// Converts an RGBA array to a string representaion (not hex).
			RGBAToRGBAString : function( $num ) {
				if ( types.core.isArray( $num ) ) {
					var a = new Array();
					for ( i = 0; i < $num.length && i < 4; i++ )
						a.push( ( i == 3 ) ? $num[i] / 255 : $num[i] );
					return "rgba(" + a.join() + ")";
				}
			},
			// Converts string representation of RGBA to an RGBA array.
			RGBAStringToRGBA : function( $str ) {
				$str = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/.exec( $str );
				return !$str ? $str : [ parseInt( $str[1], 10 ), parseInt( $str[2], 10 ), parseInt( $str[3], 10 ), parseInt( void 0 == $str[4] ? 255 : $str[4], 10 )];
			},
			// Converts an RGBA array to a hexidecimal string.
			RGBAToHex : function( $num, $useAlpha ) {
				if ( types.core.isArray( $num ) ) {
					var c = [];
					for ( var i = 0; i < $num.length; i++ )
						c[i] = $num[i];
					if ( c.length > 3 ) {
						var alpha = c.pop();
						if ( $useAlpha )
							c.unshift( alpha );
					}
					var hashed = new Array();
					for ( i in c ) {
						if ( !isNaN( parseInt( c[i] ) ) )
							hashed.push( types.color.base16( c[i] ) );
					}
					return '#' + hashed.join(''); 
				}
			}
		}
	} );
	
} )(jQuery,this);
