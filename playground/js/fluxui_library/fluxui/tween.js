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
	 * Tween class
	 * Handles all tweening / animation tasks.
	 **/
	$class.create( {
		namespace : 'tween',
		statics : {
			percent : 0,
			// From $start color to $end color using tween percentage $pc, returns
			// a new color that is the $pc (percentage) of both colors, where 0% is $start
			// and 100% is $end.
			getColorTransition : function( $start, $end, $pc ) {
				var c1 = types.color.hexToRGBA( $start );
				var c2 = types.color.hexToRGBA( $end );
				
				var r1 = c1[0],
					g1 = c1[1],
					b1 = c1[2];
				var r2 = c2[0],
					g2 = c2[1],
					b2 = c2[2];
			
				return types.color.RGBAToHex( [ Math.max( Math.min( Math.floor( r1 + ( $pc * ( r2 - r1 ) ) + .5 ), 255 ), 0 ),
												Math.max( Math.min( Math.floor( g1 + ( $pc * ( g2 - g1 ) ) + .5 ), 255 ), 0 ),
												Math.max( Math.min( Math.floor( b1 + ( $pc * ( b2 - b1 ) ) + .5 ), 255 ), 0 ) ] );
			},
			getColorObjTransition : function( $start, $end, $pc ) {
				var i, c = {type: $end.type, colors: [], direction: $end.direction}, c1, c2;
				if ( !$start || !types.core.isColor( $start ) ) return $end;
				if ( !$end || !types.core.isColor( $end ) ) return $start;
				for ( i = 0; i < Math.max( $start.colors.length, $end.colors.length ); i++ ) {
					c1 = ( $start.colors.length > i ) ? $start.colors[i] : $start.colors[$start.colors.length-1];
					cc1 = types.color.hexToRGBA( c1.rgb );
					var r1 = cc1[0],
						g1 = cc1[1],
						b1 = cc1[2],
						a1 = c1.opacity,
						p1 = c1.pos;
						
					c2 = ( $end.colors.length > i ) ? $end.colors[i] : $end.colors[$end.colors.length-1];
					cc2 = types.color.hexToRGBA( c2.rgb );
					var r2 = cc2[0],
						g2 = cc2[1],
						b2 = cc2[2],
						a2 = c2.opacity,
						p2 = c2.pos;
			
					var h = types.color.RGBAToHex( [ Math.max( Math.min( Math.floor( r1 + ( $pc * ( r2 - r1 ) ) + .5 ), 255 ), 0 ),
													 Math.max( Math.min( Math.floor( g1 + ( $pc * ( g2 - g1 ) ) + .5 ), 255 ), 0 ),
													 Math.max( Math.min( Math.floor( b1 + ( $pc * ( b2 - b1 ) ) + .5 ), 255 ), 0 ) ] );
					c.colors.push( { rgb: h,
									 opacity: a1 + ( $pc * ( a2 - a1 ) ),
									 pos: p1 + ( $pc * ( p2 - p1 ) ) } );
				}
				if ( !isNaN( parseInt( $start.direction ) ) && !isNaN( parseInt( $end.direction ) ) )
				    c.direction = parseInt( $start.direction ) + ( $pc * ( parseInt( $end.direction ) - parseInt( $start.direction ) ) );
				return c;
			},
			to : function( $owner, $duration, $data ) {
				if ( !$data ) return;
				if ( !$data.to && !$data.to.props ) {
					if ( !$data.callback ) $data.callback.apply( $owner, $data.args );
					return;
				}
				var cb = $data.callback || function() {},
					easing = $data.easing || 'linearTween',
					args = $data.args || [],
					to = types.core.clone( $data.to.props ),
					from = types.core.clone( $data.from.props ),
					nkeys = [], ckeys = []
					d = $duration || 0;
				var f = types.tween[easing];
				for ( i in to ) {
					if ( to.hasOwnProperty( i ) ) {
						if ( types.style.isColor( i ) == true )
							ckeys.push( i );
						else if ( types.style.isNumeric( i ) == true )
							nkeys.push( i );
					}
				}
				var start = new Date().getTime();
				//if ( types.tween.percent % 1 > 0.01 || types.tween.percent % 1 < 0.99 )
				//	start -= $duration * ( ( 1 - types.tween.percent ) % 1 );
				var animation = function() {
					var i, c, prop, current = new Date().getTime() - start;
					if ( current > d ) current = d;
					for ( i = 0; i < nkeys.length; i++ ) {
						prop = nkeys[i];
						if ( isNaN( to[prop] ) || ( !isNaN( from[prop] ) && from[prop] == to[prop] ) ) continue;
						types.tween.percent = f( current, 0, 1, $duration );
						//console.log( 'animating', nkeys[i], 'from', 0, 'to', 1, '=', types.tween.percent );
						$owner.style( prop, Math.floor( parseFloat( from[prop] ) + ( types.tween.percent * ( to[prop] - from[prop] ) ) ) );
					}
					for ( i = 0; i < ckeys.length; i++ ) {
						prop = ckeys[i];
						if ( !to[prop] || ( !!from[prop] && types.core.isEqual( from[prop], to[prop] ) ) ) continue;
						types.tween.percent = f( current, 0, 1, $duration );
						if ( types.core.isString( from[prop] ) && types.core.isString( to[prop] ) )
							c = types.tween.getColorTransition( from[prop], to[prop], types.tween.percent );
						else {
							if ( types.core.isString( from[prop] ) )
								from[prop] = { rgb: from[prop], pos: 0.1, opacity: 1 };
							if ( types.core.isString( to[prop] ) )
								to[prop] = { rgb: to[prop], pos: 0.1, opacity: 1 };
							types.style.normaliseColorPos( from[prop] );
							types.style.normaliseColorPos( to[prop] );
							c = types.tween.getColorObjTransition( from[prop], to[prop], types.tween.percent );
						}
						//console.log( 'animating', ckeys[i], 'from', from[prop], 'to', to[prop], prop );
						//console.log( prop, c );
						$owner.style( prop, c );
					}
					if ( current >= d ) {
						cb.apply( $owner, args );
						types.tween.percent = 1;
						return false;
					}
					return true;
				};
				types.timer.add( animation );
				types.timer.start();
			},
			// --- LIST OF TWEEN FUNCTIONS --- //
			// t: current time, b: beginning value, c: change in value, d: duration
			// t and d can be in frames or seconds/milliseconds
			linearTween : function( t, b, c, d ) {
				return c * t / d + b;
			},
			easeInQuad : function( t, b, c, d ) {
				return c * ( t /= d ) * t + b;
			},
			easeOutQuad : function( t, b, c, d ) {
				return -c * ( t /= d ) * ( t - 2 ) + b;
			},
			easeInOutQuad : function( t, b, c, d ) {
				if ( ( t /= d / 2 ) < 1 ) return c / 2 * t * t + b;
				return -c / 2 * ( ( --t ) * ( t - 2 ) - 1 ) + b;
			},
			easeInCubic : function( t, b, c, d ) {
				return c * ( t /= d ) * t * t + b;
			},
			easeOutCubic : function( t, b, c, d ) {
				return c * ( ( t = t / d - 1 ) * t * t + 1 ) + b;
			},
			easeInOutCubic : function( t, b, c, d ) {
				if ( ( t /= d / 2 ) < 1 ) return c / 2 * t * t * t + b;
				return c / 2 * ( ( t -= 2 ) * t * t + 2 ) + b;
			},
			easeInQuart : function( t, b, c, d ) {
				return c * ( t /= d ) * t * t * t + b;
			},
			easeOutQuart : function( t, b, c, d ) {
				return -c * ( ( t = t / d - 1 ) * t * t * t - 1 ) + b;
			},
			easeInOutQuart : function( t, b, c, d ) {
				if ( ( t /= d / 2 ) < 1 ) return c / 2 * t * t * t * t + b;
				return -c / 2 * ( ( t -= 2 ) * t * t * t - 2 ) + b;
			},
			easeInQuint : function( t, b, c, d ) {
				return c * ( t /= d ) * t * t * t * t + b;
			},
			easeOutQuint : function( t, b, c, d ) {
				return c * ( ( t = t / d - 1 ) * t * t * t * t + 1 ) + b;
			},
			easeInOutQuint : function( t, b, c, d ) {
				if ( ( t /= d / 2 ) < 1 ) return c / 2 * t * t * t * t * t + b;
				return c / 2 * ( ( t -= 2 ) * t * t * t * t + 2 ) + b;
			},
			easeInSine : function( t, b, c, d ) {
				return -c * Math.cos( t / d * ( Math.PI / 2 ) ) + c + b;
			},
			easeOutSine : function( t, b, c, d ) {
				return c * Math.sin( t / d * ( Math.PI / 2 ) ) + b;
			},
			easeInOutSine : function( t, b, c, d ) {
				return -c / 2 * ( Math.cos( Math.PI * t / d ) - 1 ) + b;
			},
			easeInExpo : function( t, b, c, d ) {
				return ( t == 0 ) ? b : c * Math.pow( 2, 10 * ( t / d - 1 ) ) + b;
			},
			easeOutExpo : function( t, b, c, d ) {
				return ( t == d ) ? b + c : c * ( - Math.pow( 2, -10 * t / d ) + 1 ) + b;
			},
			easeInOutExpo : function( t, b, c, d ) {
				if ( t == 0 ) return b;
				if ( t == d ) return b + c;
				if ( ( t /= d / 2 ) < 1 ) return c / 2 * Math.pow( 2, 10 * ( t - 1 ) ) + b;
				return c / 2 * ( - Math.pow( 2, -10 * --t ) + 2 ) + b;
			},
			easeInCirc : function( t, b, c, d ) {
				return -c * ( Math.sqrt( 1 - ( t /= d ) * t ) - 1 ) + b;
			},
			easeOutCirc : function( t, b, c, d ) {
				return c * Math.sqrt( 1 - ( t = t / d - 1 ) * t ) + b;
			},
			easeInOutCirc : function( t, b, c, d ) {
				if ( ( t /= d / 2 ) < 1 ) return -c / 2 * ( Math.sqrt( 1 - t * t ) - 1 ) + b;
				return c / 2 * ( Math.sqrt( 1 - ( t -= 2 ) * t ) + 1) + b;
			},
			easeInElastic : function( t, b, c, d ) {
				var s = 1.70158; var p = 0; var a = c;
				if ( t == 0 ) return b;  if ( ( t /= d ) == 1 ) return b + c;  if ( !p ) p = d * .3;
				if ( a < Math.abs( c ) ) { a = c; var s = p / 4; }
				else var s = p / ( 2 * Math.PI ) * Math.asin( c / a );
				return -( a * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) ) + b;
			},
			easeOutElastic : function( t, b, c, d ) {
				var s = 1.70158; var p = 0; var a = c;
				if ( t == 0 ) return b;  if ( ( t /= d ) == 1 ) return b + c;  if ( !p ) p = d * .3;
				if ( a < Math.abs( c ) ) { a = c; var s = p / 4; }
				else var s = p / ( 2 * Math.PI ) * Math.asin( c / a );
				return a * Math.pow( 2, -10 * t ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) + c + b;
			},
			easeInOutElastic : function( t, b, c, d ) {
				var s = 1.70158; var p = 0; var a = c;
				if ( t == 0 ) return b;  if ( ( t /= d / 2 ) == 2 ) return b + c;  if ( !p ) p = d * ( .3 * 1.5 );
				if ( a < Math.abs( c ) ) { a = c; var s = p / 4; }
				else var s = p / ( 2 * Math.PI ) * Math.asin( c / a );
				if ( t < 1 ) return -.5 * ( a * Math.pow( 2, 10 * ( t -= 1 ) ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) ) + b;
				return a * Math.pow( 2 , -10 * ( t -= 1 ) ) * Math.sin( ( t * d - s ) * ( 2 * Math.PI ) / p ) * .5 + c + b;
			},
			easeInBack : function( t, b, c, d, s) {
				if ( s == undefined ) s = 1.70158;
				return c * ( t /= d ) * t * ( ( s + 1 ) * t - s ) + b;
			},
			easeOutBack : function( t, b, c, d, s) {
				if ( s == undefined ) s = 1.70158;
				return c * ( ( t = t / d - 1 ) * t * ( ( s + 1 ) * t + s ) + 1 ) + b;
			},
			easeInOutBack : function( t, b, c, d, s) {
				if ( s == undefined ) s = 1.70158; 
				if ( ( t /= d / 2 ) < 1 ) return c / 2 * ( t * t * ( ( ( s *= ( 1.525 ) ) + 1 ) * t - s ) ) + b;
				return c / 2 * ( ( t -= 2 ) * t * ( ( ( s *= ( 1.525 ) ) + 1 ) * t + s ) + 2 ) + b;
			},
			easeInBounce : function( t, b, c, d ) {
				return c - types.tween.easeOutBounce( d - t, 0, c, d ) + b;
			},
			easeOutBounce : function( t, b, c, d ) {
				if ( ( t /= d ) < ( 1 / 2.75 ) ) {
					return c * ( 7.5625 * t * t ) + b;
				} else if ( t < ( 2 / 2.75 ) ) {
					return c * ( 7.5625 * ( t -= ( 1.5 / 2.75 ) ) * t + .75 ) + b;
				} else if ( t < ( 2.5 / 2.75 ) ) {
					return c * ( 7.5625 * ( t -= ( 2.25 / 2.75 ) ) * t + .9375 ) + b;
				} else {
					return c * ( 7.5625 * ( t -= ( 2.625 / 2.75 ) ) * t + .984375 ) + b;
				}
			},
			easeInOutBounce : function( t, b, c, d ) {
				if ( t < d / 2 ) return types.tween.easeInBounce( t * 2, 0, c, d ) * .5 + b;
				return types.tween.easeOutBounce( t * 2 - d, 0, c, d ) * .5 + c * .5 + b;
			}
		}
	} );
	
} )(jQuery,this);
