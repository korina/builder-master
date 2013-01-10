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
	 * Components class
	 * Component control, including grabbing the component files and adding them to stage.
	 *
	 * Requires:
	 *		../display/element.js
	 *		accordion.js
	 *		accordionpanel.js
	 **/
	 
	var clazz = $class.create( {
		namespace : 'controls.components',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
			this.comCounter = 0;
		},
		methods : {
			container : function() {
				return this.getChildById('component-list');
			},
			// Listen for new user interaction and fire appropriate functions.
			// Then add components from the array returned from a POST.
			initialise : function() {
				var me = this;
				eventDispatcher.addListeners( {
					'properties.component.item.clicked' : function( evt, id ) { me.showPreview( id ); },
					'properties.component.item.dblclicked' : function( evt, id ) { me.addToStage( id ); }
				} );
				$.post( "data/?action=components", {}, function( data ) {
					data = eval( data );
					if ( types.core.isArray( data ) && data.length > 0 )
						for ( var i = 0; i < data.length; i++ )
							me.addComponent( data[i], data[i].split( '-' ).join( ' ' ) );
				} );
			},
			// Create a new element in the composition on stage.
			addToStage : function( $id ) {
				$.post( "data/?action=getComponent&id=" + $id, {}, function( data ) {
					eventDispatcher.dispatch( this, 'components.add', data );
				} );
			},
			// Add a new component to the component list.
			addComponent : function( $id, $label ) {
				var d = this.data.hash['component-button'];
				if ( !!d ) {
					var p = types.serialiser.parse( 'component_' + this.comCounter++, d, this.container() );
					p.setId( $id );
					p.setLabel( $label );
					p.setIcon( 'data/?action=getComponent&id=' + $id + '&type=icon' );
					types.controls.properties.getInstance().loadSheet( 'data/?action=getComponent&id=' + $id + '&type=props', 'properties.' + $id );
				}
				eventDispatcher._dispatch( 'properties.components.item.added', $label, $id );
			},
			// Load the component's large image into the preview pane.
			showPreview : function( $id ) {
				this.getChildById( 'preview' ).src( 'data/?action=getComponent&id=' + $id + '&type=preview' );
			},
			// Computes the meaning of love, life, and bacon sandwiches.
			getComponents : function() {
				var d = {};
				var c = this.container().getChildren();
				for ( var i = 0; i < c.length; i++ )
					d[c[i].label] = { id: c[i].comId };
				return d;
			},
			clear : function() {
				var c = this.container().getChildren();
				for ( var i = 0; i < c.length; i++ )
					c[i].remove();
			}
		}
	} );
	
	/**
	 * Component class
	 * Basis for all components. 
	 *
	 * Requires:
	 *		../display/element.js
	 **/
	 
	var clazb = $class.create( {
		namespace : 'controls.componentitem',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazb.Super.constructor.call( this, $id, $descriptor );
		},
		methods : {
			initialise : function() {
				var me = this;
				this.$node().bind( 'click', function() { me.click(); } );
				this.$node().bind( 'dblclick', function() { me.dblclick(); } );
			},
			setId : function( $id ) {
				this.comId = $id;
			},
			setLabel : function( $label ) {
				this.label = $label;
				this.getChildById('component-label').text( $label );
			},
			setIcon : function( $icon ) {
				this.icon = $icon;
				this.getChildById('component-icon').src( $icon );
			},
			click : function() {
				eventDispatcher._dispatch( 'properties.component.item.clicked', this.comId );
			},
			dblclick : function() {
				eventDispatcher._dispatch( 'properties.component.item.dblclicked', this.comId );
			}
		}
	} );
	
} )(jQuery,this);
