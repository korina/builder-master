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
	 * Events class
	 * Events binding, collecting and notifications functions.
	 **/
	 
	$class.create( {
		namespace : 'events.dispatcher',
		fields : {
			delimiter : '.',
			wildcard : '*',
			_stack : {}
		},
		methods : {
			// Add an individual listener handler.
			addListener : function( $evt, $handler ) {
				var pntr = types.events.dispatcher.getInstance()._getNamespaceSegment( $evt );
				if ( !this.hasListener( $evt, $handler ) )
					pntr._handlers.push( $handler );
			},
			// Add a multitude of listener handler.
			addListeners : function( $evt ) {
				for ( var m in $evt )
					if ( $evt.hasOwnProperty( m ) )
						this.addListener( m, $evt[m] );
			},
			// Remove a listener handler.
			removeListener : function( $evt, $handler ) {
				var pntr = types.events.dispatcher.getInstance()._getNamespaceSegment( $evt );
				if ( !$pntr._handlers ) $pntr._handlers = [];
				for ( var t = 0; t < $pntr._handlers.length; t++ )
					if ( $pntr._handlers[t] == $handler ) {
						$pntr._handlers.splice( t );
						return;
					}
			},
			// Check for a listener, returning true or false.
			hasListener : function( $evt, $handler ) { 
				if ( !$handler || typeof $handler != 'function' ) throw 'Event handler must be supplied as a function';
				var pntr = types.events.dispatcher.getInstance()._getNamespaceSegment( $evt );
				if ( !pntr._handlers ) pntr._handlers = [];
				var f = false;
				for ( var t = 0; t < pntr._handlers.length; t++ )
					if ( pntr._handlers[t] == $handler )
						f = true;
				return f;
			},
			// Dispatch an event for a specific object, passing additional params to the handlers.
			dispatch : function( $obj, $evt ) {
				var args = Array.prototype.slice.call( arguments );
				args.shift();
				types.events.dispatcher.getInstance()._dispatch.apply( $obj, args );
			},
			_dispatch : function( $evt /* additional params will be passed to event handlers */ ) {
				var pntr = types.events.dispatcher.getInstance()._getNamespaceSegment( $evt, true ),
					args = Array.prototype.slice.call( arguments, 0 );
				for ( var i = 0; i < pntr.length; i++ )
					for ( var j = 0; j < pntr[i]._handlers.length; j++ )
						pntr[i]._handlers[j].apply( arguments.caller, args );
			},

			// JQuery bind functionality to dispatch passed events.
			bind : function( $obj, $trigger, $event ) {
				var t = types.events.dispatcher.getInstance();
				$obj.bind( $trigger, function() {
					var args = Array.prototype.slice.call( arguments );
					args.unshift( $event );
					t._dispatch.apply( $obj, args );
				} );
			},
			// Proto-unbinder
			unbind : function( $obj, $trigger ) {
				$obj.unbind( $trigger );
			},
			// Splits down the passed events into constituent segments, seperated by full stops.
			_getNamespaceSegment : function( $evt, $includeWildcards, $arr ) {
				var e = ( types.core.isString( $evt ) ) ? $evt.split( this.delimiter ) : ( types.core.isArray( $evt ) ) ? $evt : null;
				if ( !e ) throw 'Event listener assigned to unknown type';
				var pntr = this._stack;
				for ( var i = 0; i < e.length; i++ ) {
					if ( !types.core.isString( e[i] ) ) throw 'Event identifier segment not a string value';
					if ( e[i] == "_handlers" || ( e[i] == this.wildcard && i < e.length - 1 ) ) throw 'Invalid name used in event namespace.';
					if ( !pntr[e[i]] ) pntr[e[i]] = {};
					pntr = pntr[e[i]];
				}
				if ( !pntr._handlers ) pntr._handlers = [];
				if ( $includeWildcards ) {
					if ( !$arr || !types.core.isArray( $arr ) ) $arr = [];
					$arr.push( pntr );
					if ( e[e.length-1] == this.wildcard )
						e.pop();
					if ( e.length > 0 ) {
						e.pop();
						e.push( this.wildcard );
						this._getNamespaceSegment( e, $includeWildcards, $arr );
					}
					return $arr;
				}
				return pntr;
			}
		},
		statics : {
			_instance : null,
			getInstance : function() {
				types.events.dispatcher._instance = types.events.dispatcher._instance || new types.events.dispatcher();
				return types.events.dispatcher._instance;
			}
		}
	} );
	
})(jQuery,this);
