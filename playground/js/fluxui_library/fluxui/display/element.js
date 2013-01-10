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
	var defaultStateName = 'initial';
	
	/**
	 * Element class
	 * This is the base class for all display objects
	 *
	 * Requires:
	 *		color.js
	 *		core.js
	 *		style.js
	 *		tween.js
	 **/
	$class.create( { 
		namespace : 'display.element',
		// Constructor is called immediately.
		constructor : function( $id, $descriptor, $node ) {
			this._fluxid = $id;
			this.states = new types.state( $descriptor.initial, $descriptor.states );
			this.frames = types.core.clone( $descriptor.frames ) || {keys : [], hash : {}};
			this.data = types.core.clone( $descriptor.data ) || {};
			this.actions = new types.interaction( this, $descriptor.behavior, $descriptor.bind );
			this.makeNode( $node );
			this.__container = this;
			this.__bg = this;
			this.__bgOuter = this;
			this.__border = this;
			this._children = [];
			this.propStore = {};
		},
		fields : {
			markup : '<div />',
			states : null,
			frames : null,
			frame : defaultStateName,
			propStore : null,
			editableFrames : true
		},
		props : {
			'position' : 'absolute',
			'top' : 0,
			'left' : 0,
			'padding' : 0,
			'margin' : 0,
			'box-sizing' : 'border-box',
			'-moz-box-sizing' : 'border-box', /* Firefox */
			'-webkit-box-sizing' : 'border-box', /* Safari */
			'vertical-align' : 'baseline',
			'word-wrap' : 'break-word',
			'max-width' : 'none',
			'max-height' : 'none',
			'zoom' : 1,
			'overflow' : 'hidden',
			'border' : 'solid',
			'border-radius' : 0,
			'border-width' : 0,
			'border-color' : '#000000',
			'border-style' : 'solid'
		},
		methods : {
			// Initialise functions are called after the node has been added to the DOM.
			// They are therefore useful for specific tasks, such as setting the style on a child element.
			
			/**
			 * Identification
			 **/
			
			// The individual object id
			fluxid : function( value ) {
				if ( !!value )
					this.$node().attr( 'fluxid', value );
				return this.$node().attr( 'fluxid' );
			},
			// The string representation of its class
			entity : function( value ) {
				if ( !!value )
					this.$node().attr( 'entity', value );
				return this.$node().attr( 'entity' );
			},
			
			/**
			 * Node specific
			 **/
			 
			// The class' underlying HTML node.
			$node : function() {
				return $(this.node);
			},
			// Creates a node based on the current state
			makeNode : function( $node ) {
				var data = this.states.getCurrentStateData();
				var n = ( !!$node ) ? $node : $(this.markup);
				n.data( 'currentInstance', this );
				this.node = n.get( 0 );
				this.entity( this.className );
				this.fluxid( this._fluxid );
				return this.node;
			},
			
			/**
			 * Relationships
			 **/

			// Gets a class instance for passed element and passes it to addChildFromClass.
			addChild : function( n ) {
				var c = types.display.element.getInstance( n );
				return this.addChildFromClass( c );
			},

			// Appends a class instance to the current element and its children value, also setting parent value of new instance appropriately.
			addChildFromClass : function( c ) {
				if ( !this.__container ) console.log( this.fluxui(), this.entity() );
				this.__container.$node().append( c.$node() );
				this._children.push( c );
				c._parent = this;
				return c;
			},

			// Looks for a child element at the array location provided.
			getChildAt : function( i ) {
				var c = this.__container.$node().children().get( i );
				if ( !!c )
					return types.display.element.getInstance( c );
			},

			// Searches for child elements whose fluxid values match the given value.
			getChildrenById : function( id ) {
				var c = this.__container.$node().find( "*[fluxid='" + id + "']" );
				if ( !!c ) { 
					if ( types.core.isArray( c ) && c.length > 0 )
						for ( var i = 0; i < c.length; i++ )
							c[i] = types.display.element.getInstance( c[i] );
					else
						c = [types.display.element.getInstance( c )];
				}
				return c;
			},

			// Search for a single child element whose fluxid value matches the given value.
			getChildById : function( id ) {
				return this.getChildrenById( id )[0];
			},

			// Returns an array of children instances using a selector.
			getChildren : function( $selector ) {
				if ( !$selector ) $selector = '*';
				var t, r = [], c = this.__container.$node().children( $selector );
				if ( c.length > 0 )
					for ( var i = 0; i < c.length; i++ ) {
						t = types.display.element.getInstance( c[i] );
						if ( !!t )
							r.push( t );
					}
				return r;
			},

			// Returns all childrens' fluxids.
			getChildIds : function() {
				var r = [], c = this.getChildren();
				for ( var i = 0; i < c.length; i++ )
					r.push( c[i].fluxid() );
				return r;
			},

			// Returns the number of children.
			numChildren : function() {
				return this.getChildren().length;
			},

			// Removes a given child.
			removeChild : function( n ) {
				var c = types.display.element.getInstance( n );
				this._children.splice( n.index(), 1 );
				$(n).remove();
				return c;
			},

			// Removes a child at the array location given.
			removeChildAt : function( i ) {
				var c = this.getChildAt( i );
				this._children.splice( i, 1 );
				if ( !c )
					return;
				c.$node().remove();
				return c;
			},

			// JQuery remove function.
			remove : function() {
				this.$node().remove();
			},

			// JQuery empty function.
			empty : function() {
				this._children = [];
				this.__container.$node().empty();
			},

			// Returns parent of DOM element.
			$parent : function() {
				return this.$node().parent();
			},

			// Returns parent of class instance.
			parent : function() {
				return this._parent;
			},
			
			/**
			 * Frames
			 * Frames dictate the states of the children and their transitional properties.
			 * Changing frame updates all children to a given state, determined by name and
			 * frame properties. When the frame changes, all children must transition to a
			 * matched state. Thus, the current frame name will be the new state, while
			 * a childs state name won't change until the state has successfully transitioned.
			 **/

			// Returns number of frames.
			numFrames : function() {
				return this.frames.keys.length;
			},
			
			// updates the state of the immediate children
			changeFrame : function( $frameName, $callback ) {
				// check that a frame change is appropriate
				if ( $frameName == this.frame 
				  || ( $frameName != defaultStateName 
					&& ( !types.core.contains( this.frames.keys, $frameName ) || this.numFrames() < 1 )
					 )
				  || this.numChildren() < 1 ) {
					if ( !!$callback ) $callback.call( this, false );
					return;
				}
				var f = this.frames.hash[$frameName] || {};
				
				// set base transform values
				var duration = f.duration || $.fn.fluxui.settings.defaultTransform.duration;
				var easing = f.easing || $.fn.fluxui.settings.defaultTransform.easing;
				var completeAction = f.after || $.fn.fluxui.settings.defaultTransform.after;
				
				var c = this.getChildren();
				var completed = c.length;
				var callback = function() {
					completed--;
					if ( completed == 0 && !!$callback )
						$callback.call( this, true );
				}
				
				this.frame = $frameName;
				
				for ( var i = 0; i < c.length; i++ )
					c[i].updateState( $frameName, duration, easing, callback );
			},
			
			// returns true if all child states match current frame
			checkAllChildrenTransitioned : function() {
				var c = this.getChildren();
				for ( var i = 0; i < c.length; i++ )
					if ( c[i].states.currentState() != this.frame )
						return false;
				return true;
			},
			
			gotoPrevFrame : function() {
				var indx, k = this.frames.keys, i;
				for ( i = 0; i < k.length; i++ )
					if ( k[i] == this.frame )
						indx = i;
				indx = ( indx == 0 ) ? k.length - 1 : indx - 1;
				this.changeFrame( k[indx] );
			},
			
			gotoNextFrame : function() {
				var indx, k = this.frames.keys, i;
				for ( i = 0; i < k.length; i++ )
					if ( k[i] == this.frame )
						indx = i;
				indx = ( indx == k.length - 1 ) ? 0 : indx + 1;
				this.changeFrame( k[indx] );
			},
			
			gotoFrame : function( $frm ) {
				if ( !$frm || $frm == '' ) return;
				this.changeFrame( $frm );
			},
			
			/**
			 * States
			 * A state is a given snapshot of this objects styles. See 'Frames' above.
			 **/
			
			updateState : function( $stateName, $duration, $easing, $callback ) {
				if ( !this.states.exists( $stateName ) ) this.states.addState( $stateName );
				var to = this.states.getStateData( $stateName ),
					from = this.states.getCurrentStateData();
				if ( to.attr )
					this.applyAttributes( to.attr );
				if ( !isNaN( $duration ) && $duration > 0 ) {
					var me = this;
					var cb = function() {
							$callback.call( this );
						};
					types.tween.to( this, $duration, { to : to, from : from, easing : $easing, callback : cb } );
					me.states.currentState( $stateName );
				} else {
					if ( to.props )
						this.applyStyles( to.props );
					this.states.currentState( $stateName );
					$callback.call( this );
				}
			},
			
			/**
			 * Styles
			 **/
			
			// apply the current state styles
			applyStateStyles : function() {
				var p = types.core.clone( this.props );
				var s = this.states.getCurrentStateData();
				$.extend( p, s.props || {} );
				this.applyStyles( p );
			},
			
			// apply a range of styles
			applyStyles : function( props ) {
				var n = this.$node();
				for ( var v in props )
					if ( props.hasOwnProperty( v ) )
						this.style( v, props[v] );
			},
			
			// update a given style on the node
			style : function( type, prop, updateState ) {
				if ( !!prop && !!updateState )
					this.states.style( type, types.core.clone( prop ) );
				if ( type == 'border-radius' )
					return this.borderRadiusStyle( prop );
				if ( type == 'fill' )
					return this.backgroundStyle( prop );
				if ( type == 'rotate' )
					return this.rotationStyle( prop );
				if ( types.style.isColor( type ) )
					return this.colorStyle( type, prop );
				if ( !isNaN( parseInt( prop ) ) )
					return this.numericStyle( type, prop );
				return this.stringStyle( type, prop );
			},
			
			removeStyle : function( type ) {
				if ( !!type )
					this.$node().css( type, '' );
			},
			
			// called by style; updates a numeric style value
			numericStyle : function( type, val ) {
				if ( !isNaN( parseInt( val ) ) ) {
					if ( val.toString().indexOf( '%' ) > -1 )
						this.$node().css( type, parseInt( val ) + "%" );
					else
						this.$node().css( type, parseInt( val ) + "px" );
				}
				return parseInt( this.$node().css( type ) );
			},
			
			// called by style; updates a string style value
			stringStyle : function( type, val ) {
				if ( typeof val == "string" && val != "" )
					this.$node().css( type, val );
				return this.$node().css( type );
			},
			
			// called by style; updates a color style value
			colorStyle : function( type, val ) {
				if ( types.core.isString( val ) )
					val = types.color.fromHex( val );
				if ( types.core.isColor( val ) )
					this.$node().css( type, types.color.toHex( val ) );
				return types.color.fromRGBA( types.color.hexToRGBA( this.$node().css( type ) || '#00000000' ) );
			},
			
			// called by style; updates the background style value
			backgroundStyle : function( val ) {
				var t = 'fill';
				if ( !!val && !!types.core.isColor( val ) ) {
					val.type = val.type || 'solid';
					var bg = types.style.normaliseFill( val );
					this.__bg.$node().css( 'filter', bg.filter );
					for ( var c = 0; c < bg.background.length; c++ )
						this.__bg.$node().css( 'background', bg.background[c] );
				}
				return this.states.style( t ) || types.color.fromHex( '#999999' );
			},

			// called by style: updates the rotation style value
			rotationStyle : function( val ) {
				var t = 'rotate';
				if ( !!val && !isNaN( parseInt( val ) ) ) {
					var r = types.style.normaliseRotation( val, this.width(), this.height() );
					for ( var c in r )
						if ( r.hasOwnProperty( c ) )
							this.$node().css( c, r[c] );
				}
				return this.states.style( t ) || 0;
			},

			// called by style: updates the border radius style value
			borderRadiusStyle : function( val ) {
				var type = 'border-radius';
				if ( !!val && !isNaN( val ) ) {
					var br = types.style.normaliseBorder( val );
					for ( var i in br )
						if ( br.hasOwnProperty( i ) )
							this.numericStyle( i, br[i] );
					this.propStore[type] = val;
				}
				return this.propStore[type] || 0;
			},
			 
			/**
			 * Attributes
			 **/

			// Gets all attributes from the state and passes them to 'applyAttributes'
			applyStateAttributes : function() {
				var s = this.states.getCurrentStateData();
				this.applyAttributes( s.attr );
			},

			// For each attribute passed in the object, calls 'attribute'
			applyAttributes : function( attrs ) {
				for ( var i in attrs )
					if ( attrs.hasOwnProperty( i ) )
						this.attribute( i, attrs[i] );
			},

			// Updates the values for an the node, plus optionally updating it for the state.
			attribute : function( attr, value, updateState ) {
				if ( !!value ) {
					if ( !!updateState )
						this.states.setAttributeOnCurrentState( attr, value );
					switch( attr ) {
						case 'anchor':
						case 'center':
						case 'drag':
							this[attr]( value );
							break;
						default:
							this.$node().attr( attr, value );
					}
				}
				return this.$node().attr( attr );
			},
			 
			/**
			 * Transformation
			 * Pass true as a second param in order to update the current state template
			 **/

			// Sets the resize function to anchor the element's edges to certain positions.
			anchor : function( $a ) {
				if ( $a != null && types.core.isArray( $a ) ) {
					var $a = $a.slice(0);
					switch ( $a.length ) {
						case 1:
							var v = $a[0];
							$a = [v,v,v,v];
							break;
						case 2:
							var v = $a[0], w = $a[1];
							$a = [v,w,v,w];
							break;
						case 3:
							$a[3] = $a[2];
							break;
						default:
							break;
					}
					var p = this.$parent();
					var t = this.$node(), me = this;
					var loc = [me.y(), p.width() - me.width() - me.x(), p.height() - me.height() - me.y(), me.x()];
					p.resize( function() {
						if ( $a[1] != 0 ) {
							if ( $a[3] != 0 )
								me.width( p.width() - me.x() - loc[1] );
							else
								me.x( p.width() - me.width() - loc[1] );
						}
						if ( $a[2] != 0 ) {
							if ( $a[0] != 0 )
								me.height( p.height() - me.y() - loc[2] );
							else
								me.y( 'y', p.height() - me.height() - loc[2] );
						}
					} );
				}
			},

			// Sets the resize function to keep the element central.
			center : function( $c ) {
				if ( !!$c && types.core.isString( $c ) ) {
					var me = this,
						t = this.$node(),
						p = this.parent().$node();
					p.unbind( 'resize' );
					if ( $c == 'none' ) return;
					p.resize( function() {
						if ( $c == 'horz' || $c == 'both' ) {
							me.x( ( p.outerWidth() - t.outerWidth() ) / 2 );
						} if ( $c == 'vert' || $c == 'both' ) {
							me.y( ( p.outerHeight() - t.outerHeight() ) / 2 );
						}
					} );
					p.trigger( 'resize' );
				}
			},
			
			// Set an element as draggable.
			drag : function( $d ) {
				// We need to make sure that no more than one event for drag and drop are called
				if ( $d.ondrag )  {
					eventDispatcher.unbind( this.$node(), 'dragged', $d.ondrag );
					eventDispatcher.bind( this.$node(), 'dragged', $d.ondrag );
				}
				if ( $d.ondrop ) {
					eventDispatcher.unbind( this.$node(), 'dropped', $d.ondrop );
					eventDispatcher.bind( this.$node(), 'dropped', $d.ondrop );
				}
				this.actions.initDrag( this, $d );
			},

			// Simultaneously sets the position and size of the element.
			rect : function( $r ) {
				if ( !!$r ) {
					if ( !isNaN( $r.x ) ) this.x( $r.x );
					if ( !isNaN( $r.y ) ) this.y( $r.y );
					if ( !isNaN( $r.w ) ) this.width( $r.w );
					if ( !isNaN( $r.h ) ) this.height( $r.h );
				}
				return { x : this.x(), y : this.y(), w : this.width(), h : this.height() };
			},

			// Setting individual position values for an element.
			
			x : function( $x ) {
				return parseInt( this.style( 'left', $x, arguments[1] != null ) );
			},
			
			y : function( $y ) {
				return parseInt( this.style( 'top', $y, arguments[1] != null ) );
			},
			
			width : function( $w ) {
				return parseInt( this.style( 'width', $w, arguments[1] != null ) );
			},
			
			height : function( $h ) {
				return parseInt( this.style( 'height', $h, arguments[1] != null ) );
			},
			
			visible : function( $v ) {
				$v = ( $v != null ) ? ( ( !!$v ) ? 'inherit' : 'hidden' ) : null;
				return ( this.style( 'visibility', $v, arguments[1] != null ) != 'hidden' );
			},
			
			display : function( $d ) {
				$d = ( $d != null ) ? ( ( !!$d ) ? 'inherit' : 'none' ) : 'inherit';
				return ( this.style( 'display', $d, arguments[1] != null ) != 'none' );
			},
			
			/**
			 * DOM related functions
			 **/
			
			// Returns mouse position for both desktop and mobile browsers
			mousePosition : function( $event ) {
				var e = $event ? $event : window.event,

				    m = types.interaction.eventSupport( 'touchstart' );
				return {
					x : m === true ? e.originalEvent.touches[0].pageX : e.pageX,
					y : m === true ? e.originalEvent.touches[0].pageY : e.pageY
			   	}
			},
			
			/**
			 * Editor related functions
			 * For obvious reasons, these need to be kept to a minimal
			 **/
			
			// broadcasts a change in properties
			broadcast : function() {
				eventDispatcher.dispatch( this, 'events.' + this.className + '.changed', this );
			}
		},
		statics : {
			// Returns the passed $node's class instance.
			getInstance : function( $node ) {
				return $($node).data( 'currentInstance' );
			},
			// Returns whether or not the class type has been loaded
			classLoaded : function( $type ) {
				var segs = $type.split( '.' ), t = types;
				for ( var i = 0; i < segs.length; i++ ) {
					t = t[segs[i]];
					if ( !t ) return false;
				}
				return true;
			},
			make : function( $type, $id, $descriptor, $node ) {
				if ( !$id || $id == "" ) $id = $type + '_' + types.core.nextElementCounter();
				if ( !$descriptor ) $descriptor = { initial : {}, states : {} };
				var segs = $type.split( '.' ), t = types;
				for ( var i = 0; i < segs.length; i++ )
					t = t[segs[i]];
				return new t( $id, $descriptor, $node );
			}
		}
	} );
	
} )(jQuery,this);
