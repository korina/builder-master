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
		},
		fields : {
			// Fill with objects like this: { type : '', element : {}, x : 0, y : 0 }
			compsOnStage : [],
			compInPreview : ''
		},
		methods : {
			container : function() {
				return this.getChildById('component-list');
			},
			// Listen for new user interaction and fire appropriate functions.
			// Then add components from the array returned from a POST.
			initialise : function() {
				var me = this;
				// Events
				this.$node().find( '[fluxid=preview]' ).bind( 'mousedown', function( $event ) { 
					me.mousedown( me.compInPreview );
				} );
				// Getting a list of all components, adding them and their details to the list, then colouring the list.
				$.post( types.core.securePath + "component/list", {}, function( data ) {
					data = eval( data ).D;
					if ( types.core.isArray( data ) && data.length > 0 )
						for ( var i = 0; i < data.length; i++ )
							me.addComponent( data[i], data[i].split( '-' ).join( ' ' ) );
					$( '[fluxid=component-bg]' ).filter( ':even' ).each( function() {
						$( this ).data( 'currentInstance' ).style( 'fill', {type: 'solid', colors: [{ rgb: '#dfdfdf' }] }, true );
					} );
				} );
				// Creating the preview element that follows the user's mouse during a drag.
				$( 'body' ).append( '<img fluxid="compPreviewPic" src="" style="position: absolute; display: none" />' );
			},

			bindEvents : function() {
				var me = this;
				this.addListener( 'properties.component.item.hover', function( evt, id ) { me.showPreview( id ); } );
				this.addListener( 'properties.component.item.mousedown', function( evt, id, x, y ) { me.mousedown( id, x, y ); } );
				this.addListener( 'events.components.addedToStage', function( evt, id ) { me.newestComponent( id ); } );
				clazz.Super.bindEvents.apply( this, Array.prototype.slice.call( arguments ) );
			},
			
			/*
			 * Controlling the adding of components to the stage.
			 */
			 
			// Binds the behaviour of mouse move and mouse up, passing 
			mousedown : function( $id, $x, $y ) {
				var me = this;
				$( 'body' ).unbind( 'mousemove', me.mousemove );
				$( 'body' ).bind( 'mousemove', { me : me, id : $id }, me.mousemove );
				$( 'body' ).unbind( 'mouseup', me.mouseUp );
				$( 'body' ).bind( 'mouseup' ,  { me : me, id : $id, x : $x, y : $y }, me.mouseup );
			},
			// Adds a component to the stage and moves it around to follow the mouse.
			// Whilst the component is within the panel it is offset from the mouse (for consistancy with the library).
			mousemove : function( $event ) {
				var pp = $( '[fluxid=compPreviewPic]' ), left, top;
				pp.attr( 'src', types.core.securePath + 'component/' + $event.data.id + '/preview' );
				if ( $event.pageX > 340 ) {
					left = $event.pageX - ( pp[0].width / 2 );
					top = $event.pageY - ( pp[0].height / 2);
				} else {
					left = $event.pageX + 1;
					top = $event.pageY + 1;
				}
				pp.css( {
					'display' : 'block',
					'left' : left,
					'top' : top
				} );
				$( 'body' ).css( 'cursor', 'move' );
			},
			// Sets the position of the component.
			mouseup : function( $event ) {
				var me = $event.data.me,
					id = $event.data.id,
					x = $event.data.x,
					y = $event.data.y;
				if ( $event.pageX > 340 ) {
					me.compsOnStage.push( { 'type' : id, 'element' : {}, 'x' : $event.pageX, 'y' : $event.pageY } );
					me.addToStage( id );
				} else if ( $event.pageX <= x + 5 && $event.pageX >= x - 5 && $event.pageY <= y + 5 && $event.pageY >= y - 5 ) {
					me.compsOnStage.push( { 'type' : id, 'element' : {}, 'x' : 0, 'y' : 0 } );
					me.addToStage( id );
				}
				$( 'body' ).unbind( 'mousemove', me.mousemove );
				$( 'body' ).unbind( 'mouseup', me.mouseUp );
				$( '[fluxid=compPreviewPic]' ).css( 'display', 'none' );
				$( 'body' ).css( 'cursor', 'default' );
			},
			// Moves the last component added to the stage.
			moveLatestComp : function() {
				var lastComp = this.compsOnStage[this.compsOnStage.length - 1],
					element = lastComp.element,
					scale = ( types.editor ) ? types.editor.getInstance().stageScale : 1;
					x = lastComp.x,
					y = lastComp.y,
					stagePos = this.truePosition( $( '[fluxid=stage]' )[0] );
				if ( x != 0 && y != 0 ) {
					element.x( ( ( x - stagePos[0] ) - ( element.$node().outerWidth() / 2 ) ) * ( 1 / scale ), 1 );
					element.y( ( ( y - stagePos[1] ) - ( element.$node().outerHeight() / 2 ) ) * ( 1 / scale ), 1 );
				} else {
					this.cascade( [ element.$node() ] );
				}
			},
			// Removes last component from the stage.
			removeFromStage : function() {
				var comp = this.compsOnStage[this.compsOnStage.length - 1];
				comp.element.remove();
				comp.element.destroy();
				this.compsOnStage.pop();
			},
			// Create a new element in the composition on stage.
			addToStage : function( $id ) {
				$.post( types.core.securePath + "component/" + $id + "/json" ).complete( function( data ) {
					clazz.Super.dispatch.call( this, 'components.add', data.responseText );
				} );
			},
			// Passed the result of an event listener (see 'initialise').
			newestComponent : function( $element ) {
				this.compsOnStage[this.compsOnStage.length - 1].element = $element;
				this.moveLatestComp();
			},
			
			/*
			 * Controlling the list of components.
			 */
			
			// Add a new component to the component list.
			addComponent : function( $id, $label ) {
				var d = this.data.hash['component-button'];
				if ( !!d ) {
					var p = types.serialiser.parse( 'component_' + types.core.nextElementCounter( 'component-list-item' ), d, this.container() );
					p.setId( $id );
					p.setLabel( $label );
					p.setIcon( types.core.securePath + 'component/' + $id + '/icon' );
					types.controls.properties.getInstance().loadSheet( types.core.securePath + 'component/' + $id + '/props', 'properties.' + $id );
				}
				clazz.Super.dispatch.call( this, 'properties.components.item.added', $label, $id );
			},
			// Load the component's large image into the preview pane.
			showPreview : function( $id ) {
				this.compInPreview = $id;
				this.getChildById( 'preview' ).src( types.core.securePath + 'component/' + $id + '/preview' );
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
				for ( var i = 0; i < c.length; i++ ) {
					c[i].remove();
					c[i].destroy();
				}
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
		inherits : types.display.button,
		constructor : function( $id, $descriptor ) {
			clazb.Super.constructor.call( this, $id, $descriptor );
		},
		methods : {
			initialise : function( $id, $descriptor ) {
				clazb.Super.initialise.call( this, $id, $descriptor );
				var me = this;
				this.$node().bind( 'hover', function() { me.hover(); } );
				this.$node().bind( 'mousedown', function( $event ) { me.mousedown( $event ); } );
			},
			setId : function( $id ) {
				this.comId = $id;
			},
			setLabel : function( $label ) {
				this.label = $label;
				this.getChildById('component-label').text( $label );
				this.getChildById('component-label').states.setAttributeOnAllStates( 'text', $label );
			},
			setIcon : function( $icon ) {
				this.icon = $icon;
				this.getChildById('component-icon').src( $icon );
			},
			hover : function() {
				eventDispatcher._dispatch( 'properties.component.item.hover', this.comId );
			},
			mousedown : function( $event ) {
				eventDispatcher._dispatch( 'properties.component.item.mousedown', this.comId, $event.pageX, $event.pageY );
			}
		}
	} );
	
} )(jQuery,this);
