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
	var selection = types.selection.getInstance();
	var inst = function( $i ) { return types.display.element.getInstance( $i ); };

	/**
	 * Explorer class
	 * Item explorer control, used to list and help manage all items on the stage, as a list.
	 *
	 * Requires:
	 *		../display/element.js
	 *		accordion.js
	 *		accordionpanel.js
	 **/
	 
	var clazz = $class.create( {
		namespace : 'controls.explorer',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		methods : {
			initialise : function() {
				var me = this;
			},
			bindEvents : function() {
				var me = this;
				this.addListener( 'events.explorer.update', function() { me.refresh(); } );
				clazz.Super.bindEvents.apply( this, Array.prototype.slice.call( arguments ) );
			},
			refresh : function() {
				this.clear();
				var items = types.editor.getInstance().currentItem.getChildren();
				var d = this.data.hash['explorer-button'], p;
				if ( !!d ) {
					for ( var i = 0; i < items.length; i++ ) {
						p = types.serialiser.parse( 'explorer_' + types.core.nextElementCounter( 'explorer-list-item' ), d, this.getChildById('explorer-list') );
						if ( i % 2 == 0 ) p.getChildById( 'explorer-bg' ).style( 'fill', { type: 'solid', colors: [{ rgb: '#dfdfdf' }] }, true );
						//p.setId( $id );
						p.setLabel( items[i].fluxid(), items[i].className );
						p.setChild( items[i] );
						p.updateVisible();
					}
				}
			},
			clear : function() {
				var l = this.getChildById( 'explorer-list' ),
					c = l.getChildren();
				for ( var i = 0; i < c.length; i++ )
					c[i].destroy();
				l.empty();
			}
		}
	} );
	
	/**
	 * Explorer item class
	 * Basis for all explorer items. 
	 *
	 * Requires:
	 *		../display/element.js
	 **/
	 
	var clazb = $class.create( {
		namespace : 'controls.exploreritem',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazb.Super.constructor.call( this, $id, $descriptor );
		},
		methods : {
			initialise : function( $id, $descriptor ) {
				//clazb.Super.initialise.call( this, $id, $descriptor );
				var me = this;
				var s = this.getChildById( 'explorer-select' );
				s.click( this, function() {
					s.selected( !s.isSelected );
					if ( s.isSelected ) selection.select( true, me.child.fluxid() );
					else selection.remove( me.child.fluxid() );
					this.dispatch( "stage.manipulator.reset" );
				} );
				var i = this.getChildById( 'explorer-icon' );
				i.$node().click( this, function() {
					if ( s.isSelected && me.child.display() ) {
						s.selected( false );
						selection.remove( me.child.fluxid() );
						this.dispatch( "stage.manipulator.reset" );
					}
					me.child.display( !me.child.display() );
					me.updateVisible.call( me );
				} );
				this.updateVisible();
			},
			bindEvents : function() {
				var me = this;
				this.addListener( 'stage.element.*', function() { me.elementSelected(); } );
				this.addListener( 'events.stage.*', function() { me.elementSelected(); } );
				clazb.Super.bindEvents.apply( this, Array.prototype.slice.call( arguments ) );
			},
			setId : function( $id ) {
				this.comId = $id;
			},
			setLabel : function( $label, $type ) {
				this.label = $label;
				var c = this.getChildById('explorer-label');
				c.text( $label );
				c.states.setAttributeOnAllStates( 'text', $label );
				// The following commented out line doesn't do a thing. Why?
				//this.states.setAttributeOnAllStates( 'title', 'Type: ' + $type );
				this.$node().attr( 'title', 'Type: ' + $type.replace( 'display.', '' ) );
			},
			setChild : function( $child ) {
				this.child = $child;
				var s = this.getChildById( 'explorer-select' );
				s.selected( selection.indexOf( this.child.fluxid() ) > -1 );
			},
			getChild : function() {
				return this.child;
			},
			updateVisible : function() {
				if ( !this.child ) return;
				var i = this.getChildById('explorer-icon');
				i.src( '/assets/icons/' + ( this.child.display() ? '' : 'in' ) + 'visible.png' );
			},
			hover : function() {
				this.dispatch( 'properties.explorer.item.hover', this.comId );
			},
			mousedown : function( $event ) {
				this.dispatch( 'properties.explorer.item.mousedown', this.comId, $event.pageX, $event.pageY );
			},
			elementSelected : function() {
				var s = this.getChildById( 'explorer-select' );
				if ( !s ) return;
				s.selected( selection.indexOf( this.child.fluxid() ) > -1 );
			},
			destroy : function() {
				var me = this;
				me.child = null;
				me.getChildById( 'explorer-select' ).destroy();
				me.getChildById( 'explorer-icon' ).destroy();
				clazb.Super.destroy.call( this );
			}
		}
	} );
	
} )(jQuery,this);
