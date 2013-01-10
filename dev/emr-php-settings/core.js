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
	 * Core system class
	 * Provides system level functions
	 * Requires:
	 *		fluxui.display.element.js
	 **/
	$class.create( {
		namespace : 'core',
		statics : {
			serverPath : '',
			// load all images used in the movie. likely not needed, but future proofs code
			preload : function( $assets ) {
				for ( a in $assets )
					$('<img/>')[0].src = $assets[a].url;
			},
			// guarantees a unique movie id
			nextMovieCounter : function() {
				fdata.counter = fdata.counter || 0;
				return fdata.counter++;
			},
			nextElementCounter : function() {
				fdata.elmCounter = fdata.elmCounter || 0;
				return fdata.elmCounter++;
			},
			// encodes HTML to a valid string
			htmlEncode : function(value){
				return $('<div/>').text(value).html();
			},
			// Decodes a string to valid HTML
			htmlDecode : function(value){
				return $('<div/>').html(value).text();
			},
			// Clones an object
			clone : function( $obj ) {
				if( !$obj || $.isFunction( $obj ) )
					return null;
				if ( typeof $obj == "string" || !isNaN( $obj ) || $obj == true || $obj == false ) return $obj;
				return $.extend( true, {}, $obj );
			},
			map : function( arr, fun /*, thisp*/) {
				var len = arr.length;
				if ( typeof fun != "function" )
					throw new TypeError();
				
				var res = new Array( len );
				var thisp = arguments[2];
				for ( var i = 0; i < len; i++ ) {
					if ( i in arr )
						res[i] = fun.call( thisp, arr[i], i, arr);
				}
				
				return res;
			},
			processElement : function( obj, f ) {
				types.core.map( obj.getChildren(), function( e ) {
					f( e );
					types.core.processElement( e, f );
				} );
			},
			// Non-global polluting array.indexOf function
			indexOf : function( $array, $value ) {
				if ( !types.core.isArray( $array ) ) return false;
				for ( var i = 0; i < $array.length; i++ )
					if ( $array[i] == $value ) return true;
				return false;
			},
			// Returns true if $val is an Object. This includes any complex object, including Arrays.
			isObject : function( $val ) {
				return $val === Object( $val );
			},
			// Returns true if $val is an array.
			isArray : function( $val ) {
				return ( !!$val ) ? $val.constructor == Array : false;
			},
			// Returns true if $val is a string
			isString : function( $val ) {
				return toString.call( $val ) == '[object String]';
			},
			// Returns true if $val is a color type
			isColor : function( $val ) {
				return !isNaN( $val.r ) && !isNaN( $val.g ) && !isNaN( $val.b );
			},
			// Returns true if item has no length or own properties.
			isEmpty : function( $val ) {
				if ( types.core.isArray( $val ) || types.core.isString( $val ) ) return $val.length === 0;
				for ( var key in $val ) if ( $val.hasOwnProperty( key ) ) return false;
				return true;
			},
			isURL : function( $url ) {
				var rx = new RegExp( "^(http:\/\/|https:\/\/|www.){1}([0-9A-Za-z]+\.)" );
				if ( rx.test( $url ) )
					return true;
				return false;
			},
			// Returns true if two objects are of the same structure and with the same ultimate leaf values
			isEqual : function( $oa, $ob ) {
				if ( typeof $oa == 'string' ) return ( $oa == $ob );
				if ( !isNaN( $oa ) ) return ( $oa == $ob );
				if ( $oa === true ) return ( $oa == $ob );
				if ( $oa === false ) return ( $oa == $ob );
				var p;
				for( p in $oa ) {
					if ( typeof( $ob[p] ) == 'undefined' ) { return false; }
				}
				
				for ( p in $oa ) {
					if ( $oa[p] ) {
						switch( typeof( $oa[p] ) ) {
							case 'object':
								if ( !types.core.isEqual( $oa[p], $ob[p] ) ) {
									return false;
								}
								break;
							case 'function':
								if ( typeof( $ob[p] ) == 'undefined' || ( $oa[p].toString() != $ob[p].toString() ) )
								return false;
								break;
							default:
								if ( $oa[p] != $ob[p] ) {
									return false;
								}
						}
					} else {
						if ( $ob[p] )
							return false;
					}
				}
				
				for( p in $ob ) {
					if ( !$oa || typeof( $oa[p] ) == 'undefined' ) {
						return false;
					}
				}
				return true;
			}
		}
	} );
	
} )(jQuery,this);
