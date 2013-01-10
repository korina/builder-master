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
	var eventDispatcher = types.events.dispatcher.getInstance();

	/**
	 * Component class
	 * Provides base functionality for components within the editor. See the components directory for examples.
	 *
	 * Requires:
	 *		element.js
	 **/
	var clazz = $class.create( {
		namespace : 'display.component',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		methods : {
			// Broadcast is used to keep property sheets and components in sync with each other.
			broadcast : function() {
				eventDispatcher.dispatch( this, 'events.' + this.className + '.changed', this );
			}
		}
	} );
	
} )(jQuery,this);
