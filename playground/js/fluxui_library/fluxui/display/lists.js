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
	 * These classes are for all element associated with HTML lists
	 **/

	/**
	 * Unordered list class
	 * Provides for unordered lists
	 *
	 * Requires:
	 *		element.js
	 **/
	var clazz = $class.create( {
		namespace : 'display.unorderedList',
		inherits : types.display.element,
		constructor : function( $id, $descriptor, $node ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			markup : '<ul />'
		}
	} );
	
	/**
	 * Ordered list class
	 * Provides for ordered lists
	 *
	 * Requires:
	 *		element.js
	 **/
	var claza = $class.create( {
		namespace : 'display.orderedList',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			claza.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			markup : '<ol />'
		}
	} );
	
	/**
	 * List item class
	 * Provides the item tag for both ordered and unordered lists. Its methods mirror those of 'display.label'.
	 *
	 * Requires:
	 *		element.js
	 **/
	var clazb = $class.create( {
		namespace : 'display.item',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazb.Super.constructor.call( this, $id, $descriptor );
		},
		props : {
			'overflow' : 'hidden',
			'font-family' : 'arial',
			'font-size' : 12
		},
		methods : {
			text : function( $t ) {
				if ( !!$t ) {
					if ( !!arguments[1] )
						this.states.setAttributeOnCurrentState( 'text', $t );
					this.$node().html( $t );
				}
				return this.$node().html();
			},
			attribute : function( attr, value, updateState ) {
				if ( !!value ) {
					if ( !!updateState ) this.states.setAttributeOnCurrentState( attr, value );
					if ( attr == 'text' )
						this.text( value );
					else
						this.$node().attr( attr, value );
				}
				return this.$node().attr( attr );
			}
		}
	} );
	
} )(jQuery,this);
