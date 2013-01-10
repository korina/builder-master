$(document).ready( function() {
	var $$class = $.fn.fluxui.$class;
	var types = $.fn.fluxui.types;
	var assets = $.fn.fluxui.assets;
	var selection = types.selection.getInstance();
	var eventDispatcher = types.events.dispatcher.getInstance();
	var inst = function( $i ) { return types.display.element.getInstance( $i ); };

	/**
	 * Editor class
	 * The editor, or Builder, is the embedded 'movie' users can use to create other 'movies' in a simple GUI focused fashion.
	 *
	 * Requires:
	 *		../controls/*.js
	 *		../display/*.js
	 *		../events/*.js
	 *		../properties/*.js
	 **/
	
	$$class.create( {
		namespace : 'editor',
		constructor : function( $movie ) {
			var _editor = this;
			this.ed = $('#movie-container');
			this.ws = $movie.getChildById( 'workspace' );
			this.stage = $movie.getChildById( 'stage' );
			this.container = $movie.getChildById( 'stage-container' );
			this.view = $movie.getChildById( 'view' );
			this.menu = $movie.getChildById( 'menu' );
			this.hud = $movie.getChildById( 'hud' );
			this.library = $movie.getChildById( 'library-panel' );
			this.propPanel = $movie.getChildById( 'propSheets' );
			this.colorPanel = $movie.getChildById( 'color-panel' );
			this.statePanel = types.controls.statePanel.getInstance();
			this.breadcrumbs = $movie.getChildById( 'breadcrumbs' );
			$('body').css( { overflow: 'hidden', margin: 0, padding: 0 } );
			this.currentItem = this.stage;
			this.manipulator = types.controls.manipulator.getInstance( 'overlay', this.manipulatorObj );
			
			this.manipulator.applyStateStyles();
			this.hud.addChild( this.manipulator.node );
			this.manipulator.initialise();
			this.manipulator.applyStateAttributes();
			
			this.initialise( $movie );
		},
		fields : {
			ed : null,
			ws : null,
			stage : null,
			hud : null,
			view : null,
			movie : null,
			menu : null,
			library : null,
			elementCounter : 0,
			currentItem : null,
			manipulatorObj : {
				initial : {
					attr : {
						drag: {
							restraint : 'workspace',
							ondrag : 'stage.element.drag',
							ondrop : 'stage.element.drop'
						}
					}
				},
				frames : { keys : [], hash : {} }
			},
			eventDispatcher : null,
			manipulator : null,
			// panels
			propPanel : null,
			colorPanel : null
		},
		methods : {
			initialise : function( $movie ) {
				var _editor = this;
				var ws = this.ws;
				
				// apply selection functions to element class
				types.selection.initGlobalSelection();
				types.core.devMode = true;
				
				var t = types.properties;
				t.stage.create();
				t.container.create();
				t.button.create();
				t.image.create();
				t.label.create();
				
				this.breadcrumbs.setLevel( this.stage );
				this.statePanel.populate( this.stage );
				
				this.stage.broadcast = function() {
					eventDispatcher.dispatch( _editor.stage, 'events.stage.changed', _editor.stage );
				};
				
				var c = this.container.$node();
				c.bind( 'click', function(e) {
					_editor.manipulator.remove();
					_editor.showPropertySheet( 'stage' );
					_editor.stage.broadcast();
				} );
				c.bind( 'dblclick', function(e) {
					_editor.closeElement();
				} );
							
				$(window).resize( function() {
					_editor.ed.width( $(this).width() );
					_editor.ed.height( $(this).height() );
					_editor.updateHud();
				} ).trigger( 'resize' );
	
				this.ws.$node().resize( function() {
					_editor.handleWorkspaceResize();
				} );
				
				// update stage property sheet
				eventDispatcher.dispatch(this,'events.stage.width.changed',this.stage.width());
				eventDispatcher.dispatch(this,'events.stage.height.changed',this.stage.height());
				eventDispatcher.dispatch(this,'events.stage.id.changed',this.stage.attribute( 'id' ));
				eventDispatcher.dispatch(this,'events.stage.class.changed',this.stage.attribute( 'class' ));
				eventDispatcher.dispatch(this,'events.stage.fill.changed',this.stage.style( 'fill' ));
				
				// attach events
				eventDispatcher.addListeners( {
					'events.stage.width' : function( ns, n ) {
						_editor.stage.width( n );
						_editor.stage.center( 'both' );
						_editor.updateHud();
					},
					'events.stage.height' : function( ns, n ) {
						_editor.stage.height( n );
						_editor.stage.center( 'both' );
						_editor.updateHud();
					},
					'events.stage.fill' : function( ns, c ) {
						var col = c.color;
						if ( types.core.isString( col ) ) {
							col = {
								type: 'solid',
								colors: [
									{
										rgb: col,
										opacity: 1,
										pos: 0.1
									}
								]
							}
						}
						_editor.stagecolor = col;
						_editor.stage.style( 'fill', col, 1 );
					},
					'color.gradient.update' : function( ns, color ) {
						var swatch = types.controls.colorpicker.current();
						if ( swatch.allowGradient )
							swatch.setColor( color );
					},
					'controls.add.*' : function( ns, evt ) {
						_editor.addElement( ns );
					},
					'components.add' : function( ns, data ) {
						_editor.addComponent( data );
					},
					'stage.element.selected' : function( $ns, $prev, $cur, $evt ) {
						_editor.showPropertySheet.call( _editor, inst( $cur ).entity() );
						_editor.handleElementChange.call( _editor, $ns, $prev, $cur, $evt );
					},
					'stage.element.change' : _editor.handleElementChange,
					'stage.element.dropped' : _editor.handleElementChange,
					'properties.library.item.added' : function( $ns, $label, $url ) {
						_editor.propPanel.getChildById( 'src' ).addItem( $label );
					},
					'properties.library.item.removed' : function( $ns, $label ) {
						_editor.propPanel.getChildById( 'src' ).removeItem( $label );
					},
					'events.element.open' : function() {
						_editor.openElement();
					},
					'breadcrumbs.crumb.clicked' : function( $ns, $evt ) {
						var i = inst( $($evt.target) );
						if ( i.className != 'controls.crumb' ) i = i.parent();
						if ( i.current == false ) {
							while ( _editor.currentItem != _editor.stage && _editor.view.pointer != i.ref )
								_editor.closeElement();
						}
					},
					'menu.click.*' : function( $ns ) {
						_editor.handleMenu( $ns );
					},
					'dialog.confirm.save-movie' : function( $ns, $filename ) {
						_editor.movieName = $filename;
						_editor.save( $filename );
						types.controls.dialog.getInstance().hide();
					},
					'dialog.confirm.open-movie' : function( $ns, $filename ) {
						_editor.open( $filename );
						types.controls.dialog.getInstance().hide();
					},
					'dialog.confirm.register-user' : function( $ns, $user, $pass ) {
						_editor.register( $user, $pass );
					},
					'events.keys.press' : function() {
						_editor.keyDown.apply( _editor, Array.prototype.slice.call( arguments ) );
					}
				} );
				this.setupKeys();
				this.alignment = new types.controls.alignment();
				this.propPanel.getChildById( 'src' ).addItem( '-- Please select --', '-' );
				this.showPropertySheet( 'stage' );
			},
			
			// Movie handling

			// Starting a new project, with an alert asking users to save the old.
			newRequest : function( $force ) {
				this.postSaveCB = null;
				var ed = this;
				if ( this.stage.numChildren() > 0 && !$force ) {
					if ( confirm( 'Do you wish to save your current project?' ) ) {
						this.postSaveCB = function() {
							ed.newRequest( true );
						};
						this.saveRequest();
						return;
					}
				}
				this.newProject();	
			},
			// Saving a project. See 'save' below.
			saveRequest : function() {
				var d = types.controls.dialog.getInstance();
				if ( !d.isOpen() ) {
					this.closeToStage();
					if ( this.movieName == null ) {
						var d = types.controls.dialog.getInstance();
						d.setContent( d.saveMovie );
						d.show();
					} else this.save( this.movieName );
				}
			},
			// Opening a new project.
			openRequest : function( $force ) {
				this.postSaveCB = null;
				var ed = this;
				if ( this.stage.numChildren() > 0 && !$force ) {
					if ( confirm( 'Do you wish to save your current project?' ) ) {
						this.postSaveCB = function() {
							ed.openRequest( true );
						};
						this.saveRequest();
						return;
					}
				}
				$.ajax( {
					url: "data/?action=list"
				} ).done( function( data ) {
					ed.updateOpenDialog( data );
				} );
			},
			updateOpenDialog : function( $d ) {
				var l = JSON.parse( $d );
				var d = types.controls.dialog.getInstance();
				if ( l == -1 )
					return d.alert( 'Please login.' );
				if ( !types.core.isArray( l ) )
					return d.alert( 'An error occurred trying to retrieve your files. Please contact an Administrator.' );
				var d = types.controls.dialog.getInstance();
				if ( !d.isOpen() ) {
					this.closeToStage();
					var lst = d.getChildById( d.fileOpenList );
					lst.removeAll();
					lst.addItem( '-- Please Select --', '-' );
					for ( var i = 0; i < l.length; i++ )
						lst.addItem( l[i].name );
					d.setContent( d.openMovie );
					d.show();
				}				
			},
			// Logging a user into his or her account (allows saving and loading)
			loginRequest : function( data ) {
				var u = this.menu.getChildById( 'user-txt' ),
					p = this.menu.getChildById( 'pass-txt' ),
					d = types.controls.dialog.getInstance(),
					ed = this;
				$.post( "data/?action=login", { u : u.text(), p : p.text() }, function( data ) { 
					switch ( Number( data ) ) {
						case 1:
							ed.menu.showOptions();
							break;
						case 0:
							return d.alert( 'Unable to login. Did you enter the correct user and pass?' );
							break;
						default:
							return d.alert( 'An error occurred on the server. If the problem persists, please contact an administrator.' );
							break;
					}
				} );
			},
			// Registering a new user.
			registerRequest : function( data ) {
				var d = types.controls.dialog.getInstance();
				if ( !d.isOpen() ) {
					d.setContent( d.registerUser );
					d.show();
				}
			},
			// Showing the embed snippet for the composition.
			embedRequest : function() {
				var ed = this,
					d = types.controls.dialog.getInstance();
				if ( this.movieName == null )
					return d.alert( 'Please save your project before requesting to embed.' );
				$.post( "data/?action=embed", { name: this.movieName }, function( data ) { 
					if ( data != '-1' )
						ed.embed( data );
					else
						d.alert( 'An error occurred on the server. If the problem persists, please contact an administrator.' );
				} );
			},
			// Previewing the composition in a pop-up.
			previewRequest : function() {
				var ed = this,
					d = types.controls.dialog.getInstance();
				if ( this.movieName == null )
					return d.alert( 'Please save your project before requesting to preview.' );
				$.post( "data/?action=preview", { name: this.movieName }, function( data ) { 
					if ( data != '-1' ) {
						var s = ed.propPanel.propSheets.stage,
							w = parseInt( s.getChildById( 'width' ).text() ),
							h = parseInt( s.getChildById( 'height' ).text() );
						ed.newWindow = window.open( "data/?action=preview&name=" + ed.movieName, "sub", "status,height=" + (h+50) + ",width=" + (w+50) );
					} else
						d.alert( 'An error occurred on the server. If the problem persists, please contact an administrator.' );
				} );
			},
			// Save a project. Saves all project details to the database.
			save : function( $name ) {
				var f = {};
				f.movie = types.serialiser.encode( this.stage );
				f.assets = this.library.getAssets();
				var diag = types.controls.dialog.getInstance();
				var s = this.propPanel.propSheets.stage;
				f.movie.initial = {
					props: {
						width: s.getChildById( 'width' ).text(),
						height: s.getChildById( 'height' ).text()
					},
					attr: {
						id: s.getChildById( 'id' ).text(),
						'class': s.getChildById( 'class' ).text()
					}
				};
				if ( !s.getChildById( 'transparent' ).checked() )
					f.movie.initial.props.fill = {
							type: 'solid',
							colors: [ {
								rgb: s.getChildById( 'stage-color-picker' ).color,
								opacity: 1
							} ]
						}
				var d = JSON.stringify( f );
				var ed = this;
				$.post( "data/?action=put", { name : $name, data : d }, function( data ) {
					if ( data == "-1" ) return diag.alert( 'Could not save. Please login, then try again.' );
					var cb = ed.postSaveCB;
					ed.postSaveCB = null;
					if ( !!cb )
						cb();
				} );
			},
			// Gets details of a previous project from the database and populates the stage with them.
			open : function( $filename ) {
				var ed = this;
				$.post( "data/?action=get", { name : $filename }, function( data ) {
					var d = JSON.parse( data );
					ed.addMovie( d.data, ed.stage, d.name );
					statePanel.populate( ed.stage );
				} );
			},
			// Adds a new user to the database.
			register : function( user, pass ) {
				var d = types.controls.dialog.getInstance();
				$.post( "data/?action=register", { u : user, p : pass }, function( data ) {
					switch ( Number( data ) ) {
						case 1:
							d.hide();
							d.alert( 'User successfully registered. Please login.' );
							break;
						case 0:
							d.alert( 'Username already exists. Please enter another and try again.' );
							break;
						default:
							d.alert( 'An error occurred on the server. If the problem persists, please contact an administrator.' );
							break;
					}
				} );
			},
			// Setting the content of the embed dialogue box.
			embed : function( data ) {
				var d = types.controls.dialog.getInstance();
				d.getChildById( d.embedTxt ).text( data );
				d.setContent( d.embedMovie );
				d.show();
			},
			// Setting the stage, literally and otherwise, for the new project.
			newProject : function() {
				this.closeToStage();
				this.showPropertySheet( 'stage' );
				this.movieName = null;
				this.stage.empty();
				this.stage.width( 400 );
				this.stage.height( 300 );
				this.library.clear();
			},
			
			// Add to stage
			addMovie : function( data, view, name ) {
				var i,
				movie = JSON.parse( data ),
				m = movie.movie,
				l = movie.assets,
				c = m.children,
				me = this;
				if ( !!name ) {
					this.newProject();
					this.movieName = name;
				}
				for ( i in l )
					if ( l.hasOwnProperty( i ) )
						this.library.addAsset( l[i].url, i );
				eval( 'var json = ' + data );
				var process = function() {
					for ( i = 0; i < c.keys.length; i++ )
						types.serialiser.parse( c.keys[i], c.hash[c.keys[i]], view ).fui_selectable = true;
					types.core.processElement( view, function( e ) {
						e.fui_selectable = true;
						e.$node().bind( 'click', e.fui_select );
					} );
					if ( !!name ) {
						var p = json.movie.initial.props;
						eventDispatcher.dispatch(me,'events.stage.width.changed',me.stage.width( parseInt( p.width ) ));
						eventDispatcher.dispatch(me,'events.stage.height.changed',me.stage.height( parseInt( p.height ) ));
						eventDispatcher.dispatch(me,'events.stage.fill.changed',me.stage.height( p.fill ));
						me.stage.frames = types.core.clone( json.movie.frames );
					}
					me.statePanel.populate( me.stage );
				};
				var list = types.loader.classesToLoad( json.movie );
				if ( list.length > 0 )
					types.loader.load( list, function() { process(); } );
				else
					process();
			},
			// For adding basic elements to the compositon on stage.
			addElement : function( ns ) {
				var p, mk = types.display.element.make;
				switch( ns ) {
					case 'controls.add.div':
						p = 'container';
						break;
					case 'controls.add.img':
						p = 'image';
						break;
					case 'controls.add.lbl':
						p = 'label';
						break;
					case 'controls.add.btn':
						p = 'button';
						break;
					default:
						p = 'element';
						break;
				}
				var j = mk( 'display.' + p, null, this.makeState( p ) );
				j.applyStateStyles();
				this.currentItem.addChild( j.node );
				if ( !!j.initialise )
					j.initialise();
				j.applyStateAttributes();
				j.fui_selectable = true;
				// we set a background color (overwritten) as an IE hack to fix click binding.
				j.$node().bind( 'click', j.fui_select );
				selection.select( false, j.fluxid() );
				j.$node().trigger( 'click' );
				//this.manipulator.attach( j.$node(), {shiftKey: false} );
			},
			// For adding more complex elements to the composition on stage.
			addComponent : function( $data ) {
				this.addMovie( $data, this.currentItem );
			},
			
			// Stage management
			// Goes one level deeper into the composition so that child element can be placed inside the current element.
			openElement : function() {
				var t = selection.targets();
				for ( var i = 0; i < 2 && t.length == 2; i++ )
					if ( t[i].attr( 'fluxid' ) != 'overlay' ) {
						eventDispatcher.dispatch( this, 'events.stage.level.change', inst( t[i] ) );
						this.render( inst( t[i] ) );
					}
			},
			// Goes back up one level in the composition.
			closeElement : function() {
				if ( this.currentItem != this.stage ) {
					eventDispatcher.dispatch( this, 'events.stage.level.change', this.view.pointer.parent() );
					this.render( this.view.pointer.parent() );
				}
			},
			// Goes to the top of the hierarchy of the composition.
			closeToStage : function() {
				while ( this.currentItem == this.view )
						this.closeElement();
			},
			// Presents the current level of the composition on stage, hiding those element from higher levels.
			render : function( $e ) {
				var e = $e.entity();
				var isStage = ( $e == this.container || $e == this.stage );
				if ( !!$e.isContainer || isStage ) {
					this.manipulator.remove();
					( isStage ) ? this.showStage() : this.showView();
					if ( this.view.pointer != null ) {
						var c = this.view._children.splice( 0 );
						this.view.pointer.empty();
						for ( var i = 0; i < c.length; i++ )
							this.view.pointer.addChildFromClass( c[i] ); // yes, we want the parent element to be reset!
						this.view.pointer.frames = this.view.frames;
				
	
	/**
	 * Properties class
	 * Finds and loads the property sheets for elements of the composition into the properties panel.
	 *
	 * Requires:
	 *		../display/element.js
	 *		accordion.js
	 *		accordionpanel.js
	 **/	}
					this.view.pointer = ( isStage ) ? null : $e;
					this.view.empty();
					this.view.width( $e.width() );
					this.view.height( $e.height() );
					var c = $e._children.splice( 0 );
					for ( var i = 0; i < c.length; i++ ) {
						this.currentItem.addChild( c[i].$node() );
						c[i].fui_selectable = true;
						c[i].$node().bind( 'click', c[i].fui_select );
					}
					this.currentItem.frames = $e.frames;
					this.manipulator.remove();
					this.showPropertySheet( 'stage' );
					this.statePanel.populate( this.currentItem );
				}
			},
			showStage : function() {
				this.stage.visible( true );
				this.view.visible( false );
				this.currentItem = this.stage;
			},
			showView : function() {
				this.stage.visible( false );
				this.view.visible( true );
				this.currentItem = this.view;
			},
			moveForward : function( t ) {
				if ( !types.core.isArray( t ) )
					t = [t];
				this.changeIndex( t, 1 );
			},
			moveBack : function( t ) {
				if ( !types.core.isArray( t ) )
					t = [t];
				this.changeIndex( t, -1 );
			},
			// d = x || y
			// v = number of pixels (+/-)
			move : function( d, v ) {
				var m = types.controls.manipulator.getInstance(),
					t = selection.targets(),
					i;
				var mv = function( $i, $f, $n ) {
					var v = inst( $i ), t = v[$f]() + $n;
					v[$f]( t, 1 );
				};
				for ( i = 0; i < t.length; i++ )
					if ( t[i].attr( 'fluxid' ) != 'overlay' )
						mv( t[i], d, v );
				m[d]( m[d]() + v );
			},
			deleteItems : function() {
				var i, t = selection.targets();
				if ( t.length < 1 ) return;
				if ( confirm( 'Deleting an item is permanent. Are you sure?' ) ) {
					for ( i = 0; i < t.length; i++ )
						if ( t[i].attr( 'fluxid' ) != 'overlay' )
							t[i].remove();
					this.stage.$node().trigger( 'click' );
				}
			},
			changeIndex : function( t, dir ) {
				t.sort( function( a, b ) {
					var c = a.index(), d = b.index();
					return ( c < d ) ? -1 : ( c > d ) ? 1 : 0;
				} );
				var n, ni, p, j, data;
				for ( var i = 0; i < t.length; i++ ) {
					n = t[i];
					ni = n.index();
					p = n.parent();
					j = inst( n.get( 0 ) );
					if ( dir <= 0 && ni == 0 ) continue;
					if ( dir > 0 && ni == p.children().length - 1 ) continue;
					n.remove();
					if ( dir > 0 ) {
						n.insertAfter( p.children().get( ni ) );
					} else {
						n.insertBefore( p.children().get( ni-1 ) );
					}
					j.node = n.get(0);
					n.data( 'currentInstance', j );
					n.bind( 'click', j.fui_select );
				}
			},
			
			
			// Event handlers
			handleMenu : function( $evt ) {
				this[$evt.split('.').pop() + 'Request']();
			},
			
			handleElementChange : function( $ns, $prev, $cur, $evt ) {
				if ( !!$evt )
					selection.select( $evt.shiftKey, $( $cur ).attr( 'fluxid' ) );
				var t = selection.targets(0),
					i = inst( t );
				if ( !!i && !!i.broadcast ) i.broadcast();
			},
			handleWorkspaceResize : function() {
				var o, p = this.container.$node();
					q = this.ws.$node();
				if ( p.height() > q.height() )
					q.scrollTop( ( p.height() - q.height() ) / 2 );
				if ( p.width() > q.width() )
					q.scrollLeft( ( p.width() - q.width() ) / 2 );
				o = this.ws.getChildById( 'overlay' );
				if ( !!o.update )
					o.update();
			},
			
			// Properties
			showPropertySheet : function( id ) {
				if ( !this.propPanel.showSheet( id ) )
					this.propPanel.showSheet( 'display.container' );
			},
			
			// Hud
			updateHud : function() {
				this.hud.x( this.currentItem.x() );
				this.hud.y( this.currentItem.y() );
			},
			
			// Key handling
			setupKeys : function() {
				var a = inst( this.ed ).actions,
					i = types.interaction;
				a.initKeys();
				a.bindKey( i.keys.UP_ARROW, 'up' );
				a.bindKey( i.keys.DOWN_ARROW, 'down' );
				a.bindKey( i.keys.LEFT_ARROW, 'left' );
				a.bindKey( i.keys.RIGHT_ARROW, 'right' );
				a.bindKey( i.keys.DELETE, 'del' );
			},
			
			keyDown : function( ns, ev, shift, ctrl ) {
				var i = types.interaction,
					t = selection.targets();
				switch( ev ) {
					case 'left':
						this.move( 'x', ( shift ) ? -5 : -1 );
						break;
					case 'right':
						this.move( 'x', ( shift ) ? 5 : 1 );
						break;
					case 'up':
						if ( ctrl )
							this.moveForward( t );
						else
							this.move( 'y', ( shift ) ? -5 : -1 );
						break;
					case 'down':
						if ( ctrl )
							this.moveBack( t );
						else
							this.move( 'y', ( shift ) ? 5 : 1 );
						break;
					case 'del':
						this.deleteItems();
						break;
				}
			},
			
			
			// Helpers
			makeState : function( $type ) {
				var data = { type : $type, initial : {} };
				var i = data.initial;
				i.props = {
					width: 100,
					height: 100,
					top: 0,
					left: 0
				};
				switch( $type ) {
					case 'label':
						i.attr = { text: 'Enter text in properties panel' };
						i.props.color = '#000000';
						break;
					case 'container':
						i.attr = {};
						i.props.fill = {
							type: 'solid',
							colors: [
								{
									rgb: '#999999'
								}
							]
						};
					case 'image':
						i.attr = {};
						i.props['border-color'] = '#000000';
						break;
					case 'button':
						i.attr = {};
						break;
					default:
						i.attr = {};
						break;
				}
				return data;
			}
		}
	} );
	
	$().fluxui.initialise( { debug : true } );

	var colorPanel = {
		keys: [ 'color-panel' ],
		hash: {
			'color-panel': {
				type: 'controls.gradientpicker',
				initial: {
					props: {
						position: 'relative',
						width: 300,
						height: 120
					}
				},
				children: {
					keys: [ 'color-type-lbl', 'color-type', 'color-angle-lbl', 'color-angle', 'color-viewer', 'swatch-panel' ],
					hash: {
						'color-type-lbl': {
							type: 'display.label',
							initial: {
								props: {
									left: 10,
									top: 10,
									width: 40
								},
								attr: {
									text: 'type:'
								}
							}
						},
						'color-type': {
							type: 'display.form.dropdown',
							initial: {
								props: {
									left: 45,
									top: 10
								},
								attr: {
									labels: [ 'solid', 'linear', 'radial' ],
									values: [ 'solid', 'linear', 'radial' ]
								}
							}
						},
						'color-angle-lbl': {
							type: 'display.label',
							initial: {
								props: {
									left: 120,
									top: 10,
									width: 40
								},
								attr: {
									text: 'angle:'
								}
							}
						},
						'color-angle': {
							type: 'display.form.dropdown',
							initial: {
								props: {
									left: 160,
									top: 10
								},
								attr: {
									labels: [ 'left', 'top left', 'top', 'top right', 'right', 'bottom right', 'bottom', 'bottom left' ],
									values: [ 360, 315, 270, 225, 180, 135, 90, 45 ]
								}
							}
						},
						'color-viewer': {
							type: 'display.element',
							initial: {
								props: {
									left: 10,
									top: 40,
									width: 270,
									height: 40
								}
							}
						},
						'swatch-panel': {
							type: 'display.element',
							initial: {
								props: {
									fill: {
										type: 'linear',
										colors: [
											{
												rgb: '#999999',
												pos: 0
											},
											{
												rgb: '#cccccc',
												pos: 0.4
											},
											{
												rgb: '#cccccc',
												pos: 0.6
											},
											{
												rgb: '#999999',
												pos: 1
											}
										]
									},
									left: 10,
									top: 80,
									width: 270,
									height: 10
								}
							}
						}
					}
				}
			}
		}
	};

	var statePanel = {
		keys: [ 'state-panel' ],
		hash: {
			'state-panel': {
				type: 'controls.statePanel',
				initial: {
					props: {
						position: 'relative',
						width: 300,
						height: 200
					}
				},
				children: {
					keys: [ 'states-list', 'states-list-lbl', 'states-fld', 'states-fld-lbl', 'add-state-btn', 'remove-state-btn', 'up-state-btn', 'down-state-btn', 'state-duration', 'state-duration-lbl', 'state-easing', 'state-easing-lbl' ],
					hash: {
						'states-list': {
							type: 'display.form.dropdown',
							initial: {
								props: {
									left: 10,
									top: 30,
									width: 200,
									height: 70
								},
								attr: {
									size: 4
								}
							}
						},
						'states-list-lbl': {
							type: 'display.label',
							initial: {
								props: {
									top: 10,
									left: 10,
									width: 60
								},
								attr: {
									text: 'states'
								}
							}
						},
						'states-fld': {
							type: 'display.form.textfield',
							initial: {
								props: {
									top: 125,
									left: 10,
									width: 180
								}
							}
						},
						'states-fld-lbl': {
							type: 'display.label',
							initial: {
								props: {
									top: 105,
									left: 10,
									width: 60
								},
								attr: {
									text: 'name'
								}
							}
						},
						'add-state-btn': {
							type: 'display.button',
							initial: {
								props: {
									left: 195,
									top: 125,
									width: 40,
									height: 20,
									'border-width': 1,
									'border-color': '#666666'
								}
							},
							children: {
								keys: [ 'label' ],
								hash: {
									label: {
										type: 'display.label',
										initial: {
											props: {
												top: 2,
												width: 40,
												height: 25,
												'text-align': 'center'
											},
											attr: {
												text: 'add'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'remove-state-btn': {
							type: 'display.button',
							initial: {
								props: {
									left: 240,
									top: 125,
									width: 50,
									height: 20,
									'border-width': 1,
									'border-color': '#666666'
								}
							},
							children: {
								keys: [ 'label' ],
								hash: {
									label: {
										type: 'display.label',
										initial: {
											props: {
												top: 2,
												width: 50,
												height: 25,
												'text-align': 'center'
											},
											attr: {
												text: 'remove'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'up-state-btn': {
							type: 'display.button',
							initial: {
								props: {
									left: 215,
									top: 30,
									width: 40,
									height: 20,
									'border-width': 1,
									'border-color': '#666666'
								}
							},
							children: {
								keys: [ 'label' ],
								hash: {
									label: {
										type: 'display.label',
										initial: {
											props: {
												top: 2,
												width: 40,
												height: 25,
												'text-align': 'center'
											},
											attr: {
												text: 'up'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'down-state-btn': {
							type: 'display.button',
							initial: {
								props: {
									left: 215,
									top: 80,
									width: 40,
									height: 20,
									'border-width': 1,
									'border-color': '#666666'
								}
							},
							children: {
								keys: [ 'label' ],
								hash: {
									label: {
										type: 'display.label',
										initial: {
											props: {
												top: 2,
												width: 40,
												height: 25,
												'text-align': 'center'
											},
											attr: {
												text: 'down'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'state-duration': {
							type: 'display.form.textfield',
							initial: {
								props: {
									left: 10,
									top: 170,
									width: 100,
								}
							}
						},
						'state-duration-lbl': {
							type: 'display.label',
							initial: {
								props: {
									left: 10,
									top: 150,
									width: 100
								},
								attr: {
									text: 'duration (ms)'
								}
							}
						},
						'state-easing': {
							type: 'display.form.dropdown',
							initial: {
								props: {
									left: 120,
									top: 170,
									width: 170
								},
								attr: {
									labels: [ 'linear tween', 'ease in quad', 'ease out quad', 'ease in/out quad', 'ease in cubic', 'ease out cubic', 'ease in/out cubic', 'ease in quart', 'ease out quart', 'ease in out quart', 'ease in quint', 'ease out quint', 'ease in/out quint', 'ease in sine', 'ease out sine', 'ease in/out sine', 'ease in expo', 'ease out expo', 'ease in/out expo', 'ease in circ', 'ease out circ', 'ease in/out circ', 'ease in elastic', 'ease out elastic', 'ease in/out elastic', 'ease in back', 'ease out back', 'ease in/out back', 'ease in bounce', 'ease out bounce', 'ease in/out bounce' ],
									values: [ 'linearTween', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic', 'easeInQuart', 'easeOutQuart', 'easeInOutQuart', 'easeInQuint', 'easeOutQuint', 'easeInOutQuint', 'easeInSine', 'easeOutSine', 'easeInOutSine', 'easeInExpo', 'easeOutExpo', 'easeInOutExpo', 'easeInCirc', 'easeOutCirc', 'easeInOutCirc', 'easeInElastic', 'easeOutElastic', 'easeInOutElastic', 'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce' ]
								}
							}
						},
						'state-easing-lbl': {
							type: 'display.label',
							initial: {
								props: {
									left: 120,
									top: 150,
									width: 60
								},
								attr: {
									text: 'easing'
								}
							}
						}
					}
				}
			}
		}
	};

	alignmentPanel = {
		keys: [ 'align-panel' ],
		hash: {
			'align-panel': {
				type: 'display.element',
				initial: {
					props: {
						fill: {
							type: 'linear',
							direction: 'top',
							colors: [
								{
									rgb: '#d6d6d6',
									opacity: 1,
									pos: 0
								},
								{
									rgb: '#d6d6d6',
									opacity: 1,
									pos: 0.423
								},
								{
									rgb: '#000000',
									opacity: 1,
									pos: 0.425
								},
								{
									rgb: '#d6d6d6',
									opacity: 1,
									pos: 0.427
								}
							]
						},
						position: 'relative',
						width: 300,
						height: 275
					}
				},
				children: {
					keys: [ 'realtime-label', 'box', 'type', 'top', 'right', 'bottom', 'left', 'align-label', 'align-left', 'align-center-x', 'align-right', 'align-top', 'align-center-y', 'align-bottom', 'distribute-label', 'distribute-left', 'distribute-center-x', 'distribute-right', 'distribute-top', 'distribute-center-y', 'distribute-bottom', 'match-label', 'match-width', 'match-height', 'match-both', 'space-label', 'space-x', 'space-y' ],
					hash: {
						'realtime-label': {
							type: 'display.label',
							initial: {
								props: {
									left: 10,
									top: 10
								},
								attr: {
									text: 'Realtime:'
								}
							}
						},
						box: {
							type: 'display.element',
							initial: {
								props: {
									top: 40,
									left: 15,
									width: 120,
									height: 60,
									'border-style': 'solid',
									'border-color': '#333333',
									'border-width': 1
								},
								attr: {
									text: 'Realtime:'
								}
							}
						},
						type: {
							type: 'display.form.dropdown',
							initial: {
								props: {
									top: 60,
									left: 30
								},
								attr: {
									labels: [ 'none', 'anchoring', 'center x', 'center y', 'center both' ],
									values: [ 'none', 'anchor', 'horz', 'vert', 'both' ]
								}
							},
							bind : {
								text : {
									event : 'events.alignment.changed'
								}
							},
							behavior : {
								change : {
									event : 'properties.alignment'
								}
							}
						},
						top: {
							type: 'display.form.checkbox',
							initial: {
								props: {
									left: 70,
									top: 33
								}
							},
							bind : {
								text : {
									event : 'events.anchor.top.changed'
								}
							},
							behavior : {
								change : {
									event : 'properties.anchor.top'
								}
							}
						},
						right: {
							type: 'display.form.checkbox',
							initial: {
								props: {
									left: 130,
									top: 63
								}
							},
							bind : {
								text : {
									event : 'events.anchor.right.changed'
								}
							},
							behavior : {
								change : {
									event : 'properties.anchor.right'
								}
							}
						},
						bottom: {
							type: 'display.form.checkbox',
							initial: {
								props: {
									left: 70,
									top: 95
								}
							},
							bind : {
								text : {
									event : 'events.anchor.bottom.changed'
								}
							},
							behavior : {
								change : {
									event : 'properties.anchor.bottom'
								}
							}
						},
						left: {
							type: 'display.form.checkbox',
							initial: {
								props: {
									left: 8,
									top: 63
								}
							},
							bind : {
								text : {
									event : 'events.anchor.left.changed'
								}
							},
							behavior : {
								change : {
									event : 'properties.anchor.left'
								}
							}
						},
						'align-label': {
							type: 'display.label',
							initial: {
								props: {
									top: 125,
									left: 10
								},
								attr: {
									text: 'Align:'
								}
							}
						},
						'align-left': {
							type: 'display.button',
							initial: {
								props: {
									top: 145,
									left: 10,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.align.left'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'align-left-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'align-center-x': {
							type: 'display.button',
							initial: {
								props: {
									top: 145,
									left: 40,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.align.center.x'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'align-center-x-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'align-right': {
							type: 'display.button',
							initial: {
								props: {
									top: 145,
									left: 70,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.align.right'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'align-right-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'align-top': {
							type: 'display.button',
							initial: {
								props: {
									top: 145,
									left: 120,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.align.top'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'align-top-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'align-center-y': {
							type: 'display.button',
							initial: {
								props: {
									top: 145,
									left: 150,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.align.center.y'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'align-center-y-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'align-bottom': {
							type: 'display.button',
							initial: {
								props: {
									top: 145,
									left: 180,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.align.bottom'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'align-bottom-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'distribute-label': {
							type: 'display.label',
							initial: {
								props: {
									top: 175,
									left: 10
								},
								attr: {
									text: 'Distribute:'
								}
							}
						},
						'distribute-left': {
							type: 'display.button',
							initial: {
								props: {
									top: 195,
									left: 10,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.distribute.left'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'distribute-left-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'distribute-center-x': {
							type: 'display.button',
							initial: {
								props: {
									top: 195,
									left: 40,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.distribute.center.x'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'distribute-center-x-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'distribute-right': {
							type: 'display.button',
							initial: {
								props: {
									top: 195,
									left: 70,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.distribute.right'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'distribute-right-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'distribute-top': {
							type: 'display.button',
							initial: {
								props: {
									top: 195,
									left: 120,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.distribute.top'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'distribute-top-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'distribute-center-y': {
							type: 'display.button',
							initial: {
								props: {
									top: 195,
									left: 150,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.distribute.center.y'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'distribute-center-y-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'distribute-bottom': {
							type: 'display.button',
							initial: {
								props: {
									top: 195,
									left: 180,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.distribute.bottom'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'distribute-bottom-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'match-label': {
							type: 'display.label',
							initial: {
								props: {
									top: 225,
									left: 10
								},
								attr: {
									text: 'Match size:'
								}
							}
						},
						'match-width': {
							type: 'display.button',
							initial: {
								props: {
									top: 245,
									left: 10,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.match.width'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'match-width-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'match-height': {
							type: 'display.button',
							initial: {
								props: {
									top: 245,
									left: 40,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.match.height'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'match-height-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'match-both': {
							type: 'display.button',
							initial: {
								props: {
									top: 245,
									left: 70,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.match.both'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'match-both-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'space-label': {
							type: 'display.label',
							initial: {
								props: {
									top: 225,
									left: 120
								},
								attr: {
									text: 'Space:'
								}
							}
						},
						'space-x': {
							type: 'display.button',
							initial: {
								props: {
									top: 245,
									left: 120,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.space.x'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'space-x-img'
											}
										},
										states: {
										}
									}
								}
							}
						},
						'space-y': {
							type: 'display.button',
							initial: {
								props: {
									top: 245,
									left: 150,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.space.y'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'display.image',
										initial: {
											attr: {
												src: 'space-y-img'
											}
										},
										states: {
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};

	var libraryPanel = {
		keys: [ 'library-panel' ],
		hash: {
			'library-panel': {
				type: 'controls.library',
				initial: {
					props: {
						position: 'relative',
						width: 300,
						height: 400
					}
				},
				children: {
					keys: ['icon-bar', 'asset-viewer', 'asset-list-container'],
					hash: {
						'icon-bar': {
							type: 'display.element',
							initial: {
								props: {
									fill: {
										type: 'solid',
										colors: [
											{
												rgb: '#bbbbbb',
												opacity: 1
											}
										]
									},
									width: 300,
									height: 26
								}
							},
							children: {
								keys: ['add-asset'],
								hash: {
									'add-asset': {
										type: 'display.image',
										initial: {
											props: {
												right: 25,
												left: '',
												top: 5,
												width: 16,
												height: 16,
												cursor: 'pointer'
											},
											attr: {
												src: 'btn-add-asset'
											}
										},
										behavior: {
											click: {
												event: 'properties.library.add'
											}
										}
									}
								}
							}
						},
						'asset-viewer': {
							type: 'display.element',
							initial: {
								props: {
									fill: {
										type: 'solid',
										colors: [
											{
												rgb: '#ffffff',
												opacity: 1
											}
										]
									},
									top: 26,
									width: 300,
									height: 150
								}
							},
							children: {
								keys: [ 'preview' ],
								hash: {
									preview: {
										type: 'display.image',
										initial: {
											props: {
												'max-width': 300,
												'max-height': 150
											},
											attr: {
												center: 'both',
												src: 'white-pixel'
											}
										}
									}
								}
							}
						},
						'asset-list-container': {
							type: 'display.element',
							initial: {
								props: {
									top: 180,
									width: 300,
									height: 274,
									overflow: 'auto'
								}
							},
							children: {
								keys: ['asset-list'],
								hash: {
									'asset-list': {
										type: 'display.element',
										initial: {
											props: {
												width: 275
											}
										}
									}
								}
							}
						}
					}
				},
				data: {
					keys: [ 'asset-button' ],
					hash: {
						'asset-button': {
							type: 'controls.libitem',
							initial: {
								props: {
									position: 'relative',
									width: 275,
									height: 26
								}
							},
							behavior: {
								click: {
									event: 'properties.library.item.click'
								}
							},
							children: {
								keys: ['asset-label', 'asset-btn'],
								hash: {
									'asset-label': {
										type: 'display.label',
										initial: {
											props: {
												top: 5,
												left: 5,
												width: 200,
												height: 16
											},
											attr: {
												text: 'this is the label'
											}
										}
									},
									'asset-btn': {
										type: 'display.image',
										initial: {
											props: {
												right: 5,
												left: '',
												top: 5,
												width: 16,
												height: 16,
												cursor: 'pointer'
											},
											attr: {
												src: 'btn-remove-asset'
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};

	var componentPanel = {
		keys: [ 'component-panel' ],
		hash: {
			'component-panel': {
				type: 'controls.components',
				initial: {
					props: {
						position: 'relative',
						width: 300,
						height: 450
					}
				},
				children: {
					keys: ['component-viewer', 'component-list-container'],
					hash: {
						'component-viewer': {
							type: 'display.element',
							initial: {
								props: {
									fill: {
										type: 'solid',
										colors: [
											{
												rgb: '#ffffff',
												opacity: 1
											}
										]
									},
									top: 0,
									width: 300,
									height: 150
								}
							},
							children: {
								keys: [ 'preview' ],
								hash: {
									preview: {
										type: 'display.image',
										initial: {
											props: {
												'max-width': 300,
												'max-height': 150
											},
											attr: {
												center: 'both',
												src: 'white-pixel'
											}
										}
									}
								}
							}
						},
						'component-list-container': {
							type: 'display.element',
							initial: {
								props: {
									top: 150,
									width: 300,
									height: 274,
									overflow: 'auto'
								}
							},
							children: {
								keys: ['component-list'],
								hash: {
									'component-list': {
										type: 'display.element',
										initial: {
											props: {
												width: 275
											}
										}
									}
								}
							}
						}
					}
				},
				data: {
					keys: [ 'component-button' ],
					hash: {
						'component-button': {
							type: 'controls.componentitem',
							initial: {
								props: {
									position: 'relative',
									width: 275,
									height: 26,
									cursor: 'pointer'
								}
							},
							behavior: {
								click: {
									event: 'properties.component.item.click'
								},
								dblclick: {
									event: 'properties.component.item.dblclick'
								}
							},
							children: {
								keys: ['component-label', 'component-icon'],
								hash: {
									'component-label': {
										type: 'display.label',
										initial: {
											props: {
												top: 5,
												left: 45,
												width: 200,
												height: 16
											},
											attr: {
												text: 'this is the label'
											}
										}
									},
									'component-icon': {
										type: 'display.image',
										initial: {
											props: {
												top: 5,
												left: 5
											},
											attr: {
												src: 'white-pixel'
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};

	var editor =  {
		assets : {
			'align-left-img': {
				url: 'assets/align-left.gif'
			},
			'align-center-x-img': {
				url: 'assets/align-center-x.gif'
			},
			'align-right-img': {
				url: 'assets/align-right.gif'
			},
			'align-top-img': {
				url: 'assets/align-top.gif'
			},
			'align-center-y-img': {
				url: 'assets/align-center-y.gif'
			},
			'align-bottom-img': {
				url: 'assets/align-bottom.gif'
			},
			'distribute-left-img': {
				url: 'assets/distribute-left.gif'
			},
			'distribute-center-x-img': {
				url: 'assets/distribute-center-x.gif'
			},
			'distribute-right-img': {
				url: 'assets/distribute-right.gif'
			},
			'distribute-top-img': {
				url: 'assets/distribute-top.gif'
			},
			'distribute-center-y-img': {
				url: 'assets/distribute-center-y.gif'
			},
			'distribute-bottom-img': {
				url: 'assets/distribute-bottom.gif'
			},
			'match-width-img': {
				url: 'assets/match-width.gif'
			},
			'match-height-img': {
				url: 'assets/match-height.gif'
			},
			'match-both-img': {
				url: 'assets/match-both.gif'
			},
			'space-x-img': {
				url: 'assets/space-x.gif'
			},
			'space-y-img': {
				url: 'assets/space-y.gif'
			},
			'accordion-btn': {
				url: 'assets/accordion-btn.gif'
			},
			'accordion-btn-selected': {
				url: 'assets/accordion-btn-selected.gif'
			},
			'accordion-right-arrow': {
				url: 'assets/accordion-right-arrow.gif'
			},
			'accordion-down-arrow': {
				url: 'assets/accordion-down-arrow.gif'
			},
			'placeholder': {
				url: 'assets/spacer.gif'
			},
			'ico-properties': {
				url: 'assets/ico-properties.png'
			},
			'ico-palette': {
				url: 'assets/ico-palette.png'
			},
			'ico-align': {
				url: 'assets/ico-align.png'
			},
			'ico-library': {
				url: 'assets/ico-library.png'
			},
			'ico-components': {
				url: 'assets/ico-components.png'
			},
			'ico-state': {
				url: 'assets/ico-state.png'
			},
			'logo': {
				url: 'assets/logo.gif'
			},
			'btn-div': {
				url: 'assets/btn-div.png'
			},
			'btn-img': {
				url: 'assets/btn-img.png'
			},
			'btn-lbl': {
				url: 'assets/btn-lbl.png'
			},
			'btn-btn': {
				url: 'assets/btn-btn.png'
			},
			'btn-add-asset': {
				url: 'assets/btn-add-asset.png'
			},
			'btn-remove-asset': {
				url: 'assets/btn-remove-asset.png'
			},
			'btn-reset-asset': {
				url: 'assets/btn-reset-asset.png'
			},
			'btn-placeholder-asset': {
				url: 'assets/btn-placeholder-asset.png'
			},
			'alpha-bg': {
				url: 'assets/alpha-bg.png'
			},
			'white-pixel': {
				url: 'assets/white-pixel.png'
			}
		},
		library: {

		},
		movie: {
			type: 'display.element',
			initial: {
				props: {
					width: 520,
					height: 468,
					fill: {
						type: 'solid',
						colors: [
							{
								rgb: '#000000',
								opacity: 1
							}
						]
					}
				},
				attr: {
					anchor: [ 1, 1, 1, 1 ]
				}
			},
			children: {
				keys: [ 'header', 'left-sidebar', 'workspace', 'right-sidebar', 'request-dialog' ],
				hash: {
					header: {
						type: 'display.element',
						initial: {
							props: {
								fill: {
									type: 'solid',
									colors: [
										{
											rgb: '#373737',
											opacity: 1,
											pos: 0
										}
									]
								},
								width: 520,
								height: 68
							},
							attr: {
								anchor: [ 1, 1, 0, 1 ]
							}
						},
						children: {
							keys: [ 'logo', 'breadcrumbs', 'menu' ],
							hash: {
								logo: {
									type: 'display.image',
									initial: {
										props: {
											left: 20,
											top: 17
										},
										attr: {
											src: 'logo'
										}
									}
								},
								breadcrumbs: {
									type: 'controls.breadcrumbs',
									initial: {
										props: {
											left: 340,
											top: 40,
											width: 10,
											height: 25
										},
										attr: {
											anchor: [ 0, 1, 0, 1 ]
										}
									}
								},
								menu: {
									type: 'controls.menu',
									initial: {
										props: {
											top: 25,
											left: '',
											right: 80,
											width: 270,
											height: 20
										}
									},
									children: {
										keys: [ 'login-menu', 'app-menu' ],
										hash: {
											'login-menu': {
												type: 'display.element',
												initial: {
													props: {
														width: 270,
														height: 20
													}
												},
												children: {
													keys: [ 'user-txt', 'pass-txt', 'login-btn', 'register' ],
													hash: {
														'user-txt': {
															type: 'display.form.textfield',
															initial: {
																props: {
																	width: 70
																}
															}
														},
														'pass-txt': {
															type: 'display.form.textfield',
															initial: {

																props: {
																	left: 80,
																	width: 70
																},
																attr: {
																	text: 'password'
																}
															}
														},
														'login-btn': {
															type: 'display.button',
															initial: {
																props: {
																	left: 160,
																	width: 40,
																	height: 18,
																	'border-color': '#999999',
																	'border-width': 1
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.login'
																}
															},
															children: {
																keys: [ 'login-label' ],
																hash: {
																	'login-label': {
																		type: 'display.label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				left: 4,
																				width: 40,
																				height: 18
																			},
																			attr: {
																				text: 'Login'
																			}
																		},
																		states: {
																		}
																	}
																}
															}
														},
														'register': {
															type: 'display.button',
															initial: {
																props: {
																	left: 210,
																	width: 58,
																	height: 18,
																	'border-color': '#999999',
																	'border-width': 1
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.register'
																}
															},
															children: {
																keys: [ 'register-label' ],

																hash: {
																	'register-label': {
																		type: 'display.label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				left: 4,
																				width: 60,
																				height: 20
																			},
																			attr: {
																				text: 'Register'
																			}
																		},
																		states: {
																		}
																	}
																}
															}
														}
													}
												}
											},
											'app-menu': {
												type: 'display.element',
												initial: {
													props: {
														left: 0,
														width: 280,
														height: 20,
														visibility: 'hidden'
													}
												},
												children: {
													keys: [ 'preview-btn', 'embed-btn', 'new-btn', 'open-btn', 'save-btn' ],
													hash: {
														'preview-btn': {
															type: 'display.button',
															initial: {
																props: {
																	width: 50,
																	height: 20
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.preview'
																}
															},
															children: {
																keys: [ 'preview-label' ],
																hash: {
																	'preview-label': {
																		type: 'display.label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				width: 50,
																				height: 20
																			},
																			attr: {
																				text: 'Preview'
																			}
																		},
																		states: {
																		}
																	}
																}
															}
														},
														'embed-btn': {
															type: 'display.button',
															initial: {
																props: {
																	width: 40,
																	height: 20,
																	left: 70
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.embed'
																}
															},
															children: {
																keys: [ 'embed-label' ],
																hash: {
																	'embed-label': {
																		type: 'display.label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				width: 40,
																				height: 20
																			},
																			attr: {
																				text: 'Embed'
																			}
																		},
																		states: {
																		}
																	}
																}
															}
														},
														'new-btn': {
															type: 'display.button',
															initial: {
																props: {
																	width: 40,
																	height: 20,
																	left: 130
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.new'
																}
															},
															children: {
																keys: [ 'new-label' ],
																hash: {
																	'new-label': {
																		type: 'display.label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				width: 40,
																				height: 20
																			},
																			attr: {
																				text: 'New'
																			}
																		},
																		states: {
																		}
																	}
																}
															}
														},
														'open-btn': {
															type: 'display.button',
															initial: {
																props: {
																	width: 40,
																	height: 20,
																	left: 180
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.open'
																}
															},
															children: {
																keys: [ 'open-label' ],
																hash: {
																	'open-label': {
																		type: 'display.label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				width: 40,
																				height: 20
																			},
																			attr: {
																				text: 'Open'
																			}
																		},
																		states: {
																		}
																	}
																}
															}
														},
														'save-btn': {
															type: 'display.button',
															initial: {
																props: {
																	width: 40,
																	height: 20,
																	left: 230
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.save'
																}
															},
															children: {
																keys: [ 'save-label' ],
																hash: {
																	'save-label': {
																		type: 'display.label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				width: 40,
																				height: 20
																			},
																			attr: {
																				text: 'Save'
																			}
																		},
																		states: {
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					},
					'left-sidebar': {
						type: 'display.element',
						initial: {
							props: {
								fill: {
									type: 'solid',
									colors: [
										{
											rgb: '#373737',
											opacity: 1
										}
									]
								},
								top: 68,
								width: 340,
								height: 400
							},
							attr: {
								anchor: [ 1, 0, 1, 1 ]
							}
						},
						children: {
							keys: [ 'panels' ],
							hash: {
								panels: {
									type: 'controls.accordion',
									initial: {
										props: {
											fill: {
												type: 'solid',
												colors: [
													{
														rgb: '#373737',
														opacity: 1
													}
												]
											},
											width: 300,
											height: 400,
											left: 20,
											'overflow-y': 'auto'
										},
										attr: {
											anchor: [ 1, 1, 1, 1 ]
										}
									},
									data: {
										keys: [ 'button' ],
										hash: {
											button: {
												type: 'display.button',
												initial: {
													props: {
														width: 300,
														height: 36
													}
												},
												frames: {
													keys: [ 'initial', '_over', '_selected' ],
													hash: {
														initial: {},
														_over: {},
														_selected: {}
													}
												},
												children: {
													keys: [ 'background', 'icon', 'label', 'state-icon' ],
													hash: {
														background: {
															type: 'display.image',
															initial: {
																props: {
																	width: 300,
																	height: 36
																},
																attr: {
																	src: 'accordion-btn'
																}
															},
															states: {
																_over: {
																	attr: {
																		src: 'accordion-btn-selected'
																	}
																},
																_selected: {
																	attr: {
																		src: 'accordion-btn-selected'
																	}
																}
															}
														},
														'icon': {
															type: 'display.image',
															initial: {
																props: {
																	top: 8,
																	left: 9
																},
																attr: {
																	src: 'placeholder'
																}
															},
															states: {
																initial: {},
																_over: {},
																_selected: {}
															}
														},
														label: {
															type: 'display.label',
															initial: {
																props: {
																	color: '#ffffff',
																	top: 9,
																	left: 40,
																	'font-size': 13
																},
																attr: {
																	text: 'Button'
																}
															},
															states: {
																initial: {},
																_over: {},
																_selected: {}
															}
														},
														'state-icon': {
															type: 'display.image',
															initial: {
																props: {
																	width: 8,
																	height: 8,
																	left: 260,
																	top: 14
																},
																attr: {
																	src: 'accordion-right-arrow'
																}
															},
															states: {
																initial: {},
																_over: {},
																_selected: {
																	attr: {
																		src: 'accordion-down-arrow'
																	}
																}
															}
														}
													}
												}
											}
										}
									},
									children: {
										keys: [ 'acc-property-panel', 'acc-color-panel', 'acc-state-panel', 'acc-align-panel', 'acc-library-panel', 'acc-component-panel' ],
										hash: {
											'acc-property-panel': {
												type: 'controls.accordionPanel',
												initial: {
													props: {
														position: 'relative',
														width: 300,
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#d6d6d6',
																	opacity: 1
																}
															]
														}
													},
													attr: {
														id: 'propertiesPanel',
														text: 'Properties',
														icon: 'ico-properties'
													}
												},
												children: {
													keys: [ 'propSheets' ],
													hash: {
														'propSheets': {
															type: 'controls.properties',
															initial: {
																props: {
																	position: 'relative',
																	'max-width': 300,
																	'min-height': 100
																}
															}
														}
													}
												}
											},
											'acc-color-panel': {
												type: 'controls.accordionPanel',
												initial: {
													props: {
														width: 300,
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#d6d6d6',
																	opacity: 1
																}
															]
														}
													},
													attr: {
														id: 'colorPanel',
														text: 'Color',
														icon: 'ico-palette'
													}
												},
												children: colorPanel
											},
											'acc-state-panel': {
												type: 'controls.accordionPanel',
												initial: {
													props: {
														width: 300,
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#d6d6d6',
																	opacity: 1
																}
															]
														}
													},
													attr: {
														id: 'statePanel',
														text: 'States',
														icon: 'ico-state'
													}
												},
												children: statePanel
											},
											'acc-align-panel': {
												type: 'controls.accordionPanel',
												initial: {
													props: {
														width: 300,
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#d6d6d6',
																	opacity: 1
																}
															]
														}
													},
													attr: {
														id: 'alignPanel',
														text: 'Alignment',
														icon: 'ico-align'
													}
												},
												children: alignmentPanel
											},
											'acc-library-panel': {
												type: 'controls.accordionPanel',
												initial: {
													props: {
														width: 300,
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#d6d6d6',
																	opacity: 1
																}
															]
														}
													},
													attr: {
														id: 'libraryPanel',
														text: 'Library',
														icon: 'ico-library'
													}
												},
												children: libraryPanel
											},
											'acc-component-panel': {
												type: 'controls.accordionPanel',
												initial: {
													props: {
														width: 300,
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#d6d6d6',
																	opacity: 1
																}
															]
														}
													},
													attr: {
														id: 'componentPanel',
														text: 'Components',
														icon: 'ico-components'
													}
												},
												children: componentPanel
											}
										}
									}
								}
							}
						}
					},
					workspace: {
						type: 'display.element',
						initial: {
							props: {
								fill: {
									type: 'solid',
									colors: [
										{
											rgb: '#666666',
											opacity: 1
										}
									]
								},
								top: 68,
								left: 340,
								width: 90,
								height: 400,
								'overflow': 'auto'
							},
							attr: {
								anchor: [ 1, 1, 1, 1 ]
							}
						},
						children:{
							keys: [ 'stage-container' ],
							hash: {
								'stage-container': {
									type: 'display.element',
									initial: {
										props: {
											fill: {
												type: 'solid',
												colors: [
													{
														rgb: '#666666',
														opacity: 1
													}
												]
											},
											'min-height': 2000,
											'min-width': 2000
										}
									},
									children: {
										keys: [ 'stage', 'view', 'hud' ],
										hash: {
											stage: {
												type: 'display.element',
												initial: {
													props: {
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#FFFFFF',
																	opacity: 1,
																	pos: 0.1
																},
																{
																	rgb: '#FFFFFF',
																	opacity: 1,
																	pos: 0.9
																}
															]
														},
														width: 400,
														height: 300,
														overflow: 'visible'
													},
													attr: {
														center: 'both'
													}
												}
											},
											view: {
												type: 'controls.view',
												initial: {
													props: {
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#FFFFFF',
																	opacity: 1,
																	pos: 0.1
																},
																{
																	rgb: '#FFFFFF',
																	opacity: 1,
																	pos: 0.9
																}
															]
														},
														width: 400,
														height: 300,
														overflow: 'visible',
														visibility: 'hidden'
													},
													attr: {
														center: 'both'
													}
												}
											},
											hud: {
												type: 'display.element',
												initial: {
													props: {
														overflow: 'visible',
														width: 1,
														height: 1
													}
												}
											}
										}
									}
								}
							}
						}
					},
					'right-sidebar': {
						type: 'display.element',
						initial: {
							props: {
								fill: {
									type: 'solid',
									colors: [
										{
											rgb: '#373737',
											opacity: 1,
											pos: 0
										}
									]
								},
								top: 68,
								left: 430,
								width: 90,
								height: 400
							},
							attr: {
								anchor: [ 1, 1, 1, 0 ]
							}
						},
						children: {
							keys: [ 'btn-div', 'btn-img', 'btn-lbl', 'btn-btn' ],
							hash: {
								'btn-div': {
									type: 'display.image',
									initial: {
										props: {
											top: 4,
											left: 16,
											cursor: 'pointer'
										},
										attr: {
											src: 'btn-div'
										}
									},
									behavior: {
										click: {
											event: 'controls.add.div'
										}
									}
								},
								'btn-img': {
									type: 'display.image',
									initial: {
										props: {
											top: 4,
											left: 50,
											cursor: 'pointer'
										},
										attr: {
											src: 'btn-img'
										}
									},
									behavior: {
										click: {
											event: 'controls.add.img'
										}
									}
								},
								'btn-lbl': {
									type: 'display.image',
									initial: {
										props: {
											top: 30,
											left: 16,
											cursor: 'pointer'
										},
										attr: {
											src: 'btn-lbl'
										}
									},
									behavior: {
										click: {
											event: 'controls.add.lbl'
										}
									}
								},
								'btn-btn': {
									type: 'display.image',
									initial: {
										props: {
											top: 30,
											left: 50,
											cursor: 'pointer'
										},
										attr: {
											src: 'btn-btn'
										}
									},
									behavior: {
										click: {
											event: 'controls.add.btn'
										}
									}
								}
							}
						}
					},
					'request-dialog': {
						type: 'controls.dialog',
						initial: {
							props: {
								fill: {
									type: 'solid',
									colors: [
										{
											rgb: '#ffffff',
											opacity: 1
										}
									]
								},
								top: '50%',
								left: '50%',
								'margin-left': -150,
								'margin-top': -100,
								width: 300,
								height: 200,
								'border-width': 1,
								'border-color': '#bbbbbb'
							}
						},
						children: {
							keys: [ 'header-bg', 'header-label', 'dialog-close-btn', 'dialog-content', 'btn-submit' ],
							hash: {
								'header-bg': {
									type: 'display.element',
									initial: {
										props: {
											fill: {
												type: 'solid',
												colors: [
													{
														rgb: '#bbbbbb',
														opacity: 1
													}
												]
											},
											width: 300,
											height: 26
										}
									}
								},
								'header-label': {
									type: 'display.label',
									initial: {
										props: {
											'font-family': 'arial',
											'font-weight': 'bold',
											top: 5,
											left: 10,
											width: 100,
											height: 16
										},
										attr: {
											text: 'Alert'
										}
									}
								},
								'dialog-close-btn': {
									type: 'display.image',
									initial: {
										props: {
											top: 5,
											left: '',
											right: 10,
											width: 16,
											height: 16,
											cursor: 'pointer'
										},
										attr: {
											src: 'btn-remove-asset'
										}
									},
									behavior: {
										click: {
											event: 'dialog.close'
										}
									}
								},
								'dialog-content': {
									type: 'display.element',
									initial: {
										props: {
											top: 26,
											height: 174,
											width: 300
										}
									},
									children: {
										keys: [ 'import-asset', 'save-movie', 'open-movie', 'register-user', 'embed-movie' ],
										hash: {
											'import-asset': {
												type: 'display.element',
												initial: {
													props: {
														height: 174,
														width: 300
													}
												},
												children: {
													keys: [ 'import-desc', 'asset-lbl-label', 'asset-lbl-text', 'asset-url-label', 'asset-url-text' ],
													hash: {
														'import-desc': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 5,
																	left: 10,
																	height: 60,
																	width: 290
																},
																attr: {
																	text: 'Please specify an asset to import. The label you supply will help differentiate the asset in the library, while the path should be an absolute path to the asset.'
																}
															}
														},
														'asset-lbl-label': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 75,
																	left: 10,
																	height: 16,
																	width: 150
																},
																attr: {
																	text: 'Asset label:'
																}
															}
														},
														'asset-lbl-text': {
															type: 'display.form.textfield',
															initial: {
																props: {
																	top: 96,
																	left: 10,
																	width: 150,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														},
														'asset-url-label': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 122,
																	left: 10,
																	height: 16,
																	width: 150
																},
																attr: {
																	text: 'Asset path:'
																}
															}
														},
														'asset-url-text': {
															type: 'display.form.textfield',
															initial: {
																props: {
																	top: 143,
																	left: 10,
																	width: 150,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														}
													}
												}
											},
											'save-movie': {
												type: 'display.element',
												initial: {
													props: {
														height: 104,
														width: 300
													}
												},
												children: {
													keys: [ 'save-desc', 'file-name-label', 'file-name-text' ],
													hash: {
														'save-desc': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 5,
																	left: 10,
																	height: 50,
																	width: 290
																},
																attr: {
																	text: 'Please provide a unique name for your movie. (Note: Providing an existing name will overwrite that project).'
																}
															}
														},
														'file-name-label': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 65,
																	left: 10,
																	height: 16,
																	width: 150
																},
																attr: {
																	text: 'File name:'
																}
															}
														},
														'file-name-text': {
															type: 'display.form.textfield',
															initial: {
																props: {
																	top: 86,
																	left: 10,
																	width: 150,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														}
													}
												}
											},
											'open-movie': {
												type: 'display.element',
												initial: {
													props: {
														height: 104,
														width: 300
													}
												},
												children: {
													keys: [ 'open-desc', 'file-open-label', 'file-open-list' ],
													hash: {
														'open-desc': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 5,
																	left: 10,
																	height: 50,
																	width: 290
																},
																attr: {
																	text: 'Please select a file to open.'
																}
															}
														},
														'file-open-label': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 35,
																	left: 10,
																	height: 16,
																	width: 150
																},
																attr: {
																	text: 'File name:'
																}
															}
														},
														'file-open-list': {
															type: 'display.form.dropdown',
															initial: {
																props: {
																	top: 56,
																	left: 10,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														}
													}
												}
											},
											'register-user': {
												type: 'display.element',
												initial: {
													props: {
														height: 104,
														width: 300
													}
												},
												children: {
													keys: [ 'register-desc', 'register-user-lbl', 'register-user-txt', 'register-pass-lbl', 'register-pass-txt' ],
													hash: {
														'register-desc': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 5,
																	left: 10,
																	height: 50,
																	width: 290
																},
																attr: {
																	text: 'Provide a username and password.'
																}
															}
														},
														'register-user-lbl': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 35,
																	left: 10,
																	height: 18,
																	width: 35
																},
																attr: {
																	text: 'user:'
																}
															}
														},
														'register-user-txt': {
															type: 'display.form.textfield',
															initial: {
																props: {
																	top: 35,
																	left: 45,
																	height: 18,
																	width: 100,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														},
														'register-pass-lbl': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 35,
																	left: 155,
																	height: 18,
																	width: 35
																},
																attr: {
																	text: 'pass:'
																}
															}
														},
														'register-pass-txt': {
															type: 'display.form.textfield',
															initial: {
																props: {
																	top: 35,
																	left: 190,
																	height: 18,
																	width: 100,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														}
													}
												}
											},
											'embed-movie': {
												type: 'display.element',
												initial: {
													props: {
														height: 120,
														width: 300
													}
												},
												children: {
													keys: [ 'embed-desc', 'embed-text' ],
													hash: {
														'embed-desc': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 5,
																	left: 10,
																	height: 50,
																	width: 290
																},
																attr: {
																	text: 'Copy and paste the code below into your web pages HTML.'
																}
															}
														},
														'embed-text': {
															type: 'display.form.textarea',
															initial: {
																props: {
																	top: 40,
																	left: 5,
																	width: 285,

																	height: 70,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														}
													}
												}
											}
										}
									}
								},
								'btn-submit': {
									type: 'display.button',
									initial: {
										props: {
											fill: {
												type: 'solid',
												colors: [
													{
														rgb: '#bbbbbb',
														opacity: 1
													}
												]
											},
											right: 10,
											left: '',
											top: '',
											bottom: 10,
											width: 70,
											height: 32,
											'border-radius': 5
										}
									},
									behavior: {
										click: {
											event: "dialog.submit"
										}
									},
									children: {
										keys: [ 'import-submit-label' ],
										hash: {
											'import-submit-label': {
												type: 'display.label',
												initial: {
													props: {
														top: 8,
														width: 70,
														'text-align': 'center',
														'font-weight': 'bold',
														'font-family': 'arial'
													},
													attr: {
														text: 'Ok'
													}
												},
												states: {
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	
	$.fn.fluxui.evt().addListener( 'app.loaded', function() {
		$('#movie-container').fluxui( editor, function( data ) { new data.types.editor( data.inst ); } );
	} );
	
} );
