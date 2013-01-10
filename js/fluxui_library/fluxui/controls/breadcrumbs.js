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

	var btn = {
		type: 'controls.crumb',
		initial: {
			props: {
				display: 'inline',
				position: 'relative',
				height: 25,
				padding: 2,
				'margin-right': 5,
				float: 'left',
				'border-color': '#999999',
				'border-width': 1
			}
		},
		behavior: {
			click: {
				event: 'breadcrumbs.crumb.clicked'
			}
		},
		children: {
			keys: [ 'label' ],
			hash: {
				label: {
					type: 'display.label',
					initial: {
						props: {
							display: 'inline',
							position: 'relative',
							'font-family': 'Arial',
							'font-size': 12,
							color: '#dddddd'
						}
					}
				}
			}
		}
	};

	/**
	 * Breadcrumbs class
	 * Breadcrumb bar demonstrates where in the structure of the composition the stage currently is.
	 *
	 * Requires:
	 *		../display/element.js
	 **/
	
	var clazz = $class.create( {
		namespace : 'controls.breadcrumbs',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			nodePool : null
		},
		methods : {
			// Adds a listener function to switch between crumbs.
			initialise : function( $id, $descriptor ) {
				var me = this;
				this.nodePool = [];
			},

			bindEvents : function() {
				var me = this;
				this.addListener( 'events.stage.level.change', function( $ns, $i ) { me.setLevel( $i ); } );
				clazz.Super.bindEvents.apply( this, Array.prototype.slice.call( arguments ) );
			},
			// Moving between levels in the hierarchy of the composition.
			setLevel : function( $item ) {
				this.emptyCrumbs();
				var p = $item,
					b = [],
					f = null;
				if ( $item.fluxid() != 'stage' ) {
					while ( true ) {
						b.unshift( p );
						p = p.parent();
						if ( !!f ) break;
						if ( p.fluxid() == 'stage' ) f = true;
					}
				} else b.push( $item );
				this.addCrumbs( b );
			},
			// Adding a crumb to the current level in the hierarchy.
			addCrumbs : function( b ) {
				this.emptyCrumbs();
				var l, c;
				if ( !types.core.isArray( b ) || b.length < 1 ) return;
				for ( var i = 0; i < b.length; i++ ) {
					if ( this.nodePool.length > 0 ) {
						c = this.nodePool.pop();
						this.addChildFromClass( c );
					} else {
						l = 'btn_' + i, c;
						types.serialiser.parse( l, btn, this );
						c = this.getChildById( l );
					}
					if ( i >= b.length - 1 )
						c.current = true;
					c.text( b[i].fluxid() );
					c.ref = b[i];
				}
			},
			emptyCrumbs : function() {
				var r = this.getChildren();
				for ( var i = 0; i < r.length; i++ )
					this.nodePool.push( r[i] );
				this.empty();
			}
		},
		statics : {
			getInstance : function( inst ) {
				if ( !!inst )
					types.controls.breadcrumbs._inst = inst;
				return types.controls.breadcrumbs._inst;
			}
		}
	} );

	/**
	 * Crumbs class
	 * Crumbs representing a certain element of the composition within the breadcrumb bar.
	 *
	 * Requires:
	 *		../display/element.js
	 *		breadcrumbs.js
	 **/
	
	var clazb = $class.create( {
		namespace : 'controls.crumb',
		inherits : types.display.button,
		constructor : function( $id, $descriptor ) {
			clazb.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			ref : null,
			current : false
		},
		methods : {
			initialise: function() {
				this.label = this.getChildById( 'label' );
			},
			text: function( $t ) {
				return this.label.text( $t );
			}
		}
	} );
	
} )(jQuery,this);
