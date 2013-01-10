$(document).ready( function() {
	var $class = $.fn.fluxui.$class;
	var types = $.fn.fluxui.types;
	var assets = $.fn.fluxui.assets;

	$class.create( {
		namespace : 'accordion',
		inherits : types.element,
		constructor : function( $id, $state ) {
			this.Super( $id, $state );
			if ( !!$state.data.hash.button ) {
				var c = this.$node().children();
				for ( var i = 0; i < c.length; i++ ) {
					var child = $state.data.hash.button;
					var l = new types.button( 'button', child.states._default );
					l.applyProperties( { props: { position: 'relative' } } );
					var p = $(c[i]).wrap( '<div></div>' ).parent();
					p.prepend( l.node );
					l.applyProperties( { props: { width: this.width } }, $state );
					var inst = types.element.getInstance( c[i] );
					l.$node().find( "div[fluxid='label']" ).html( inst.text );
					if ( inst.icon != '' )
						l.$node().find( "img[fluxid='icon']" ).attr( 'src', inst.icon );
					$(c[i]).hide();
					if ( !!l.initialise )
						l.initialise( child.states._default );
					var acc = this;
					l.$node().bind( 'click', function( evt ) {
						acc.handleClick( evt.currentTarget );
					} );
				}
			}
		},
		methods: {
			handleClick: function( $btn ) {
				var panel = $($btn).next()[0];
				this.$node().find( "div[entity='accordionPanel']" ).each( function() {
					if ( this == panel ) {
						types.element.getInstance( $btn ).selected( !$(this).is(':visible') );
						$(this).toggle( 'fast' );
					}
				} );
			}
		}
	} );

	$class.create( {
		namespace : 'accordionPanel',
		inherits : types.element,
		constructor : function( $id, $state ) {
			this.Super( $id, $state );
			this.applyProperties( { props: { position: 'relative' } }, $state );
			this.text = $state.text;
			if ( !!assets[$state.icon] )
				this.icon = assets[$state.icon].url;
		},
		fields : {
			props : {
				position: 'relative'
			},
			text : '',
			icon : ''
		}
	} );

	$class.create( {
		namespace : 'colorpicker',
		inherits : types.element,
		constructor : function( $id, $state ) {
			var me = this;
			// force availability of the change event
			me.$node().bind('change', function(){});
			// now it's safe to call extended class
			this.Super( $id, $state );
			me.$node().append('<div style="background-color: #999999; width: 20px; height: 20px;"></div>');
			me.$node().ColorPicker({
				color: '#0000ff',
				onShow: function (colpkr) {
					$(colpkr).fadeIn(500);
					return false;
				},
				onHide: function (colpkr) {
					$(colpkr).fadeOut(500);
					return false;
				},
				onChange: function (hsb, hex, rgb) {
					var c = types.colorpicker.current( me )
					c.color = '#' + hex.substr( 0, 6 );
					c.$node().find('div').css('background-color', c.color);
					c.$node().trigger('change');
				}
			});
			var a = $state.attr;
			if ( !!a )
				this.allowGradient = a.allowGradient == true;
			var b = $state.bind;
			if ( !!b )
				for ( var i in b ) {
					if ( b.hasOwnProperty( i ) ) {
						if ( !!b[i].event )
							types.events.dispatcher.getInstance().addListener( b[i].event, function( $ns, $data ) {
								if ( i == 'color' ) {
									if ( !!$data )
										me.setColor( $data );
								} else 
									me.$node().attr( i, $data );
							} );
					}
				}
		},
		fields: {
			color: '#999999',
			allowGradient: false,
			props: {
				width: 20,
				height: 20
			}
		},
		methods: {
			setColor : function( color ) {
				var swatch = this.$node().find('div');
				types.colorpicker.colorize( swatch, color );
				this.color = color;
				this.$node().trigger('change');
			}
		},
		statics: {
			_current: null,
			current: function( cp ) {
				if ( !!cp )
					types.colorpicker._current = cp;
				return types.colorpicker._current;
			},
			colorize: function( $div, $color ) {
				if ( !!$color && !!$color.colors ) {
					var bg = types.style.normaliseFill( $color );
					$div.css('background', "");
					$div.css('background-color', "");
					$div.css( 'filter', bg.filter );
					for ( var c = 0; c < bg.background.length; c++ )
						$div.css('background', bg.background[c]);
				} else if ( typeof $color == 'string' ) {
					$div.css('background', "");
					$div.css('background-color', $color);
				}
			}
		}
	} );

	$class.create( {
		namespace : 'manipulator',
		inherits : types.element,
		constructor : function( $id, $state ) {
			this.Super( $id, $state );
			var me = this;
			types.events.dispatcher.getInstance().addListener( 'stage.element.selected', function( $ns, $prev, $cur, $e ) {
				if ( !!$cur ) {
					me.attach( $cur, $e );
					me.applyAttributes( $state.attr );
				} else {
					me.remove();
				}
				types.manipulator.child = $cur;
			} );
			this.$node().css( { border: 'solid 1px #000099', overflow: 'visible' } );
			types.manipulator._instance = this;
			this.remove();
			
			// create the eight resize buttons
			var s = types.manipulator.hndWidth;
			var btnState = {
				props : {
					background : '#fff',
					width : s,
					height : s
				}
			};
			var stopPropogation = function( e ) {
				if ( e )
					e.stopPropagation();
				if ( window.event )
					window.event.cancelBubble = true;
			};
			this.$node().bind( 'click', stopPropogation );
			for ( var i = 0; i < 8; i++ ) {
				btn = new types.element( 'handle_' + i, btnState );
				btn.$node().css( { border : 'solid 1px #000099' } );
				if ( i == 0 || i >= 6 )
					btn.$node().css( 'left', -( s / 2 ) );
				else if ( i >= 2 && i <= 4 )
					btn.$node().css( 'right', -( s / 2 ) ).css( 'left', '' );
				else
					btn.$node().css( { left: '50%', 'margin-left': -(s/2) } );
				if ( i <= 2 )
					btn.$node().css( 'top', -( s / 2 ) );
				else if ( i >= 4 && i <= 6 )
					btn.$node().css( 'bottom', -( s / 2 ) ).css( 'top', '' );
				else
					btn.$node().css( { top: '50%', 'margin-top': -(s/2) } );
				btn.$node().bind( 'click', stopPropogation );
				btn.$node().bind( 'mousedown', this.btnDrag );
				$( 'body' ).bind( 'mouseup', this.btnDrop );
				this.$node().append( btn.node );
			}
			// Needs to be spun out into a class of its own, 'styledSelection' perhaps.
			rangy.init();
		},
		methods : {
			attach : function( $child, $e ) {
				if ( $e.shiftKey === false )
					this.remove();
				var inst = types.element.getInstance( $child ).$node();
				this.addTargets( inst.attr( 'fluxid' ) );
				for ( i = 0; i < 8; i++ )
					this.$node().find( "div[fluxid='handle_" + i + "']" ).toggle( types.element.targets.length == 1 );
				if ( $e.shiftKey === false && inst.attr( 'entity' ) == 'label' )
					this.update( 'under' );
				else
					this.update( 'over' );
			},
			update : function( $stack ) {
				d = this.getDimentions(), l = d.l, t = d.t, w = d.w, h = d.h;
				types.manipulator.getInstance().setRect( l, t, w - l, h - t );
				if ( $stack && $stack === 'over' ) {
					for ( t in types.element.targets );
					types.manipulator.getInstance().$node().css( 'z-index', 1 );
						types.element.targets[t].css( 'z-index', 0 );
				} else if ( $stack && $stack === 'under' ) {
					for ( t in types.element.targets )
						types.element.targets[t].css( 'z-index', 1 );
					types.manipulator.getInstance().$node().css( 'z-index', 0 );
				}
			},
			getDimentions : function() {
				var i, b, tl, tt, t = 9999, l = 9999, w = 0, h = 0, e;
				var j = types.element.targets;
				for ( i = 0; i < j.length; i++ ) {
					if ( j[i].attr( 'fluxid' ) !== 'overlay' ) {
						b = tl = parseInt( j[i].css( 'left' ) );
						if ( !isNaN( b ) && b < l ) l = b;
						b = tt = parseInt( j[i].css( 'top' ) );
						if ( !isNaN( b ) && b < t ) t = b;
						b = tl + j[i].outerWidth();
						if ( !isNaN( b ) && b > w ) w = b;
						b = tt + j[i].outerHeight();
						if ( !isNaN( b ) && b > h ) h = b;
					}
				}
				return { l : l, t : t, w : w, h : h }
			},
			remove : function() {
				var i = types.manipulator.getInstance();
				i.clearTargets();
				i.update();
				i.setRect( -9999, -9999, 10, 10 );
				types.manipulator.child = null;
			},
			btnDrag : function( e ) {
				var i = types.manipulator.getInstance();
	
				if ( e == null ) 
					e = window.event; 
	
				var t = e.target != null ? e.target : e.srcElement;
				
				var hnd = $(t).attr('fluxid');
				if ( hnd.indexOf( 'handle_' ) == -1 ) return;
				var id = parseInt( hnd.split( 'handle_' ).join('') );
				var posX = 0, posY = 0;
				var s = types.manipulator.hndWidth;
				
				if ( id >= 2 && id <= 4 )
					posX = i.$node().width();
				else if ( id == 1 || id == 5 )
					posX = i.$node().width() / 2;
				if ( id >= 4 && id <= 6 )
					posY = i.$node().height();
				else if ( id == 3 || id == 7 )
					posY = i.$node().height() / 2;
				
				i.selectedHndId = id;
				i._w = i.$node().width();
				i._h = i.$node().height();
				i._lo = parseInt( i.$node().offset().left );
				i._to = parseInt( i.$node().offset().top );
				i._l = parseInt( i.$node().css( 'left' ) );
				i._t = parseInt( i.$node().css( 'top' ) );
				i.dragElement = t;

				document.onmousemove = i.btnMove;

				document.body.focus();
				document.onselectstart = function () { return false; };
				t.ondragstart = function() { return false; };

				return false;
			},
			btnDrop : function( e ) {
				var i = types.manipulator.getInstance();
				if ( i.dragElement != null ) {
					document.onmousemove = null;
					document.onselectstart = null;
					i.dragElement.ondragstart = null;
			
					i.dragElement = i.selectedHndId = i._h = i._w = i._l = i._t = i._lo = i._to = null;
					types.events.dispatcher.getInstance().dispatch( i, 'stage.element.change' );
				}
			},
			btnMove : function( e ) {
				var i = types.manipulator.getInstance(),
					j = $(types.element.targets[0]),
					me = i.$node(),
					id = i.selectedHndId,
					w = null,
					b = ( parseInt( j.css( 'border-left-width' ) ) * 2 ) + ( parseInt( j.css( 'padding-left' ) ) * 2 );
					
				if ( e == null ) 
					var e = window.event;
				
				if ( id >= 4 && id <= 6 ) {
					var l = e.clientY - i._to;
					if ( e.shiftKey === true ) {
						me.width( i._w + ( l - i._h ) );
						j.width( i._w + ( l - i._h ) - b );
					}
					me.height( l );
					j.height( l - b );
				}
				else if ( id >= 0 && id <= 2 ) {
					var $y = e.clientY,
						t = { 'top' : $y - ( i._to - i._t ) },
						h = ( i._to + i._h ) - $y;
					me.css( t );
					j.css( t );
					me.height( h );
					j.height( h - b );
				}
				if ( id >= 2 && id <= 4 ) {
					w = e.clientX - i._lo;
					if ( e.shiftKey === true ) {
						me.height( i._h + ( w - i._w ) );
						j.height( i._h + ( w - i._w ) - b );
					}
					me.width( w );
					j.width( w -b );
				}
				else if ( id == 0 || id >= 6 ) {
					var $x = e.clientX,
						l = { 'left' : $x - ( i._lo - i._l ) }
						w = ( i._lo + i._w ) - $x;
					
					me.css( l );
					j.css( l );
					me.width( w );
					j.width( w - b );
				}
			},
			// Needs to be spun out into a class of its own, 'styledSelection' perhaps.
			setStyleClass : function( $style, $values ) {
				var values = '<style fluxid=' + $style + '>.' + $style + '{ ' + $values + ' }</style>';
				if ( $( 'head [fluxid=' + $style + ']' ).length !== 0 )
					this.removeStyleClass( $style );
				$( 'head' ).append( values );
			},
			removeStyleClass : function( $style ) {
				if ( !$style )
					$( 'head [fluxid]' ).remove();
				else
					$( 'head [fluxid=' + $style + ']' ).remove();
			},
			returnStyleClasses : function() {
				var styles =  [];
				$( 'head [fluxid]' ).each( function() {
					styles.push( $( this ).attr( 'fluxid' ) );
				} );
				return styles;
			},
			toggleStyleClass : function( $style ) {
				if ( rangy.supported && rangy.modules.CssClassApplier && rangy.modules.CssClassApplier.supported )
					cssApplier = rangy.createCssClassApplier( $style, { normalize : true } ).toggleSelection();
				else
					console.log( '"Rangy" library has either not loaded or is unsupported on this browser' );
			}
		},
		statics : {
			_instance : null,
			child : null,
			hndWidth : 10,
			getInstance : function() {
				return types.manipulator._instance;
			}
		}
	} );
	
	types.element.prototype.fui_selectable = false;
	types.element.fui_selectedItem = null;
	types.element.prototype.fui_select = function( e ) {
		if ( e )
			e.stopPropagation();
		if ( window.event )
			window.event.cancelBubble = true;
		if ( types.element.getInstance( this ).fui_selectable === true ) {
			var cur = types.element.fui_selectedItem;
			types.element.fui_selectedItem = this;
			types.events.dispatcher.getInstance().dispatch( this, "stage.element.selected", cur, this, e || window.event );
		}
	};
} );
