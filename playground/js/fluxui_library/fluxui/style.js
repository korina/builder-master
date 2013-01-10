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
	 * Style class
	 * Provides functions specific to parsing and understanding styles / css values
	 **/
	$class.create( {
		namespace : 'style',
		statics : {
			// Establishes equivalent rotation of elements on different browsers.
			normaliseRotation : function( $angle, $w, $h ) {
				var degToRad = function(angle) { return ((angle*Math.PI) / 180); };
				var radToDeg = function(angle) { return ((angle*180) / Math.PI); };
				
				var rotation = ( $angle >= 0 ) ? Math.PI * $angle / 180 : Math.PI * (360+$angle) / 180;
				var ctheta = Math.cos( rotation );
				var stheta = Math.sin( rotation );
				var v = parseInt( $.browser.version, 10 );
				if ( $.browser.msie && v < 9 ) {
					var dist = function(x1,y1,x2,y2) {
						//find horizontal distance (x)
						var x = x2 - x1;
						//find vertical distance (y)
						var y = y2 - y1;
						//do calculation
						var hyp = Math.sqrt(x*x + y*y);
						return hyp;
					}
					var a = Math.atan2( ( $h / 2 ), ( $w / 2 ) ),
						d = dist( 0, $h, $w / 2, $h / 2 ),
						x = d * Math.cos( ( -a ) + degToRad( $angle ) ),
						y = $h + ( d * Math.sin( ( -a ) + degToRad( $angle ) ) ),
						left = ( $w / 2 ) - x,
						top = $h - y;
					console.log( a + $angle, ' ', left, ' ', top );
					
					return {
						'filter': "progid:DXImageTransform.Microsoft.Matrix(M11=" + ctheta + ",M12=" + (-stheta) + ",M21=" + stheta + ",M22=" + ctheta + ",sizingMethod='auto expand')",
						'-ms-filter': "progid:DXImageTransform.Microsoft.Matrix(M11=" + ctheta + ",M12=" + (-stheta) + ",M21=" + stheta + ",M22=" + ctheta + ",SizingMethod='auto expand')",
						'z-index': 1/*,
						'margin-left': left,
						'margin-top': top*/
					}
				} else {
					return {
						//'-moz-transform-origin': 'left bottom',
						'-moz-transform': 'rotate(' + $angle + 'deg)',  /* FF3.5/3.6 */
						//'-o-transform-origin': 'left bottom',
						'-o-transform': 'rotate(' + $angle + 'deg)',  /* Opera 10.5 */
						//'-webkit-transform-origin': 'left bottom',
						'-webkit-transform': 'rotate(' + $angle + 'deg)',  /* Saf3.1+ */
						//'-ms-transform-origin': 'left bottom',
						'-ms-transform': 'rotate(' + $angle + 'deg)',  /* IE9 */
						//'transform-origin': 'left bottom',
						'transform': 'rotate(' + $angle + 'deg)'  /* Newer browsers */
					}
				}
			},
			// Provides css for border radius for different browser types
			normaliseBorder : function( $size ) {
				return {
					'border-radius' : $size,
					'-moz-border-radius' : $size,
					'-webkit-border-radius' : $size,
					'-khtml-border-radius' : $size
				};
			},
			// Corrects color position values
			normaliseColorPos : function( $colors ) {
				if ( !$colors || !$colors.length ) return null;
				for ( var i = 0; i < $colors.length; i++ ) {
					if ( isNaN( $colors[i].pos ) ) {
						var lastPos = 0;
						if ( $colors.length == 1 ) lastPos = $colors[i].pos = 0;
						else if ( i == $colors.length - 1 ) lastPos = $colors[i].pos = 1;
						else lastPos = $colors[i].pos = ( 1 - lastPos ) / ( $colors.length - ( i - 1 ) ) + lastPos;
					} else lastPos = $colors[i].pos;
				}
			},
			// Provides css for gradient backgrounds for different browser types.
			normaliseFill : function( $fillColor ) {
				$fillColor = types.core.clone( $fillColor );
				var $fillType = $fillColor.type || 'solid', 
					$direction = $fillColor.direction || 270, 
					$colors = $fillColor.colors;
				if ( !isNaN( $direction ) ) $direction = $direction % 360;
				if ( $colors.length == 1 )
					$colors[1] = $colors[0];
				var fromIE_RGBA = types.color.RGBAToHex( types.color.objToRGBA( $colors[0].rgb ), true );
				var toColor = $colors[$colors.length-1].rgb;
				var toIE_RGBA = types.color.RGBAToHex( types.color.objToRGBA( toColor ), true );
				var clrList = '';
				var color = null;
				var grdList = '';
				var grdDir = 'left top, left bottom';
				switch( parseInt( $direction ) ) {
					case 0: // left
						grdDir = 'left top, right top';
						break;
					case 315: // top left
						grdDir = 'left top, right bottom';
						break;
					case 270: // top
						grdDir = 'left top, left bottom';
						break;
					case 225: // top right
						grdDir = 'right top, left bottom';
						break;
					case 180: // right
						grdDir = 'right top, left top';
						break;
					case 135: // bottom right
						grdDir = 'right bottom, left top';
						break;
					case 90: // bottom
						grdDir = 'left bottom, left top';
						break;
					case 45: // bottom left
						grdDir = 'left bottom, right top';
						break;
					default:
						grdDir = 'center center, 0px, center center';
						break;
				}
				$colors.sort( function( a, b ) {
					if ( !a.pos || !b.pos || ( a.pos < b.pos ) )
						return -1;
					else if ( a.pos > b.pos )
						return 1;
					else
						return 0;
				} );
				types.style.normaliseColorPos( $colors );
				for ( var i = 0; i < $colors.length; i++ ) {
					color = types.color.hexToRGBA( $colors[i].rgb );
					if ( !color ) {
						console.log( $colors );
						throw new Error( 'Could not convert color' );
					}
					color[3] = Math.round( $colors[i].opacity * 255 || 255 );
					clrList += types.color.RGBAToRGBAString( color ) + " " + Math.round($colors[i].pos * 100) + "%";
					grdList += "color-stop(" + Math.round($colors[i].pos * 100) + "%" + " " + types.color.RGBAToHex( color ) + ")";
					if ( i < $colors.length - 1 ) {
						clrList += ", ";
						grdList += ", ";
					}
				}
				var ret = {};
				switch ( $fillType ) {
					case 'radial' :
						grdDir = 'center center, 0px, center center';
						ret.background = ["-webkit-radial-gradient(center, ellipse cover, " + clrList + ")"];
						break;
					case 'solid' :
						color = types.color.hexToRGBA( $colors[0].rgb );
						color[3] = $colors[0].opacity * 255 || 255;
						toIE_RGBA = fromIE_RGBA;
						clrList = types.color.RGBAToRGBAString( color ) + " 0%, " + types.color.RGBAToRGBAString( color ) + " 100% ";
						grdList = "color-stop(0%" + " " + types.color.RGBAToHex( color ) + "), color-stop(100%" + " " + types.color.RGBAToHex( color ) + ")";
					default :
						ret.background = ["-webkit-linear-gradient(" + $direction + "deg, " + clrList + ")"];
						break;
				}
				ret.filter = "progid:DXImageTransform.Microsoft.gradient(startColorStr='" + fromIE_RGBA + "', EndColorStr='" + toIE_RGBA + "')";
				ret.background.unshift( "-webkit-gradient(" + ( $direction == 'center' ? 'radial' : 'linear' ) + ", " + grdDir + ", " + grdList + ")" );
				ret.background.push( "-moz-linear-gradient(" + $direction + "deg, " + clrList + ")" );
				ret.background.push( "-ms-linear-gradient(" + $direction + "deg, " + clrList + ")" );
				ret.background.push( "-o-linear-gradient(" + $direction + "deg, " + clrList + ")" );
				ret.background.push( "linear-gradient(" + $direction + "deg, " + clrList + ")" );
				return ret;
			},
			// Gets those properties in $nextProps that are different or not
			// present in $curProps and adds them to $merged.  If differences are found,
			// true is returned, else false.
			getPropertyDiff : function( $curProps, $nextProps, $merged ) {
				var diff = false;
				if ( !$curProps )
					$curProps = {};
				for ( var prop in $nextProps ) {
					if ( $nextProps.hasOwnProperty( prop ) ) {
						if ( !$curProps[prop] && typeof $nextProps[prop] != 'object' ) {
							$merged[prop] = $nextProps[prop];
							diff = true;
							continue;
						}
						if ( typeof $nextProps[prop] === 'object'  ) {
							var obj = {};
							if ( types.style.getPropertyDiff( $curProps[prop], $nextProps[prop], obj ) ) {
								if ( !$merged[prop] ) $merged[prop] = {}
								if ( prop == "fill" )
									$.extend( true, $merged[prop], $nextProps[prop] );
								else
									$.extend( true, $merged[prop], obj );
								diff = true;
							}
						} else if ( $curProps[prop] != $nextProps[prop] ) {
							$merged[prop] = $nextProps[prop];
							diff = true;
						}
					}
				}
				return diff;
			},
			// Lists all css types that can be animated
			canAnimate : function( $prop ) {
				return types.core.contains( ['rotate', 'opacity', 'color', 'fill', 'background-color', 'border-color', 'border-width', 'border-radius', 'line-height', 'font-size', 'width', 'height', 'top', 'left'], $prop );
			},
			// Lists all css types that are a color type
			isColor : function( $prop ) {
				return types.core.contains( ['color', 'fill', 'background-color', 'border-color'], $prop );
			},
			// Lists all css types that are numeric
			isNumeric : function( $prop ) {
				return types.core.contains( ['rotate', 'opacity', 'border-width', 'border-radius', 'line-height', 'font-size', 'width', 'height', 'min-width', 'min-height', 'top', 'left'], $prop );
			}
		}
	} );
	
} )(jQuery,this);
