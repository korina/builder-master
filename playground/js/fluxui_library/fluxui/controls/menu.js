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
	 * Menu class.
	 * Provides the menu interface for the editor.
	 * 
	 * Requires:
	 *		fluxui.display.element.js
	 **/
	 
	var clazz = $class.create( {
		namespace : 'controls.menu',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		methods : {
			initialise : function() {
				var m = this;
				$.post( "data/?action=loggedIn", {}, function( data ) {
					if ( data == '1' )
						m.showOptions();
				} );
			},
			showOptions : function() {
				this.getChildById( 'login-menu' ).visible( false );
				this.getChildById( 'app-menu' ).visible( true );
			}
		}
	} );
	
} )(jQuery,this);
