/**
 * @author Ed Rogers
 * @contributor Lee Sylvester
 * @copyright Influxis
 **/
( function( $ ) {

	var types = $.fn.fluxui.types;
	var fdata = $.fn.fluxui.fdata;
	var assets = $.fn.fluxui.assets;
	var $class = $.fn.fluxui.$class;

	/**
	 * Submit class
	 * Provides for the input submit HTML tags.
	 *
	 * Requires:
	 *		../element.js
	 *		input.js
	 **/
	var clazz = $class.create( {
		namespace : 'display.form.submit',
		inherits : types.display.form.input,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			markup : '<input />'
		},
		methods : {
			initialise : function( $id, $descriptor ) {
				clazz.Super.initialise.call( this, $id, $descriptor );
				if ( !!$descriptor.text )
					this.$node().val( types.core.htmlEncode( $descriptor.text ) );
				if ( $descriptor.formName )
					this.$node().attr( 'formName', $descriptor.formName );
				else
					this.$node().attr( 'type', 'submit' );
			}
		}
	} );
	
} )(jQuery,this);
