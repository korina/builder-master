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
	 * Radiogroup class
	 * Provides for the input radio HTML tag (Ed, requires a full range of methods for adding children)
	 *
	 * Requires:
	 *		../element.js
	 *		input.js
	 **/
	var clazz = $class.create( {
		namespace : 'display.form.radiogroup',
		inherits : types.display.form.input,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			markup : '<div class="radiogroup" />'
		},
		methods : {
			initialise : function( $id, $descriptor ) {
				clazz.Super.initialise.call( this, $id, $descriptor );
				var i = $descriptor.initial;
				if ( !i.attr ) return;
				var a = i.attr;
				if ( a.formName )
					this.$node().attr( 'formName', a.formName );
				if ( !a.text ) { var text = null } else { var text = a.text };
				for ( l in a.labels ) {
					var elText = a.labels[l];
					this.addChild ( this.$node(), 'input', elText, a.values[l], 'radio', text );
				}
			}
		}
	} );
	
} )(jQuery,this);
