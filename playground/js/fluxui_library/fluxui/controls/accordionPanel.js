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
	 * Accordion panel class
	 * Base for all collapsible panels within the editor
	 *
	 * Requires:
	 *		../editor.js
	 *		accordion.js
	 **/
	
	var clazz = $class.create( {
		namespace : 'controls.accordionPanel',
		inherits : types.display.element,
		constructor : function( $id, $data ) {
			clazz.Super.constructor.call( this, $id, $data );
		},
		fields : {
			props : {
				position: 'relative'
			},
			text : '',
			icon : ''
		},
		methods : {
			// Sets the assets and icon for the panel.
			initialise : function( $id, $data ) {
				var attr = this.states.getCurrentStateData().attr;
				this.text = attr.text;
				if ( !!assets[attr.icon] )
					this.icon = attr.icon;
			}
		}
	} );
	
} )(jQuery,this);
