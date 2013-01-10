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
	 * Text class
	 * Provides for the input text and password HTML tags. If the 'text' field is not 'password' then it is assumed to be text input
	 *
	 * Requires:
	 *		../element.js
	 *		input.js
	 **/
	 
	var clazz = $class.create( {
		namespace : 'display.form.textfield',
		inherits : types.display.form.input,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			markup : '<input />'
		},
		methods : {
			// In order to change the type of an input with JQuery one first has to detach the element, then make the change,
			// and finally reattach the element. This is to work around a security feature on Internet Explorer.
			initialise : function( $id, $descriptor ) {
				var me = this,
					s = me.states.getCurrentStateData(),
					a = s.attr;
				if ( !!a.formName )
					this.$node().attr( 'formName', a.formName );
				if ( a.text === "password" ) {
					marker = $('<span />').insertBefore( this.$node() );
					this.$node().detach().attr( 'type', 'password' ).insertAfter( marker ).focus();
					this.$node().attr( 'placeholder', 'Password' );
					marker.remove();
				}
				else {
					marker = $('<span />').insertBefore( this.$node() );
					this.$node().detach().attr( 'type', 'text' ).insertAfter( marker ).focus();
					marker.remove();
					if ( !!a.text )
						this.text( a.text );
				}
				var b = $descriptor.bind;
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
			// Set the text value of the input
			text : function( $t ) {
				if ( !!$t || $t == '' )
					this.$node().val( types.core.htmlEncode( $t ) );
				return this.$node().val();
			},
			change : function( $self, $cb ) {
				this.$node().bind( 'change', function( e ) { $cb.call( $self, e ); } );
			}
		}
	} );
	
} )(jQuery,this);
