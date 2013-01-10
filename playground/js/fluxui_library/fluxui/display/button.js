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
	 * Button class
	 * Provides for standard interaction for users with FluxUI elements and their states.
	 *
	 * (Lee, should this have 'fields.markup' as '<button />'?)
	 * Provides for mouse interactivity, complete with button specific states. 
	 * 
	 * Requires:
	 *		fluxui.display.element.js
	 **/
	var clazz = $class.create( {
		namespace : 'display.button',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			isSelected : false,
			selectedState : '_selected',
			editableFrames : false,
			isContainer : true
		},
		methods : {
			initialise : function( $id, $descriptor ) {
				var me = this;
				var a = [ 'initial', '_over', '_down', '_selected' ], a, i, j;
				// Create interaction states for the button and its children
				for ( i = 0; i < a.length; i++ )
					if ( !types.core.contains( me.frames.keys, a[i] ) ) {
						me.frames.keys.push( a[i] );
						me.frames.hash[a[i]] = {};
						c = me.getChildren();
						for ( j = 0; j < c.length; j++ )
							if ( !c[j].states.exists( a[i] ) ) c[j].states.addState( a[i] );
					}

				me.$node().css( 'cursor', 'pointer' );

				// Bind frame changes
				me.$node().bind( 'mouseenter', '_over', function( e ) {
					me.changeFrame( e.data );
				} ),
				me.$node().bind( 'mouseleave', 'initial', function( e ) {
					me.changeFrame( ( ( me.isSelected ) ? me.selectedState : e.data ) );
				} ),
				me.$node().bind( 'mousedown', '_down', function( e ) {
					me.changeFrame( e.data );
				} ),
				me.$node().bind( 'mouseup', '_over', function( e ) {
					me.changeFrame( e.data );
				} );
			},
			// Set frame to 'selected'
			selected : function( set ) {
				this.isSelected = set;
				var state = ( set ) ? "_selected" : "initial";
				this.changeFrame( state );
			},
			click : function( $self, $cb ) {
				this.$node().bind( 'click', function( e ) { $cb.call( $self, e ); } );
			},
			
			// actions
			gotoNextFrame : function() {
				if ( !!this.parent().gotoNextFrame )
					this.parent().gotoNextFrame.call( this.parent() );
			},
			gotoPrevFrame : function() {
				if ( !!this.parent().gotoPrevFrame )
					this.parent().gotoPrevFrame.call( this.parent() );
			},
			gotoFrame : function( $e ) {
				if ( !!this.parent().gotoFrame )
					this.parent().gotoFrame.call( this.parent(), $e.value );
			},
			gotoUrl : function( $e ) {
				if ( !!$e.data && types.core.isString( $e.data ) )
					types.core.gotoUrl( $e.data );
			},
			gotoEmail : function( $e ) {
				if ( !!$e.data && types.core.isString( $e.data ) )
					types.core.gotoEmail( $e.data );
			},
			dispatch : function( $e ) {
				if ( !!$e.value && types.core.isString( $e.value ) )
					eventDispatcher.dispatch( this, $e.value );
			}
		}
	} );
	
} )(jQuery,this);
