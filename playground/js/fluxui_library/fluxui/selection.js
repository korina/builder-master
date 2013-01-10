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
	 * Selection class
	 * Deals with  the management of selecting and ordering 'targets', that is elements to be manipulated.
	 **/
	
	$class.create( {
		namespace : 'selection',
		constructor : function() {
			this._targets = [];
			this.targetsRelativePos = { x : [], y : [] };
			this.touches = {};
		},
		methods : {
			// Adds elements to the targets array.
			add : function( $t ) {
				if ( !types.core.isArray( $t ) ) {
					if ( this.indexOf( $t ) < 0 ) this._targets.push( $( '[fluxid="' + $t + '"]' ) );
				} else
					for ( var o = 0; o < $t.length; o++ )
						if ( this.indexOf( $t[o] ) < 0 )
							this._targets.push( $( '[fluxid="' + $t[o] + '"]' ) );
			},
			// Removes elements from the targets array.
			remove : function( $t ) {
				if ( !types.core.isArray( $t ) )
					this._targets.splice( this.indexOf( $t ), 1 );
				else
					for ( var o = 0; o < $t.length; o++ )
						this._targets.splice( this.indexOf( $t[o] ), 1 );
			},
			// Returns the index of a particular target.
			indexOf : function( $t ) {
				for ( var u = 0; u < this.length(); u++ )
					if ( this._targets[u].attr( 'fluxid' ) == $t )
						return u;
				return -1;
			},
			// Rearranges the order of the targets according to their position on the stage.
			// The ignored target will not be accounted for or added to the returned array.
			sort : function( $evt, $ignore ) {
				var ts = this._targets, nts = [];
				if ( ts[0].attr( 'fluxid' ) !== $ignore ) nts.splice(0, 0, ts[0] );
				else nts.splice(0, 0, ts[1] );
				if ( $evt === 'left' )
					for ( t in ts )
						if ( ts[t].attr( 'fluxid' ) !== $ignore )
							for ( nt in nts )
									if ( parseInt( ts[t].css( 'left' ) ) < parseInt( nts[nt].css( 'left' ) ) ) {
										nts.splice( nt, 0, ts[t] );
										break;
									} else if ( nt == nts.length - 1 && t != 0 )
										nts.splice( nt + 1, 0, ts[t] );
				if ( $evt === 'center.x' )
					for ( t in ts )
						if ( ts[t].attr( 'fluxid' ) !== $ignore ) 
							for ( nt in nts )
									if ( parseInt( ts[t].css( 'left' ) ) + ( ts[t].outerWidth() / 2 ) < parseInt( nts[nt].css( 'left' ) ) + ( nts[nt].outerWidth() / 2 ) ) {
										nts.splice( nt, 0, ts[t] );
										break;
									} else if ( nt == nts.length - 1 && t != 0 )
										nts.splice( nt + 1, 0, ts[t] );
				if ( $evt === 'right' )
					for ( t in ts )
						if ( ts[t].attr( 'fluxid' ) !== $ignore ) 
							for ( nt in nts )
									if ( parseInt( ts[t].css( 'left' ) ) + ts[t].outerWidth() < parseInt( nts[nt].css( 'left' ) ) + nts[nt].outerWidth() ) {
										nts.splice( nt, 0, ts[t] );
										break;
									} else if ( nt == nts.length - 1 && t != 0 )
										nts.splice( nt + 1, 0, ts[t] );
				if ( $evt === 'top' )
					for ( t in ts )
						if ( ts[t].attr( 'fluxid' ) !== $ignore )
							for ( nt in nts )
									if ( parseInt( ts[t].css( 'top' ) ) < parseInt( nts[nt].css( 'top' ) ) ) {
										nts.splice( nt, 0, ts[t] );
										break;
									} else if ( nt == nts.length - 1 && t != 0 )
										nts.splice( nt + 1, 0, ts[t] );
				if ( $evt === 'center.y' )
					for ( t in ts )
						if ( ts[t].attr( 'fluxid' ) !== $ignore )
							for ( nt in nts )
									if ( parseInt( ts[t].css( 'top' ) ) + ( ts[t].outerHeight() / 2 ) < parseInt( nts[nt].css( 'top' ) ) + ( nts[nt].outerHeight() / 2 ) ) {
										nts.splice( nt, 0, ts[t] );
										break;
									} else if ( nt == nts.length - 1 && t != 0 )
										nts.splice( nt + 1, 0, ts[t] );
				if ( $evt === 'bottom' )
					for ( t in ts )
						if ( ts[t].attr( 'fluxid' ) !== $ignore ) 
							for ( nt in nts )
									if ( parseInt( ts[t].css( 'top' ) ) + ts[t].outerHeight() < parseInt( nts[nt].css( 'top' ) ) + nts[nt].outerHeight() ) {
										nts.splice( nt, 0, ts[t] );
										break;
									} else if ( nt == nts.length - 1 && t != 0 )
										nts.splice( nt + 1, 0, ts[t] );
				return nts;
			},
			// Selects elements to be manipulated. Arguments: multiselect, target
			select : function( $ms, $t ) {
				if ( ( !$ms || $ms === false ) && $t != 'overlay' )
					this.clear();
				this.add( $t );
			},
			clear : function() {
				this._targets = [];
				this.targetsRelativePos = { x : [], y : [] };
			},
			targets : function( $t ) {
				if ( !isNaN($t) )
					return this._targets[$t];
				return this._targets.slice(0);
			},
			length : function() {
				return this._targets.length;
			}
		},
		statics : {
			getInstance : function() {
				var me = types.selection;
				if ( !me._inst )
					me._inst = new me();
				return me._inst;
			},
			initGlobalSelection : function() {
				types.display.element.prototype.fui_selectable = false;
				types.display.element.fui_selectedItem = null;
				types.display.element.prototype.fui_select = function( e ) {
					if ( e )
						e.stopPropagation();
					if ( window.event )
						window.event.cancelBubble = true;
					var c = types.display.element.getInstance( this );
					if ( c.fui_selectable === true ) {
						var a = c.$node().parent().attr( 'fluxid' );
						if ( a == 'stage' || a == 'view' ) {
							var cur = types.display.element.fui_selectedItem;
							types.display.element.fui_selectedItem = this;
							eventDispatcher.dispatch( this, "stage.element.selected", cur, this, e || window.event );
						} else
							c.$node().parent().trigger( 'click' );
					}
				};
			}
		}
	} );
	
} )(jQuery,this);
