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
	 * State panel class
	 * The state panel allows the user to manage the states used for their composition. 
	 *
	 * Requires:
	 *		../display/element.js
	 *		accordion.js
	 *		accordionpanel.js
	 **/
	
	var clazz = $class.create( {
		namespace : 'controls.statePanel',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
			types.controls.statePanel.inst = this;
		},
		fields : {
			currentItem : null
		},
		methods : {
			// Define all the children by short form names, then attach corresponding functions to user interaction events with them.
			initialise : function( $id, $descriptor ) {
				this.duration = this.getChildById( 'state-duration' );
				this.easing = this.getChildById( 'state-easing' );
				this.stateName = this.getChildById( 'states-fld' );
				this.list = this.getChildById( 'states-list' );
				this.up = this.getChildById( 'up-state-btn' );
				this.down = this.getChildById( 'down-state-btn' );
				this.add = this.getChildById( 'add-state-btn' );
				this.remove = this.getChildById( 'remove-state-btn' );
				
				this.up.click( this, this.upClick );
				this.down.click( this, this.downClick );
				this.add.click( this, this.addClick );
				this.remove.click( this, this.removeClick );
				this.list.change( this, this.listChange );
				this.duration.change( this, this.durationChange );
				this.easing.change( this, this.easingChange );
				
				this.reset();
			},
			// Removes all states from the list.
			reset : function() {
				this.list.removeAll();
			},
			// Removes all items from the list, then adds every state described in the passed item.
			populate : function( $item ) {
				this.reset();
				var f = $item.frames.keys || [];
				if ( f.length == 0 || f.indexOf( 'initial' ) < 0 ) f.unshift( 'initial' );
				for ( var i = 0; i < f.length; i++ )
					this.list.addItem( f[i] );
				this.currentItem = $item;
				this.list.index(0);
				this.list.$node().trigger( 'change' );
			},
			
			// Handlers for user made changes.
			upClick : function( $e ) {
				if ( this.list.index() > 0 &&
					 this.currentItem.editableFrames == true ) {
					var from = this.list.index(), to = from - 1, o = this.list.moveItem( from, to );
					this.list.index( to );
					this.updateFrames();
				}
			},
			downClick : function( $e ) {
				if ( this.list.index() >= 0 &&
					 this.list.index() < this.list.length() - 1 &&
					 this.currentItem.editableFrames == true ) {
					var from = this.list.index(), to = from + 1, o = this.list.moveItem( from, to );
					this.list.index( to );
					this.updateFrames();
				}
			},
			addClick : function( $e ) {
				var n = this.stateName.text();
				if ( n != '' && !this.list.contains( n ) &&
					 this.currentItem.editableFrames == true ) {
					this.list.addItem( n );
					this.stateName.text('');
					this.updateFrames();
				}
			},
			removeClick : function( $e ) {
				if ( this.list.index() > 0 &&
					 this.currentItem.editableFrames == true ) {
					this.list.removeItem( this.list.text() );
					this.updateFrames();
				}
			},
			listChange : function( $e, $duration ) {
				var me = this,
					f = me.frameData(),
					$duration = ( !isNaN( $duration ) ) ? $duration : null;
				if ( f != null ) {
					me.duration.text( f.duration );
					me.easing.value( f.easing );
				}
				this.currentItem.changeFrame( this.list.text(), function() {
					types.controls.manipulator.getInstance().update();
					this.dispatch( 'stage.element.change' );
				}, $duration );
			},
			durationChange : function() {
				var f = this.frameData(), t = parseInt( this.duration.text() );
				if ( f != null && !isNaN( t ) ) f.duration = t;
			},
			easingChange : function() {
				var f;
				if ( f = this.frameData() ) f.easing = this.easing.value();
			},

			// Returns data for frames.
			frameData : function() {
				var i = this.list.index(),
					f = this.currentItem.frames,
					k = f.keys, h;
				if ( i > -1 ) {
					h = f.hash[k[i]];
					if ( !h || !h.duration || !h.easing ) {
						h = f.hash[k[i]] = {duration: 300, easing: 'linearTween'};
					}
					return h;
				}
				return null;
			},
			// Updates frames.
			updateFrames : function() {
				var f = this.currentItem.frames, k = f.keys = [];
				var i, t, l, c = this.list.$node().children();
				for ( i = 0; i < this.list.length(); i++ ) {
					t = $(c[i]), l = t.text();
					k.push( l );
					if ( !f.hash[l] ) f.hash[l] = {};
				}
				for ( i in f.hash ) {
					if ( f.hash.hasOwnProperty( i ) ) {
						if ( k.indexOf( i ) == -1 ) {
							delete t.hash[i];
							t.hash[i] = null;
						}
					}
				}
			}
		},
		statics : {
			inst : null,
			getInstance : function() {
				return types.controls.statePanel.inst;
			}
		}
	} );
	
} )(jQuery,this);
