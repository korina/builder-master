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
	var eventDispatcher = types.events.dispatcher.getInstance();

	/**
	 * PropSheet class
	 * This is the base class for property sheets, providing common functions.
	 *
	 * Requires:
	 *		../element.js
	 **/
	 
	var clazz = $.fn.fluxui.$class.create( {
		namespace : 'properties.propsheet',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		methods : {
			initialise : function( $id, $descriptor ) {
				var me = this;
				eventDispatcher.addListener( 'properties.' + this.ens + '.*', function( $ns, $evt ) {
					me.handlePropertyChange( $($evt.target) );
				} );
				eventDispatcher.addListener( 'events.' + this.ens + '.changed', function( $ns, $cls ) {
					me.handleElementChange( $ns, $cls );
				} );
				this.selection = types.selection.getInstance();
				this.manipulator = types.controls.manipulator.getInstance();
			},
			handleElementChange : function( $ns, $cls ) {
				if ( $cls.entity() == this.ens )
					this.updatePropertyFields( $cls, 'events.' + this.ens );
			},
			// Standard set of property fields to be updated. This function is often overwritten by specific propsheets.
			updatePropertyFields : function( $cls, $prefix ) {
				var d = eventDispatcher;
				d.dispatch( this, $prefix + '.width.changed', $cls.width() );
				d.dispatch( this, $prefix + '.height.changed', $cls.height() );
				d.dispatch( this, $prefix + '.left.changed', parseInt( $cls.x() ) );
				d.dispatch( this, $prefix + '.top.changed', parseInt( $cls.y() ) );
				d.dispatch( this, $prefix + '.border-radius.changed', $cls.states.style( 'border-radius' ) );
				d.dispatch( this, $prefix + '.border-width.changed', parseInt( $cls.$node().css( 'border-left-width' ) ) );
				if ( $cls.states.style( 'border-color' ) )
					d.dispatch( this, $prefix + '.border-color.changed', types.core.clone( $cls.states.style( 'border-color' ) ) );
				d.dispatch( this, $prefix + '.id.changed', $cls.attribute( 'id' ) );
				d.dispatch( this, $prefix + '.class.changed', $cls.attribute( 'class' ));	
				d.dispatch( this, $prefix + '.text-align.changed', $cls.states.style( 'text-align' ) );
				d.dispatch( this, $prefix + '.text-decoration.changed', $cls.states.style( 'text-decoration' ) );
				d.dispatch( this, $prefix + '.font-family.changed', $cls.states.style( 'font-family' ) );
				d.dispatch( this, $prefix + '.font-size.changed', $cls.states.style( 'font-size' ) );
				d.dispatch( this, $prefix + '.font-weight.changed', $cls.states.style( 'font-weight' ) );
				if ( $cls.states.style( 'fill' ) )
					d.dispatch( this, $prefix + '.fill.changed', types.core.clone( $cls.states.style( 'fill' ) ) );
				if ( $cls.states.style( 'color' ) )
					d.dispatch( this, $prefix + '.color.changed', types.core.clone( $cls.states.style( 'color' ) ) );
				d.dispatch( this, $prefix + '.font-family.changed', $cls.states.style( 'font-family' ) );
				d.dispatch( this, $prefix + '.font-size.changed', parseInt( $cls.states.style( 'font-size' ) ) );
				d.dispatch( this, $prefix + '.flux-id.changed', $cls.fluxid() );
				
				d.dispatch( this, 'events.alignment.changed', $cls.states.getCurrentStateData().attr.center );
				if ( !!$cls.text )
					d.dispatch( this, $prefix + '.text.changed', $cls.text() );
			},
			// Applies a property change in the properties panel to the element in question.
			handlePropertyChange : function( $control ) {
				if ( this.selection._targets.length < 1 ) return;
				var t = types.display.element.getInstance( this.selection.targets(0).get(0) ),
					i = this.manipulator,
					n = parseInt( $control.val() ),
					s = $control.val(),
					fid = $control.attr( 'fluxid' );
				switch( fid ) {
					case 'flux-id':
						t.fluxid( s );
						break;
					case 'left':
					case 'top':
					case 'width':
					case 'height':
						i.style( fid, n );
					case 'font-family':
					case 'font-size':
					case 'border-width':
					case 'border-radius':
					case 'text-align':
					case 'text-decoration':
					case 'font-weight':
						t.style( fid, s, 1 );
						break;
					case 'color':
					case 'border-color':
						t.style( fid, types.controls.colorpicker.current().color, 1 );
						break;
					case 'fill':
						var c = types.controls.colorpicker.current();
						if ( types.core.isString( c.color ) )
							t.style( 'fill', { type: 'solid', colors: [ { rgb: c.color, opacity: c.opacity } ] }, 1 );
						else
							t.style( 'fill', types.core.clone( c.color ), 1 );
						break;
					case 'class':
					case 'id':
					case 'src':
						t.attribute( fid, s, 1 );
						break;
					case 'text':
						t.text( s, 1 );
						break;
					case 'reset-asset':
						t.resetSize( function( w, h ) {
							t.width( i.width( w ), 1 );
							t.height( i.height( h ), 1 );
						} );
						break;
					case 'placeholder-asset':
						t.clearSrc();
						this.propPanel.getChildById( 'asset-source' ).index( 0 );
						break;
				}
				types.controls.manipulator.getInstance().update();
			}
		}
	} );
	
} )(jQuery,this);
