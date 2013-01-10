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
	 * View class
	 * Can contain fluxui items without breaking their previous heirarchy.
	 * 
	 * Requires:
	 *		fluxui.display.element.js
	 **/
	 
	var clazz = $class.create( {
		namespace : 'controls.view',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			pointer : null
		},
		methods : {
			addChild : function( n ) {
				var c = types.display.element.getInstance( n );
				return this.addChildFromClass( c );
			},
			addChildFromClass : function( c ) {
				if ( !c ) return;
				this.$node().append( c.$node() );
				this._children.push( c );
				c._parent = this.pointer;
				return c;
			}
		}
	} );
	
} )(jQuery,this);
