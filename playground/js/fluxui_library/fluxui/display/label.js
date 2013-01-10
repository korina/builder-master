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
	 * Label class
	 * Label is a div put aside for text, and only text. Labels must be put within other elements that require text as well as normal styling.
	 *
	 * (Lee, Given that 'label' is a HTML element, should we change this class' name?)
	 *
	 * Requires:
	 *		element.js
	 **/
	var clazz = $class.create( {
		namespace : 'display.label',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		props : {
			'overflow' : 'hidden',
			'font-family' : 'arial',
			'font-size' : 12
		},
		methods : {
			// Sets the element's html value.
			text : function( $t ) {
				if ( !!$t ) {
					if ( !!arguments[1] )
						this.states.setAttributeOnCurrentState( 'text', $t );
					this.$node().html( $t );
				}
				return this.$node().html();
			},
			// Sets other attributes.
			attribute : function( attr, value, updateState ) {
				if ( !!value ) {
					if ( !!updateState ) this.states.setAttributeOnCurrentState( attr, value );
					if ( attr == 'text' )
						this.text( value );
					else
						this.$node().attr( attr, value );
				}
				return this.$node().attr( attr );
			},
			
			style : function( type, prop, updateState ) {
				if ( type == 'fill' || type.substr( 0, 6 ) == 'border' ) return;
				return clazz.Super.style.call( this, type, prop, updateState );
			}
		}
	} );
	
} )(jQuery,this);
