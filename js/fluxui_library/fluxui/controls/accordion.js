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
	 * According class
	 * For dealing with the accordion in the editor
	 *
	 * Requires:
	 *		../element.js
	 **/
	
	var clazz = $class.create( {
		namespace : 'controls.accordion',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		methods: {
			// This initialise function creates the children of the accordian as panels with icons and certain styles.
			// It also bind the handle click function to each child (panel).
			initialise: function() {
				var i = this.initial;
				if ( !!this.data.hash.button ) {
					var c = this.$node().children();
					for ( var i = 0; i < c.length; i++ ) {
						var inst = types.display.element.getInstance( c[i] );
						var l = types.serialiser.parse( inst.fluxid() + '-btn', this.data.hash.button );
						l.style( 'position', 'relative' );
						var p = $(c[i]).wrap( '<div></div>' ).parent();
						p.prepend( l.node );
						l.style( 'width', this.width );
						if ( inst.text != '' ) {
							var child = l.getChildById( 'label' );
							child.states.setAttributeOnAllStates( 'text', inst.text );
							child.text( inst.text );
						}
						if ( inst.icon != '' ) {
							child = l.getChildById( 'icon' );
							child.states.setAttributeOnAllStates( 'src', inst.icon );
							child.attribute( 'src', inst.icon );
						}
						$(c[i]).hide();
						if ( !!l.initialise )
							l.initialise( this.data.hash.button );
						var acc = this;
						l.$node().bind( 'click', function( evt ) {
							acc.handleClick( evt.currentTarget );
						} );
					}
				}
			},
			// Handle click switches between children (panels), only ever leaving one open at any time.
			handleClick: function( $btn ) {
				var panel = $($btn).next()[0];
				this.$node().find( "[entity='controls.accordionPanel']" ).each( function() {
					if ( this == panel ) {
						types.display.element.getInstance( $btn ).selected( !$(this).is(':visible') );
						$(this).toggle( 'fast' );
					} else {
						if ( $(this).is(':visible') ) {
							types.display.element.getInstance( $(this).prev() ).selected( false );
							$(this).toggle( 'fast' );
						}
					}
				} );
			},
			getChildren : function( $selector ) {
				if ( !$selector ) $selector = '[entity=accordionPanel]';
				return clazz.Super.getChildren.call( this, $selector );
			}
		}
	} );
	
} )(jQuery,this);
