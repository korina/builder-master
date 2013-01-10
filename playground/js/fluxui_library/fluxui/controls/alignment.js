/**
 * @author Lee Sylvester & Ed Rogers
 * @copyright Influxis
 **/
( function( $ ) {

	var types = $.fn.fluxui.types;
	var fdata = $.fn.fluxui.fdata;
	var assets = $.fn.fluxui.assets;
	var $class = $.fn.fluxui.$class;
	var selection = types.selection.getInstance();
	var eventDispatcher = types.events.dispatcher.getInstance();
	var inst = function( $i ) { return types.display.element.getInstance( $i ); };

	/**
	 * Alignment class
	 * Provides these alignment options for targetted elements on the stage; align, match, distribute, space, anchor
	 * 
	 * Requires:
	 *		manipulator.js
	 *		../events/dispatcher.js
	 *		../display/element.js
	 *		../selection.js
	 *		accordion.js
	 *		accordionpanel.js
	 **/
	 
	$class.create( {
		namespace : 'controls.alignment',
		constructor : function() {
			var me = this;
			// Adding listenening functions for each of the alignment methods herein.
			eventDispatcher.addListeners( {
				'properties.align.*' : function( $ns, $evt ) { me.align( $ns ); },
				'properties.match.*' : function( $ns, $evt ) { me.match( $ns ); },
				'properties.distribute.*' : function( $ns, $evt ) { me.distribute( $ns ); },
				'properties.space.*' : function( $ns, $evt ) { me.space( $ns ); },
				'properties.anchor.*' : function( $ns, $evt ) { me.anchor( $ns, inst( $($evt.target) ).checked() ); },
				'properties.alignment' : function( $ns, $evt ) { me.alignType( inst( $($evt.target) ).value() ); }
			} );
		},
		methods : {
			// Align moves all elements so that they all fit along the same straight line, either left, right, top, bottom, or centred on x or y.
			align : function( $ns ) {
				var ts = selection.targets(), align,
					i = types.display.element.getInstance,
					evt = $ns.replace( 'properties.align.', '' );
				selection.add( 'overlay' );
				switch ( evt ) {
					// So for example here ever target ('t') in 'ts' is checked to see if it is to the left of the previous further left value
					// recorded. If it is then its value replaces the current until we have the leftmost value, which is applied to all.
					case 'left' :
						align = parseInt( ts[0].css( 'left' ) );
						for ( t in ts )
							if ( ts[t].attr( 'fluxid' ) !== 'overlay' && parseInt( ts[t].css( 'left' ) ) < align )
								align = parseInt( ts[t].css( 'left' ) );
						for ( t in ts )
							ts[t].css( 'left', align );
						break;
					case 'right' :
						align = parseInt( ts[0].css( 'left' ) ) + parseInt( ts[0].outerWidth() );
						for ( t in ts )
							if ( ts[t].attr( 'fluxid' ) !== 'overlay' && ( parseInt( ts[t].css( 'left' ) ) + parseInt( ts[t].outerWidth() ) ) > align )
								align = parseInt( ts[t].css( 'left' ) ) + parseInt( ts[t].outerWidth() );
						for ( t in ts )
							ts[t].css( 'left', align - parseInt( ts[t].outerWidth() ) );
						break;
					case 'top' :
						align = parseInt( ts[0].css( 'top' ) );
						for ( t in ts )
							if ( ts[t].attr( 'fluxid' ) !== 'overlay' && parseInt( ts[t].css( 'top' ) ) < align )
								align = parseInt( ts[t].css( 'top' ) );
						for ( t in ts )
							ts[t].css( 'top', align );
						break;
					case 'bottom' :
						align = parseInt( ts[0].css( 'top' ) ) + parseInt( ts[0].outerHeight() );
						for ( t in ts )
							if ( ts[t].attr( 'fluxid' ) !== 'overlay' && ( parseInt( ts[t].css( 'top' ) ) + parseInt( ts[t].outerHeight() ) ) > align )
								align = parseInt( ts[t].css( 'top' ) ) + parseInt( ts[t].outerHeight() );
						for ( t in ts )
							ts[t].css( 'top', align - parseInt( ts[t].outerHeight() ) );
						break;
					// For centred alignment the initial stage of finding the align value is complicated somewhat by taking all the central points
					// of each target and divided by the number. Then, rather than applying this value to all targets, it is only applied to those
					// that deviate from this by more than two pixels to avoid drift (caused by decimal places) when aligning multiple times.
					case 'center.x' :
						align = 0;
						for ( t in ts )
							if ( ts[t].attr( 'fluxid' ) !== 'overlay' )
								align = align + ( parseInt( ts[t].css( 'left' ) ) + ( parseInt( ts[t].outerWidth() ) / 2 ) );
						for ( t in ts ) {
							var newp = ( align / ( ts.length - 1) ) - ( parseInt( ts[t].outerWidth() ) / 2 ),
								oldp = parseInt( ts[t].css( 'left' ) );
							if ( ( newp - oldp ) * ( newp - oldp ) >= 2 )
								ts[t].css( 'left', newp )
						}
						break;
					case 'center.y' :
						align = 0;
						for ( t in ts )
							if ( ts[t].attr( 'fluxid' ) !== 'overlay' )
								align = align + ( parseInt( ts[t].css( 'top' ) ) + ( parseInt( ts[t].outerHeight() ) / 2 ) );
						for ( t in ts ) {
							var newp = ( align / ( ts.length - 1) ) - ( parseInt( ts[t].outerHeight() ) / 2 ),
								oldp = parseInt( ts[t].css( 'top' ) );
							if ( ( newp - oldp ) * ( newp - oldp ) >= 2 )
								ts[t].css( 'top', newp )
						}
						break;
					default :
						console.log( evt );
						break;
				}
				// Now the manipulator, referring to the stage element with the fluxid of 'overlay', is updated to reflect the new boundries.
				types.controls.manipulator.getInstance().update();
			},
			// (Ed & Lee, Match does not account for padding at the moment).
			// Match find the widest and highest target and applies its width or height (or both) to all other targets.
			match : function( $ns ) {
				if ( selection.length() < 1 ) return;
				var ts = selection.targets(), align,
					evt = $ns.replace( 'properties.match.', '' ),
					width = 0,
					height = 0;
				if ( evt === 'width' || evt === 'both' ) {
					for ( t in ts )
						if ( ts[t].attr( 'fluxid' ) !== 'overlay' && ts[t].outerWidth() > width )
							width = ts[t].outerWidth();
					for ( t in ts )
						if ( ts[t].attr( 'fluxid' ) !== 'overlay' )
							ts[t].css( 'width', width - ( parseInt( ts[t].css( 'border-left-width' ) ) * 2 ) );
				}
				if ( evt === 'height' || evt === 'both' ) {
					for ( t in ts )
						if ( ts[t].attr( 'fluxid' ) !== 'overlay' && ts[t].outerHeight() > height )
							height = ts[t].outerHeight();
					for ( t in ts )
						if ( ts[t].attr( 'fluxid' ) !== 'overlay' )
							ts[t].css( 'height', height - ( parseInt( ts[t].css( 'border-left-width' ) ) * 2 ) );
				}
				types.controls.manipulator.getInstance().update();
			},
			// Distribute give each target an equal amount of space on the stage within the outer bounds of the manipulator (the stage
			// element with a fluxid of 'overlay'). The targets are then arranged within this space to the right, left, top, bottom or
			// centred along x or y.
			distribute : function( $ns ) {
				if ( selection.length() < 1 ) return;
				var m = types.controls.manipulator.getInstance, evt = $ns.replace( 'properties.distribute.', '' ),
					d = m().getDimentions(), nts = selection.sort( evt, 'overlay' ), l = nts.length - 1,
					x1 = parseInt( nts[0].css( 'left' ) ), x2 = parseInt( nts[l].css( 'left' ) ),
					y1 = parseInt( nts[0].css( 'top' ) ), y2 = parseInt( nts[l].css( 'top' ) );
				for ( nt = 1; nt < l; nt++ ) {
					if ( evt === 'left' ) {
						var sectors = ( x2 - x1 ) / l,
							sector = sectors * nt;
						nts[nt].css( 'left', x1 + sector );
					}
					if ( evt === 'center.x' ) {
						var p1 = x1 + ( nts[0].outerWidth() / 2 ),
							p2 = x2 + ( nts[l].outerWidth() / 2 ),
							sectors = ( p2 - p1 ) / l,
							sector = sectors * nt;
						nts[nt].css( 'left', p1 + sector - ( nts[nt].outerWidth() / 2 ) );
					}
					if ( evt === 'right' ) {
						var p1 = x1 + nts[0].outerWidth(),
							p2 = x2 + nts[l].outerWidth(),
							sectors = ( p2 - p1 ) / l,
							sector = sectors * nt;
						nts[nt].css( 'left', p1 + sector - nts[nt].outerWidth() );
					}
					if ( evt === 'top' ) {
						var sectors = ( y2 - y1 ) / l,
							sector = sectors * nt;
						nts[nt].css( 'top', y1 + sector );
					}
					if ( evt === 'center.y' ) {
						var p1 = y1 + ( nts[0].outerHeight() / 2 ),
							p2 = y2 + ( nts[l].outerHeight() / 2 ),
							sectors = ( p2 - p1 ) / l,
							sector = sectors * nt;
						nts[nt].css( 'top', p1 + sector - ( nts[nt].outerHeight() / 2 ) );
					}
					if ( evt === 'bottom' ) {
						var p1 = y1 + nts[0].outerHeight(),
							p2 = y2 + nts[l].outerHeight(),
							sectors = ( p2 - p1 ) / l,
							sector = sectors * nt;
						nts[nt].css( 'top', p1 + sector - nts[nt].outerHeight() );
					}
				}						
				m().update();
			},
			// Space creates an equal margin between every target element. You will note that, as with distribute, the manipulator is being
			// used to define the outer boundries of the targets and that the targets are being sorted prior to being rearranged, simplifying
			// the process.
			space : function( $ns ) {
				if ( selection.length() < 1 ) return;
				var m = types.controls.manipulator.getInstance;
				var evt = $ns.replace( 'properties.space.', '' ),
					d = m().getDimentions(), nts = selection.sort( 'center.' + evt, 'overlay' ),
					l = nts.length - 1, w1 = nts[0].outerWidth(), w2 = nts[l].outerWidth(), l1 = nts[0].outerHeight(), l2 = nts[l].outerHeight(),
					xy = ( evt === 'x' ) ? ( d.w - d.l - w1 - w2 ) : ( d.h - d.t - l1 - l2 ), margin = 0;
				for ( nt = 1; nt < l; nt++ )
					margin = ( evt === 'x' ) ? margin + nts[nt].outerWidth() : margin + nts[nt].outerHeight();
				margin = ( xy - margin ) / l;
				for ( nt = 1; nt < l; nt++ )
					if ( nt !== 0 && nt !== l ) {
						if ( evt === 'x' )
							nts[nt].css( 'left', parseInt( nts[nt -1 ].css( 'left' ) ) + nts[nt - 1].outerWidth() + margin );
						if ( evt === 'y' )
							nts[nt].css( 'top', parseInt( nts[nt -1 ].css( 'top' ) ) + nts[nt - 1].outerHeight() + margin );
					}
				m().update();
			},
			alignType : function( $type ) {
				var t = selection.targets(), i;
				if ( t.length < 1 ) return;
				switch( $type ) {
					case 'none':
						for ( i = 0; i < t.length; i++ )
							if ( inst( $(t[i]) ).fluxid() != 'overlay' ) {
								inst( $(t[i]) ).states.setAttributeOnCurrentState( 'anchor', null );
								inst( $(t[i]) ).states.setAttributeOnCurrentState( 'center', null );
								inst( $(t[i]) ).center( $type );
							}
						break;
					case 'anchor':
						
						break;
					case 'horz':
					case 'vert':
					case 'both':
						for ( i = 0; i < t.length; i++ )
							if ( inst( $(t[i]) ).fluxid() != 'overlay' ) {
								inst( $(t[i]) ).states.setAttributeOnCurrentState( 'anchor', null );
								inst( $(t[i]) ).states.setAttributeOnCurrentState( 'center', $type );
								inst( $(t[i]) ).center( $type );
							}
						break;
				}
			},
			// This function is incomplete.
			anchor : function( $ns, $checked ) {
				console.log( $ns, $checked );
			}
		}
	} );
	
} )(jQuery,this);
