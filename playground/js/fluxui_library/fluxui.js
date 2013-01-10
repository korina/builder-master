/**
 * @author Lee Sylvester
 * @contributor Ed Rogers
 * @copyright Influxis
 **/
( function( $ ) {

	/**
	 * global event dispatcher
	 **/
	var eventDispatcher = {};
	
	/**
	 * Plugin constructor
	 * Here, we parse the movie and perform simple checks to ensure we have
	 * what we need.  We then proceed to kick start the movie construction.
	 * 
	 * Requires:
	 * 		fluxui.color.js
	 *		fluxui.core.js
	 *		fluxui.display.element.js
	 *		fluxui.event.dispatcher.js
	 *		fluxui.style.js
	 *		fluxui.timer.js
	 *		fluxui.tween.js
	 **/
	$.fn.fluxui = function( $movie, onLoaded ) {
		var $container = $(this);
		$container.empty();
		eventDispatcher = types.events.dispatcher.getInstance();
		// we're doing this for each movie, though we only really want (and have tested) for one.
		var m;
		var rtn = this.each( function() {
			if ( !$movie ) $.fn.fluxui.log( "No movie to parse. Exiting." );
			if ( !!$movie && !!$movie.assets ) {
				// stick all assets in the _assets variable
				//$movie.assets['placeholder'] = { url : 'http://placehold.it/100x100', width : 100, height : 100 };
				var _assets = new Array();
				for ( a in $movie.assets ) {
					_assets.push( $movie.assets[a] );
				}
				if ( _assets.length > 0 ) {
					types.core.preload( _assets );
				}
				$.extend( true, assets, $movie.assets );
			}
			// kickstart movie construction
			if ( !!$movie.movie ) {
				var me = this;	
				me.parseMovie = function() {
					var cb = function() {
						m = this.node;
						// set outer movie container css (includes dimentions)
						$container.css( 'position', 'relative' );
						m = types.display.element.getInstance( m );
					}
					types.serialiser.parse( 'root_' + types.core.nextMovieCounter(), $movie.movie, null, cb, $container );
					if ( !!onLoaded )
						onLoaded( { movie: rtn, eventDispatcher: eventDispatcher, types: types, inst: m } );
				}
				// first load any classes not already available
				var list = types.loader.classesToLoad( $movie.movie );
				if ( list.length > 0 )
					types.loader.load( list, function() { me.parseMovie(); } );
				else
					me.parseMovie();
			} else {
				$.fn.fluxui.log( "Movie structure corrupt." );
			}
		} );

	};
	
	/**
	 * global assets lookup
	 **/
	var assets = $.fn.fluxui.assets = $.fn.fluxui.assets || {};

	/**
	 * global data container
	 **/
	var fdata = $.fn.fluxui.fdata = $.fn.fluxui.fdata || {};

	/**
	 * types lookup - stores all classes for all movies
	 **/
	var types = $.fn.fluxui.types = $.fn.fluxui.types || {};

	/**
	 * Class engine - provides for OO functionality
	 **/
	var $class = $.fn.fluxui.$class = $.fn.fluxui.$class || {};
	
	/**
	 * the developer can call this to set his own default settings, such as debug mode etc.
	 **/
	$.fn.fluxui.initialise = function( $options ) {
		$.extend( true, this.settings, $options );
	};
	
	$.fn.fluxui.evt = function() {
		return types.events.dispatcher.getInstance();
	}

	$class.create = $.fn.fluxui.$class.create = (function() {
		return function( param ) {
			var m,
				f = function(){},
				h = Object.prototype.hasOwnProperty,
				t = types;
				
			if ( !param )
				return function() {};
	
			if ( !param.namespace )
				throw new Error( "Please specify the Namespace." );

			var segs = param.namespace.split( '.' );
			for ( var i = 0; i < segs.length; i++ )
				if ( !!t ) t = t[segs[i]];
			if ( !!t ) return t;
			
			if ( h.call( param, 'constructor' ) ) {
				if ( typeof param.constructor != "function" )
					throw new TypeError("Illegal function [" + param.namespace + ".constructor]!");
				f = param.constructor;
			}
	
			this['inherits'] = function( c, p ) {
				for ( m in p )
					if ( h.call( p, m ) ) c[m] = p[m];
				function ctor() { this.constructor = c; }
				ctor.prototype = p.prototype;
				c.prototype = new ctor;
				c.__super__ = c.Super = p.prototype;
				return c;
			}
			
			if ( param['inherits'] )
				this['inherits']( f, param['inherits'] );
				
			var e = function( obj, params, static ) {
				for ( m in params )
					if ( h.call( params, m ) ) {
						if ( !static )
							obj.prototype[m] = params[m];
						else
							obj[m] = params[m];
					}
			}
				
			if ( param.methods )
				e( f, param.methods );

			if ( !param.fields ) param.fields = {};
			param.fields.className = param.namespace;
			e( f, param.fields );
				
			if ( param.statics )
				e( f, param.statics, true );
	
			if ( param.props ) { // styles
				var o = f.prototype.props = $.extend( true, {}, f.prototype.props );
				e( o, $.extend( true, {}, param.props ), true );
			}
			
			// create the specified namespace and append the class to it.
			var name = param.namespace;
			if ( name.length == 0 || name.indexOf( " " ) != -1 || name.charAt( 0 ) == '.' 
					|| name.charAt( name.length - 1 ) == '.' || name.indexOf( ".." ) != -1 )
				throw new Error( "illegal Namespace: " + name );
			var parts = name.split( '.' );
			var container = types;
			for( var i = 0; i < parts.length - 1; i++ ) {
				var part = parts[i];
				// If there is no property of container with this name, create an empty object.
				if (!container[part]) {
					container[part] = {};
				} else if (typeof container[part] != "object") {
					// If there is already a property, make sure it is an object
					var n = parts.slice(0, i).join('.');
					throw new Error(n + " already exists and is not an object");
				}
				container = container[part];
			}
			container[parts[parts.length - 1]] = f;

			return f;
		};
	})();

	// stores global fluxui settings
	var settings = $.fn.fluxui.settings = {
		debug : false,
		defaultTransform : {
			duration : 300,
			easing : "linearTween",
			after : "stop"
		}
	};

	// logs important debug messages to the browser
	var log = $.fn.fluxui.log = function( $msg ) {
		if ( this.settings.debug ) {
			if ( !!window.console && !!window.console.log ) {
				var log = Function.prototype.bind.call( console.log, console );
				log.apply( console, arguments );
			} else {
				alert( $msg );
			}
		}
	};
	
} )( jQuery );

