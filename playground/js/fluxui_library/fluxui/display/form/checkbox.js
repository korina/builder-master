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
	 * Checkbox class
	 * Provides for the input checkbox HTML tag
	 *
	 * Requires:
	 *		../element.js
	 *		input.js
	 **/
	var clazz = $class.create( {
		namespace : 'display.form.checkbox',
		inherits : types.display.form.input,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
			this.$node().attr( 'type', 'checkbox' );
		},
		methods : {
			initialise : function( $id, $descriptor ) {
				clazz.Super.initialise.call( this, $id, $descriptor );
				var i = $descriptor.initial;
				if ( !i.attr ) return;
				var a = i.attr;
				if ( a.formName )
					this.$node().attr( 'formName', a.formName );
				if ( a.checked )
					this.$node().attr( 'checked', 'checked' );
			},
			checked : function() {
				return this.$node().is(':checked');
			}
		}
	} );
	
} )(jQuery,this);
