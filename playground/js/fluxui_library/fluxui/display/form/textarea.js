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
	 * TextArea class
	 * Provides for the textarea HTML tag
	 * (Ed, requires fuller range of methods)
	 *
	 * Requires:
	 *		../element.js
	 **/
	var clazz = $class.create( {
		namespace : 'display.form.textarea',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			markup : '<textarea />'
		},
		methods : {
			initialise : function( $id, $descriptor ) {
				var me = this;
				var d = $descriptor,
					i = d.initial;
					a = i.attr;
				if ( !!a && !!a.formName )
					this.$node().attr( 'formName', a.formName );
				if ( !!a && !!a.text )
					this.text( a.text );
				var b = d.bind;
				if ( !!b )
					for ( var i in b ) {
						if ( b.hasOwnProperty( i ) ) {
							if ( !!b[i].event ) {
								$.fn.fluxui.evt().addListener( b[i].event, function( $ns, $data ) {
									if ( i == 'text' )
										me.$node().val( $data );
									else
										me.$node().attr( i, $data );
								} );
							}
						}
					}
			},
			// Sets the text value of the textarea
			text : function( $t ) {
				if ( !!$t )
					this.$node().val( $t );
				return this.$node().val();
			}
		}
	} );
	
} )(jQuery,this);