/**
 * Using resize plugin for anchoring
 *
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 **/
 
(function($,window,undefined){
	'$:nomunge';
	var elems = $([]),
		jq_resize = $.resize = $.extend( $.resize, {} ),
		timeout_id,
		str_setTimeout = 'setTimeout',
		str_resize = 'resize',
		str_data = str_resize + '-special-event',
		str_delay = 'delay',
		str_throttle = 'throttleWindow';
	jq_resize[ str_delay ] = 250;
	jq_resize[ str_throttle ] = true;
	$.event.special[ str_resize ] = {
		setup: function() {
			if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
			var elem = $(this);
			elems = elems.add( elem );
			$.data( this, str_data, { w: elem.width(), h: elem.height() } );
			if ( elems.length === 1 ) {
				loopy();
			}
		},
		teardown: function() {
			if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
			var elem = $(this);
			elems = elems.not( elem );
			elem.removeData( str_data );
			if ( !elems.length ) {
				clearTimeout( timeout_id );
			}
		},
		add: function( handleObj ) {
			if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }
			var old_handler;
			function new_handler( e, w, h ) {
				var elem = $(this),
					data = $.data( this, str_data );
				data.w = w !== undefined ? w : elem.width();
				data.h = h !== undefined ? h : elem.height();
				old_handler.apply( this, arguments );
			};
			if ( $.isFunction( handleObj ) ) {
				old_handler = handleObj;
				return new_handler;
			} else {
				old_handler = handleObj.handler;
				handleObj.handler = new_handler;
			}
		}
	};
	function loopy() {
		timeout_id = window[ str_setTimeout ](function(){
			elems.each(function(){
				var elem = $(this),
					width = elem.width(),
					height = elem.height(),
					data = $.data( this, str_data );
				if ( width !== data.w || height !== data.h ) {
					elem.trigger( str_resize, [ data.w = width, data.h = height ] );
				}
			});
			loopy();
		}, jq_resize[ str_delay ] );
	};
	
} )(jQuery,this);

$(window).load( function() {
	$.fn.fluxui.evt().dispatch( this, 'app.loaded' );
} );