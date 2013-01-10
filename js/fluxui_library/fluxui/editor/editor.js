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
			var _editor = types.editor._instance = this;
			this.ed = $('#movie-container');
			this.ws = $movie.getChildById( 'workspace' );
			this.stage = $movie.getChildById( 'stage' );
			this.container = $movie.getChildById( 'stage-container' );
			this.view = $movie.getChildById( 'view' );
			this.menu = $movie.getChildById( 'menu' );
			this.hud = $movie.getChildById( 'hud' );
			this.library = $movie.getChildById( 'library-panel' );
			this.explorer = $movie.getChildById( 'explorer-panel' );
			this.propPanel = $movie.getChildById( 'propSheets' );
			this.colorPanel = $movie.getChildById( 'color-panel' );
			this.statePanel = types.controls.statePanel.getInstance();
			this.breadcrumbs = $movie.getChildById( 'breadcrumbs' );
			$('body').css( { overflow: 'hidden', margin: 0, padding: 0 } );
			this.currentItem = this.stage;
			this.manipulator = types.controls.manipulator.getInstance( 'overlay', this.manipulatorObj );
			this.applyContext( this.manipulator );
			
			this.manipulator.applyStateStyles();
			this.hud.addChild( this.manipulator.node );
			this.manipulator.initialise();
			this.manipulator.bindEvents();
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
			colorPanel : null,
			stageScale : 1
		},
		methods : {
			initialise : function( $movie ) {
				var _editor = this,
					ws = this.ws,
					me = this;
				
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
				c.bind( 'mousewheel', function( $event, $delta ) {
					$event.preventDefault();
					if ( $delta > 0 ) eventDispatcher.dispatch( this,'events.mousewheel.up' );
					if ( $delta < 0 ) eventDispatcher.dispatch( this,'events.mousewheel.down' );
				} );
							
				$(window).resize( function() {
					_editor.ed.width( $(this).width() );
					_editor.ed.height( $(this).height() );
					_editor.updateHud();
				} ).trigger( 'resize' );
	
				this.ws.$node().resize( function() {
					_editor.handleWorkspaceResize();
				} );
				
				c.find( '[fluxid=overlay]' ).click( function( $event ) {
					if ( $event.shiftKey == true ) {
						eventDispatcher.dispatch( this, 'events.manipulator.click', $event.pageX, $event.pageY );
					}
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
						if ( swatch.allowGradient ) swatch.setColor( color );
					},
					'controls.add.*' : function( ns, evt ) {
						ns = ns.replace( 'controls.add.', '' );
						_editor.addElement( ns, true );
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
					'library.add' : function( ns, id, content ) {
						_editor.addElement( id, false, 'library', content );
					},
					'events.element.open' : function() {
						_editor.openElement();
					},
					'breadcrumbs.crumb.clicked' : function( $ns, $evt ) {
						var i = inst( $($evt.target) );
						if ( i.className != 'controls.crumb' ) i = i.parent();
						if ( i.current == false ) {
							while ( _editor.currentItem != _editor.stage && _editor.view.pointer != i.ref ) {
								_editor.closeElement();
							}
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
					'dialog.confirm.register-user' : function( $ns, $user, $pass, $email ) {
						_editor.register( $user, $pass, $email );
					},
					'events.keys.press' : function() {
						_editor.keyDown.apply( _editor, Array.prototype.slice.call( arguments ) );
					},
					'events.mousewheel.up' : function() {
						me.zoomIn();
					},
					'events.mousewheel.down' : function() {
						me.panOut();
					},
					'stage.manipulator.reset' : function() {
						me.manipulator.reset();
					}
				} );
				this.setupKeys();
				this.alignment = new types.controls.alignment();
				this.propPanel.getChildById( 'src' ).addItem( '-- Please select --', '-' );
				this.showPropertySheet( 'stage' );
				this.ed.bind( 'dragstart', function( $event ) {
					if ( $event.target.nodeName.toUpperCase() == "IMG" ) return false;
				} );
				this.ed.css( {
					'-moz-user-select' : '-moz-none',
					'-khtml-user-select' : 'none',
					'-webkit-user-select' : 'none',
					'-ms-user-select' : 'none',
					'user-select' : 'none'
				} );
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
					url: types.core.securePath + "list"
				} ).done( function( data ) {
					ed.updateOpenDialog( eval( data ) );
				} );
			},
			updateOpenDialog : function( $d ) {
				var l = $d;
				if ( l.E != null && types.core.isArray( l.E ) ) {
					return this.showAlert( 'Unable to retrieve your files. ' + l.E[0] );
				}
				var d = types.controls.dialog.getInstance();
				if ( !d.isOpen() ) {
					this.closeToStage();
					var d = types.controls.dialog.getInstance();
					var lst = d.getChildById( d.fileOpenList );
					lst.removeAll();
					lst.addItem( '-- Please Select --', '-' );
					for ( var i = 0; i < l.D.length; i++ ) {
						lst.addItem( l.D[i] );
					}
					d.setContent( d.openMovie );
					d.show();
				}				
			},
			// Logging a user into his or her account (allows saving and loading)
			loginRequest : function( data ) {
				var u = this.menu.getChildById( 'user-txt' ),
					p = this.menu.getChildById( 'pass-txt' ),
					ed = this;
				$.post( types.core.securePath + "login", { u : u.text(), p : p.text() }, function( data ) { 
					var d = eval( data );
					if ( d.E != null ) {
						console.log( d.E[0] );
						if ( types.core.isArray( d.E ) && d.E[0] == "not found" ) {
							return ed.showAlert( 'Unable to login. Did you enter the correct user and pass?' );
						} else {
							return ed.showAlert( 'An error occurred on the server. If the problem persists, please contact an administrator.' );
						}
					} else {
						console.log( 'showing options' );
						ed.menu.showOptions();
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
				var ed = this;
				if ( this.movieName == null )
					return this.showAlert( 'Please save your project before requesting to embed.' );
				$.post( types.core.securePath + "preview/" + this.movieName, {}, function( data ) { 
					ed.embed( data );
				} );
			},
			// Previewing the composition in a pop-up.
			previewRequest : function() {
				var ed = this;
				if ( this.movieName == null ) {
					return this.showAlert( 'Please save your project before requesting to preview.' );
				}
				$.post( types.core.securePath + "preview/" + this.movieName, {}, function( data ) { 
					var d = data,
						s = ed.propPanel.propSheets.stage,
						w = parseInt( s.getChildById( 'width' ).text() ),
						h = parseInt( s.getChildById( 'height' ).text() );
					ed.newWindow = window.open( 
						types.core.securePath + "preview/" + ed.movieName, 
						"sub", 
						"status,height=" + ( h + 50 ) + ",width=" + ( w + 50 ) 
					);
				} );
			},
			// Save a project. Saves all project details to the database.
			save : function( $name ) {
				var f = {};
				f.movie = types.serialiser.encode( this.stage );
				f.assets = this.library.getAssets();
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
				if ( !s.getChildById( 'transparent' ).checked() ) {
					f.movie.initial.props.fill = {
						type: 'solid',
						colors: [ {
							rgb: s.getChildById( 'fill' ).color,
							opacity: 1
						} ]
					}
				}
				var d = JSON.stringify( f );
				var ed = this;
				$.post( types.core.securePath + "put", { title : $name, data : d }, function( data ) {
					var d = eval( data );
					if ( d.E != null ) return ed.showAlert( 'Could not save. Please login, then try again.' );
					var cb = ed.postSaveCB;
					ed.postSaveCB = null;
					if ( !!cb ) cb();
				} );
			},
			// Gets details of a previous project from the database and populates the stage with them.
			open : function( $filename ) {
				var ed = this;
				$.post( types.core.securePath + "get/" + $filename, {}, function( data ) {
					var d = eval( data );
					ed.addMovie( d.D.data, ed.stage, d.D.name );
					ed.statePanel.populate( ed.currentItem );
				} );
			},
			// Adds a new user to the database.
			register : function( user, pass, email ) {
				var d = types.controls.dialog.getInstance();
				var ed = this;
				$.post( types.core.securePath + "register", { u : user, p : pass, e : email }, function( data ) {
					var i = eval( data );
					if ( i.E == null ) {
						d.hide();
						ed.showAlert( 'User successfully registered. Please login.' );
					} else if ( types.core.isArray( i.E ) ) ed.showAlert( i.E[0] );
					else ed.showAlert( i.E );
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
			addMovie : function( data, view, name, $type ) {
				var i, newMov,
					movie = JSON.parse( data ),
					m = movie.movie,
					l = movie.assets,
					me = this;
				if ( !!m.children ) var c = m.children;
				if ( !!m.frames ) var f = m.frames;
				if ( !!name ) {
					this.newProject();
					this.movieName = name;
				}
				for ( i in l ) {
					if ( l.hasOwnProperty( i ) ) {
						this.library.addAssetToPath( l[i].url, l[i].path, i );
					}
				}
				eval( 'var json = ' + data );
				var process = function() {
					if ( !!c ) {
						for ( i = 0; i < c.keys.length; i++ ) {
							newMov = types.serialiser.parse( c.keys[i], c.hash[c.keys[i]], view );
							newMov.fui_selectable = true;
							me.applyContext( newMov );
							if ( !!$type ) eventDispatcher.dispatch( newMov, 'events.' + $type + '.addedToStage', newMov );
						}
					}
					types.core.processElement( view, function( e ) {
						e.fui_selectable = true;
						me.applyContext( e );
						e.$node().bind( 'click', e.fui_select );
					} );
					if ( !!name ) {
						var p = json.movie.initial.props;
						eventDispatcher.dispatch( me, 'events.stage.width.changed', me.stage.width( parseInt( p.width ) ) );
						eventDispatcher.dispatch( me, 'events.stage.height.changed', me.stage.height( parseInt( p.height ) ) );
						eventDispatcher.dispatch( me, 'events.stage.fill.changed', me.stage.height( p.fill ) );
					}
					if ( !!f ) me.stage.frames = types.core.clone( f );
					me.statePanel.populate( me.stage );
					eventDispatcher.dispatch( this, 'events.explorer.update' );
				};
				var list = types.loader.classesToLoad( json.movie );
				if ( list.length > 0 ) types.loader.load( list, function() { process(); } );
				else process();
			},
			// For adding basic elements to the compositon on stage.
			addElement : function( ns, select, origin, content ) {
				var p, mk = types.display.element.make;
				switch( ns ) {
					case 'div':
						p = 'container';
						break;
					case 'img':
						p = 'image';
						break;
					case 'lbl':
						p = 'label';
						break;
					case 'btn':
						p = 'button';
						break;
					default:
						p = 'element';
						break;
				}
				var j = mk( 
					'display.' + p, 
					null, 
					this.makeState( p, null, { src : content } ), 
					null, true 
				);
				j.applyStateStyles();
				this.currentItem.addChild( j.node );
				if ( !!j.initialise )
					j.initialise();
				j.applyStateAttributes();
				j.fui_selectable = true;
				this.applyContext( j );
				// we set a background color (overwritten) as an IE hack to fix click binding.
				j.$node().bind( 'click', j.fui_select );
				j.cascade( j.$node() );
				if ( !!select && select == true ) {
					selection.select( false, j.fluxid() );
					j.$node().trigger( 'click' );
				}
				eventDispatcher.dispatch( j, 'events.explorer.update' );
				if ( !!origin ) {
					eventDispatcher.dispatch( j, 'events.' + origin + '.addedToStage', j );
				}
				eventDispatcher.dispatch( types.controls.manipulator.getInstance(), 'stage.element.change' );
			},
			// For adding more complex elements to the composition on stage.
			addComponent : function( $data ) {
				this.addMovie( $data, this.currentItem, null, 'components' );
				eventDispatcher.dispatch( this, 'components.latest.addedToStage' );
			},
			
			// Stage management
			// Goes one level deeper into the composition so that child element can be placed inside the current element.
			openElement : function() {
				var t = selection.targets();
				for ( var i = 0; i < 2 && t.length == 2; i++ ) {
					if ( t[i].attr( 'fluxid' ) != 'overlay' ) {
						eventDispatcher.dispatch( this, 'events.stage.level.change', inst( t[i] ) );
						this.render( inst( t[i] ) );
					}
				}
				this.explorer.refresh();
			},
			// Goes back up one level in the composition.
			closeElement : function() {
				if ( this.currentItem != this.stage ) {
					eventDispatcher.dispatch( this, 'events.stage.level.change', this.view.pointer.parent() );
					this.render( this.view.pointer.parent() );
				}
				this.explorer.refresh();
			},
			// Goes to the top of the hierarchy of the composition.
			closeToStage : function() {
				while ( this.currentItem == this.view ) {
					this.closeElement();
				}
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
						for ( var i = 0; i < c.length; i++ ) {
							this.view.pointer.addChildFromClass( c[i] ); // yes, we want the parent element to be reset!
						}
						this.view.pointer.frames = this.view.frames;
					}
					this.view.pointer = ( isStage ) ? null : $e;
					this.view.empty();
					this.view.width( $e.width() );
					this.view.height( $e.height() );
					var c = $e._children.splice( 0 );
					for ( var i = 0; i < c.length; i++ ) {
						this.currentItem.addChild( c[i].$node() );
						c[i].fui_selectable = true;
						this.applyContext( c[i] );
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
				if ( !types.core.isArray( t ) ) t = [t];
				this.changeIndex( t, -1 );
			},
			deleteItems : function( $override ) {
				var i, t = selection.targets();
				if ( t.length < 1 ) return;
				if ( !!$override || confirm( 'Deleting an item is permanent. Are you sure?' ) ) {
					for ( i = 0; i < t.length; i++ ) {
						if ( t[i].attr( 'fluxid' ) != 'overlay' ) {
							var p = inst( t[i] );
							p.remove();
							p.destroy();
						}
					}
					this.stage.$node().trigger( 'click' );
					eventDispatcher.dispatch( this, 'events.explorer.update' );
				}
			},
			zoomIn : function() {
				if ( this.stageScale < 2.98 ) {
					this.stageScale = this.stageScale + 0.02;
					this.scale();
				}
			},
			panOut : function() {
				if ( this.stageScale > 0.22 ) {
					this.stageScale = this.stageScale - 0.02;
					this.scale();
				}
			},
			fullScale : function() {
				this.stageScale = 1;
				this.scale();
			},
			fullPanOut : function() {
				this.stageScale = 0.2;
				this.scale();
			},
			// It is necessary for the stage-container to be larger than the workspace for this effect to work smoothly.
			scale : function() {
				$( '[fluxid=stage-container]' ).css( 'transform', 'scale(' + this.stageScale + ')'  );
				$( '[fluxid=stage-container]' ).css( '-moz-transform', 'scale(' + this.stageScale + ')'  );
				$( '[fluxid=stage-container]' ).css( '-webkit-transform', 'scale(' + this.stageScale + ')'  );
				$( '[fluxid=stage-container]' ).css( '-o-transform', 'scale(' + this.stageScale + ')'  );
				$( '[fluxid=stage-container]' ).css( '-ms-transform', 'scale(' + this.stageScale + ')'  );
			},
			cutItems : function() {
				var i, t = selection.targets();
				this.clipboard = [];
				if ( t.length < 1 ) return;
				for ( i = 0; i < t.length; i++ ) {
					if ( t[i].attr( 'fluxid' ) != 'overlay' ) {
						this.clipboard.push( { fluxid : t[i].attr( 'fluxid' ), data : types.serialiser.encode( inst( t[i] ) ) } );
					}
				}
				for ( i = 0; i < t.length; i++ ) {
					if ( t[i].attr( 'fluxid' ) != 'overlay' ) {
						t[i].remove();
					}
				}
				this.stage.$node().trigger( 'click' );
				console.log( this.clipboard );
			},
			copyItems : function() {
				var i, t = selection.targets();
				this.clipboard = [];
				if ( t.length < 1 ) return;
				for ( i = 0; i < t.length; i++ ) {
					if ( t[i].attr( 'fluxid' ) != 'overlay' ) {
						this.clipboard.push( { 
							fluxid : t[i].attr( 'fluxid' ), 
							data : types.serialiser.encode( inst( t[i] ) ) 
						} );
					}
				}
			},
			pasteItems : function() {
				var i, t = this.clipboard, view = this.currentItem, me = this;
				if ( !t || t.length < 1 ) return;
				for ( i = 0; i < t.length; i++ ) {
					var name = t[i].fluxid + "_copy_";
					var cnt = 1;
					while ( $("[fluxid='" + name + cnt + "']").length > 0 ) {
						cnt++;
					}
					newMov = types.serialiser.parse( name + cnt, t[i].data, view );
					newMov.fui_selectable = true;
					newMov.$node().bind( 'click', newMov.fui_select );
					this.applyContext( newMov );
				}
				eventDispatcher.dispatch( this, 'events.explorer.update' );
			},
			selectAllItems : function() {
				var c = this.currentItem.getChildren();
				for ( var i = 0; i < c.length; i++ ) {
					selection.select( true, c[i].fluxid() );
					//c[i].fui_select.apply( c[i].$node() );
				}
				this.manipulator.reset();
				eventDispatcher.dispatch( this, 'events.stage.selectAll' );
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
					if ( dir > 0 ) n.insertAfter( p.children().get( ni ) );
					else n.insertBefore( p.children().get( ni-1 ) );
					j.node = n.get(0);
					n.data( 'currentInstance', j );
					n.bind( 'click', j.fui_select );
				}
			},
			applyContext : function( item ) {
				var ed = this;
				item.$node().get( 0 ).oncontextmenu = function() {
					if ( item != ed.manipulator ) item.$node().trigger( 'click' );
					return false;
				};
				
				item.$node().contextPopup( {
					title: 'Options',
					items: [
						{
							label : 'Cut',
							icon : 'assets/icons/cut.png',
							action : function() { ed.cutItems(); } 
						},
						{ 
							label : 'Copy',
							icon : 'assets/icons/copy.png',
							action : function() { ed.copyItems(); } 
						},
						{ label : 
							'Paste',
							icon : 'assets/icons/paste.png',
							action : function() { ed.pasteItems(); } 
						},
						null, // divider
						{ 
							label : 'Delete',
							icon : 'assets/icons/delete.png',
							action : function() { ed.deleteItems(); } 
						},
						null, // divider
						{ 
							label : 'About...',	
							icon : 'assets/icons/about.png',
							action : function() { ed.about(); } 
						}
					]
				} );
			},
			showAlert : function( $msg ) {
				var d = types.controls.dialog.getInstance();
				d.showAlert( $msg );
			},
			
			// Event handlers
			handleMenu : function( $evt ) {
				this[$evt.split('.').pop() + 'Request']();
			},
			
			handleElementChange : function( $ns, $prev, $cur, $evt ) {
				if ( !!$evt ) selection.select( $evt.shiftKey, $( $cur ).attr( 'fluxid' ) );
				var t = selection.targets(0),
					i = inst( t );
				if ( !!i && !!i.broadcast ) i.broadcast();
			},
			handleWorkspaceResize : function() {
				var o, p = this.container.$node();
					q = this.ws.$node();
				if ( p.height() > q.height() ) q.scrollTop( ( p.height() - q.height() ) / 2 );
				if ( p.width() > q.width() ) q.scrollLeft( ( p.width() - q.width() ) / 2 );
				o = this.ws.getChildById( 'overlay' );
				if ( !!o.update ) o.update();
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
				a.bindKey( i.keys.BACKSPACE, 'backspace' );
				a.bindKey( i.keys.EQUALS, 'equals' );
				a.bindKey( i.keys.MINUS, 'minus' );
				a.bindKey( i.keys.DIGITS[0], '0' );
				a.bindKey( i.keys.DIGITS[9], '9' );
				a.bindKey( i.keys.A, 'a' );
				a.bindKey( i.keys.X, 'x' );
				a.bindKey( i.keys.C, 'c' );
				a.bindKey( i.keys.V, 'v' );
			},
			
			keyDown : function( ns, ev, shift, ctrl ) {
				var i = types.interaction,
					t = selection.targets();
				switch( ev ) {
					case 'left':
						this.ws.move( 'x', ( shift ) ? -5 : -1, null, 'overlay' );
						eventDispatcher.dispatch( this, 'stage.element.change' );
						break;
					case 'right':
						this.ws.move( 'x', ( shift ) ? 5 : 1, null, 'overlay' );
						eventDispatcher.dispatch( this, 'stage.element.change' );
						break;
					case 'up':
						if ( ctrl ) this.moveForward( t );
						else this.ws.move( 'y', ( shift ) ? -5 : -1, null, 'overlay' );
						eventDispatcher.dispatch( this, 'stage.element.change' );
						break;
					case 'down':
						if ( ctrl ) this.moveBack( t );
						else this.ws.move( 'y', ( shift ) ? 5 : 1, null, 'overlay' );
						eventDispatcher.dispatch( this, 'stage.element.change' );
						break;
					case 'backspace':
						this.deleteItems();
						break;
					case 'equals':
						if ( ctrl ) this.zoomIn();
						break;
					case 'minus':
						if ( ctrl ) this.panOut();
						break;
					case '0':
						if ( ctrl ) this.fullScale();
						break;
					case '9':
						if ( ctrl ) this.fullPanOut();
						break;
					case 'space':
						this.moveStage();
					case 'a':
						console.log( 'select all' );
						if ( ctrl ) this.selectAllItems();
						break;
					case 'x':
						console.log( 'cutting' );
						if ( ctrl ) this.cutItems();
						break;
					case 'c':
						console.log( 'copying' );
						if ( ctrl ) this.copyItems();
						break;
					case 'v':
						console.log( 'pasting' );
						if ( ctrl ) this.pasteItems();
						break;
				}
			},
			
			
			// Helpers
			makeState : function( $type, $props, $attr ) {
				var data = { type : $type, initial : {} };
				var i = data.initial;
				if ( !!$props ) i.props = $props;
				else i.props = {
					width: 100,
					height: 100,
					top: 0,
					left: 0
				};
				if ( !!$attr ) i.attr = $attr;
				else i.attr = {};
				switch( $type ) {
					case 'label':
						if ( !i.attr.text ) i.attr.text = 'Enter text in properties panel';
						i.props.color = '#000000';
						break;
					case 'container':
						i.props.fill = {
							type: 'solid',
							colors: [
								{
									rgb: '#999999'
								}
							]
						};
					case 'image':
						i.props['border-color'] = '#000000';
						break;
					case 'button':
					default:
						break;
				}
				return data;
			}
		},
		statics : {
			_instance : null,
			getInstance : function() {
				return types.editor._instance;
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
						height: 170,
						overflow: 'visible'
					}
				},
				children: {
					keys: [ 'color-type-lbl', 'color-type', 'color-angle-lbl', 'color-angle', 'color-viewer', 'swatch-panel', 'swatch-panel-lbl' ],
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
									top: 50,
									width: 270,
									height: 40
								}
							}
						},
						'swatch-panel': {
							type: 'display.element',
							initial: {
								props: {
									left: 10,
									top: 90,
									width: 270,
									height: 10,
									overflow: 'visible'
								}
							}
						},
						'swatch-panel-lbl': {
							type: 'display.label',
							initial: {
								props: {
									left: 10,
									top: 110,
									width: 270
								},
								attr: {
									text: 'Double click on the bar to add a swatch to the gradient. Click again on the swatch to change the color, or drag it to change the gradient.'
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
						height: 450
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
								keys: ['add-asset', 'add-folder'],
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
												event: 'properties.library.add.asset'
											}
										}
									},
									'add-folder': {
										type: 'display.image',
										initial: {
											props: {
												right: 50,
												left: '',
												top: 5,
												width: 16,
												height: 16,
												cursor: 'pointer'
											},
											attr: {
												src: 'btn-add-folder'
											}
										},
										behavior: {
											click: {
												event: 'properties.library.add.folder'
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
									height: 270,
									overflow: 'auto'
								}
							},
							children: {
								keys: [ 'asset-list' ],
								hash: {
									'asset-list': {
										type: 'display.element',
										initial: {
											props: {
												width: 300
											},
											attr: {
												id : 'treemenu-asset-list'
											}
										},
										children : {
											keys : [ 'sub-dirs', 'files' ],
											hash : {
												'sub-dirs': {
													type: 'display.container',
													initial: {
														props: {
															left: 4,
															position: 'relative'
														},
														attr : {
															class : 'sub-dirs'
														}
													},
													children : {
														keys : [],
														hash : {}
													}
												},
												'files': {
													type: 'display.container',
													initial: {
														props: {
															left: 4,
															position: 'relative'
														},
														attr : {
															class : 'files'
														}
													},
													children : {
														keys : [],
														hash : {}
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
				data: {
					keys: [ 'asset-button', 'directory-button' ],
					hash: {
						'asset-button': {
							type: 'controls.libitem',
							initial: {
								props: {
									position: 'relative',
									width: 285,
									height: 26
								},
								attr : {
									class : 'asset'
								}
							},
							behavior: {
								click: {
									event: 'properties.library.item.click'
								}
							},
							frames: {
								keys: ['initial', '_over' ],
								hash: {
									initial: {},
									_over: {}
								}
							},
							children: {
								keys: [ 'asset-bg', 'asset-label', 'asset-btn'],
								hash: {
									'asset-bg': {
										type: 'display.element',
										initial: {
											props: {
												width: 275,
												height: 26,
												fill: {
													type: 'solid',
													colors: [
														{ rgb: '#d6d6d6' }
													]
												}
											}
										},
										states: {
											_over: {
												props: {
													fill: {
														type: 'solid',
														colors: [
															{ rgb: '#9999ff' }
														]
													}
												}
											}
										}
									},
									'asset-label': {
										type: 'display.label',
										initial: {
											props: {
												bottom : 4,
												'padding-top': 5,
												'padding-bottom': 5,
												'padding-left': 10,
												height: 26,
												float: 'left',
												'min-width': 70,
												position: 'relative'
											},
											attr: {
												text: 'this is the label'
											}
										},
										states : {
											_over : {}
										}
									},
									'asset-btn': {
										type: 'display.image',
										initial: {
											props: {
												float: 'left',
												position: 'relative',
												left: 15,
												top: 5,
												width: 16,
												height: 16,
												cursor: 'pointer'
											},
											attr: {
												src: 'btn-remove-asset'
											}
										},
										states : {
											_over : {}
										}
									}
								}
							}
						},
						'directory-button': {
							type: 'controls.libdir',
							initial: {
								props: {
									position: 'relative',
									width: 285,
									'min-height' : 26
								}
							},
							behavior: {
								click: {
									event: 'properties.library.dir.click'
								}
							},
							frames: {
								keys: ['initial', '_over'],
								hash: {
									initial: {},
									_over: {}
								}
							},
							children: {
								keys: ['dir-bg', 'dir-icon', 'dir-label', 'dir-btn', 'sub-dirs', 'files'],
								hash: {
									'dir-bg': {
										type: 'display.element',
										initial: {
											props: {
												width: 275,
												height: 26,
												fill: {
													type: 'solid',
													colors: [
														{ rgb: '#d6d6d6' }
													]
												}
											}
										},
										states: {
											_over: {
												props: {
													fill: {
														type: 'solid',
														colors: [
															{ rgb: '#9999ff' }
														]
													}
												}
											}
										}
									},
									'dir-icon': {
										type: 'display.image',
										initial: {
											props: {
												left: 2,
												top: 4
											},
											attr: {
												src: 'directory'
											}
										}
									},
									'dir-label': {
										type: 'display.label',
										initial: {
											props: {
												position: 'relative',
												'padding-top': 5,
												'padding-bottom': 5,
												'padding-left': 26,
												height: 26,
												float: 'left',
												'min-width': 120
											},
											attr: {
												text: 'this is the label'
											}
										}
									},
									'dir-btn': {
										type: 'display.image',
										initial: {
											props: {
												float: 'left',
												position: 'relative',
												left: 15,
												top: 5,
												width: 16,
												height: 16,
												cursor: 'pointer'
											},
											attr: {
												src: 'btn-remove-asset'
											}
										},
										states : {
											_over : {}
										}
									},
									'sub-dirs': {
										type: 'display.container',
										initial: {
											props: {
												clear: 'left',
												left: 20,
												position: 'relative'
											},
											attr : {
												class : 'sub-dirs'
											}
										},
										children : {
											keys : [],
											hash : {}
										}
									},
									'files': {
										type: 'display.container',
										initial: {
											props: {
												left: 20,
												position: 'relative'
											},
											attr : {
												class : 'files'
											}
										},
										children : {
											keys : [],
											hash : {}
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
							frames: {
								keys: ['initial', '_over'],
								hash: {
									initial: {},
									_over: {},
								}
							},
							children: {
								keys: ['component-bg', 'component-label', 'component-icon'],
								hash: {
									'component-bg': {
										type: 'display.element',
										initial: {
											props: {
												width: 275,
												height: 26,
												fill: {
													type: 'solid',
													colors: [
														{ rgb: '#d6d6d6' }
													]
												}
											}
										},
										states: {
											_over: {
												props: {
													fill: {
														type: 'solid',
														colors: [
															{ rgb: '#9999ff' }
														]
													}
												}
											}
										}
									},
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
										},
										states: {
											_over : {}
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
												src: null
											}
										},
										states: {
											_over : {
												attr : {
													src : null
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
	};

	explorerPanel = {
		keys: [ 'explorer-panel' ],
		hash: {
			'explorer-panel': {
				type: 'controls.explorer',
				initial: {
					props: {
						position: 'relative',
						width: 300,
						height: 450
					}
				},
				children: {
					keys: ['explorer-list-container'],
					hash: {
						'explorer-list-container' : {
							type: 'display.element',
							initial: {
								props: {
									top: 5,
									width: 300,
									height: 449,
									overflow: 'auto'
								}
							},
							children: {
								keys: ['explorer-list'],
								hash: {
									'explorer-list': {
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
					keys: [ 'explorer-button' ],
					hash: {
						'explorer-button': {
							type: 'controls.exploreritem',
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
									event: 'properties.explorer.item.click'
								}
							},
							frames: {
								keys: ['initial', '_over', '_selected'],
								hash: {
									initial: {},
									_over: {},
									_selected: {}
								}
							},
							children: {
								keys: ['explorer-select', 'explorer-icon'],
								hash: {
									'explorer-select': {
										type: 'display.button',
										initial: {
											props: {
												width: 249,
												height: 26,
												fill: {
													type: 'solid',
													colors: [
														{ rgb: '#d6d6d6' }
													]
												}
											}
										},
										children: {
											keys: [ 'explorer-bg', 'explorer-label' ],
											hash: {
												'explorer-bg': {
													type: 'display.element',
													initial: {
														props: {
															width: 275,
															height: 26,
															fill: {
																type: 'solid',
																colors: [
																	{ rgb: '#d6d6d6' }
																]
															}
														}
													},
													states: {
														_over: {
															props: {
																fill: {
																	type: 'solid',
																	colors: [
																		{ rgb: '#9999ff' }
																	]
																}
															}
														},
														_selected: {
															props: {
																fill: {
																	type: 'solid',
																	colors: [
																		{ rgb: '#9999ff' }
																	]
																}
															}
														}
													}
												},
												'explorer-label': {
													type: 'display.label',
												 	initial: {
														props: {
															top: 5,
															left: 10,
															width: 200,
															height: 16
														},
														attr: {
															text: 'this is the label'
														}
													}
												}
											}
										}
									},
									'explorer-icon': {
										type: 'display.image',
										initial: {
											props: {
												top: 5,
												left: "",
												right: 5,
												width: 16,
											},
											attr: {
												src: 'visible'
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
				url: '/assets/align-left.gif'
			},
			'align-center-x-img': {
				url: '/assets/align-center-x.gif'
			},
			'align-right-img': {
				url: '/assets/align-right.gif'
			},
			'align-top-img': {
				url: '/assets/align-top.gif'
			},
			'align-center-y-img': {
				url: '/assets/align-center-y.gif'
			},
			'align-bottom-img': {
				url: '/assets/align-bottom.gif'
			},
			'distribute-left-img': {
				url: '/assets/distribute-left.gif'
			},
			'distribute-center-x-img': {
				url: '/assets/distribute-center-x.gif'
			},
			'distribute-right-img': {
				url: '/assets/distribute-right.gif'
			},
			'distribute-top-img': {
				url: '/assets/distribute-top.gif'
			},
			'distribute-center-y-img': {
				url: '/assets/distribute-center-y.gif'
			},
			'distribute-bottom-img': {
				url: '/assets/distribute-bottom.gif'
			},
			'match-width-img': {
				url: '/assets/match-width.gif'
			},
			'match-height-img': {
				url: '/assets/match-height.gif'
			},
			'match-both-img': {
				url: '/assets/match-both.gif'
			},
			'space-x-img': {
				url: '/assets/space-x.gif'
			},
			'space-y-img': {
				url: '/assets/space-y.gif'
			},
			'accordion-btn': {
				url: '/assets/accordion-btn.gif'
			},
			'accordion-btn-selected': {
				url: '/assets/accordion-btn-selected.gif'
			},
			'accordion-right-arrow': {
				url: '/assets/accordion-right-arrow.gif'
			},
			'accordion-down-arrow': {
				url: '/assets/accordion-down-arrow.gif'
			},
			'placeholder': {
				url: '/assets/spacer.gif'
			},
			'ico-properties': {
				url: '/assets/ico-properties.png'
			},
			'ico-palette': {
				url: '/assets/ico-palette.png'
			},
			'ico-align': {
				url: '/assets/ico-align.png'
			},
			'ico-library': {
				url: '/assets/ico-library.png'
			},
			'ico-components': {
				url: '/assets/ico-components.png'
			},
			'ico-state': {
				url: '/assets/ico-state.png'
			},
			'ico-explorer': {
				url: '/assets/ico-explorer.png'
			},
			'logo': {
				url: '/assets/logo.gif'
			},
			'btn-div': {
				url: '/assets/btn-div.png'
			},
			'btn-img': {
				url: '/assets/btn-img.png'
			},
			'btn-lbl': {
				url: '/assets/btn-lbl.png'
			},
			'btn-btn': {
				url: '/assets/btn-btn.png'
			},
			'btn-add-asset': {
				url: '/assets/btn-add-asset.png'
			},
			'btn-add-folder': {
				url: '/assets/btn-add-folder.png'
			},
			'btn-remove-asset': {
				url: '/assets/btn-remove-asset.png'
			},
			'btn-reset-asset': {
				url: '/assets/btn-reset-asset.png'
			},
			'btn-placeholder-asset': {
				url: '/assets/btn-placeholder-asset.png'
			},
			'alpha-bg': {
				url: '/assets/alpha-bg.png'
			},
			'white-pixel': {
				url: '/assets/white-pixel.png'
			},
			'visible': {
				url: '/assets/icons/visible.png'
			},
			'invisible': {
				url: '/assets/icons/invisible.png'
			},
			'directory' : {
				url : '/assets/directory.png'
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
																},
																attr: {
																	placeholder: 'Username'
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
																	placeholder: 'Password'
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
																				width: 42,
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
										keys: [ 'acc-property-panel', 'acc-color-panel', 'acc-state-panel', 'acc-align-panel', 'acc-library-panel', 'acc-component-panel', 'acc-explorer-panel', 'acc-script-panel' ],
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
														text: 'Background Gradient',
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
														text: 'Asset Library',
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
											},
											'acc-explorer-panel': {
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
														id: 'explorerPanel',
														text: 'Item List',
														icon: 'ico-explorer'
													}
												},
												children: explorerPanel
											},
											'acc-script-panel': {
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
														id: 'scriptPanel',
														text: 'Scripts',
														icon: 'ico-explorer'
													}
												},
												children: explorerPanel
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
										attr: {
											drag: true
										},
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
											'min-height': 5000,
											'min-width': 5000
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
											src: 'btn-div',
											title: 'Add a plain element'
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
											src: 'btn-img',
											title: 'Add an image'
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
											src: 'btn-lbl',
											title: 'Add a label (textual content)'
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
											src: 'btn-btn',
											title: "Add a button (for switching between 'states')"
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
								position: 'relative'
							}
						},
						children: {
							keys: [ 'dialog-content', 'btn-submit' ],
							hash: {
								'dialog-content': {
									type: 'display.element',
									initial: {
										props: {
											position: 'relative'
										}
									},
									children: {
										keys: [ 'alert-message', 'library-folder', 'import-asset', 'save-movie', 'open-movie', 'register-user', 'embed-movie' ],
										hash: {
											'alert-message': {
												type: 'display.element',
												initial: {
													props: {
														position: 'relative',
														width: 350,
														height: 100
													}
												},
												children: {
													keys: [ 'message-text' ],
													hash: {
														'message-text': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 15,
																	left: 10
																}
															}
														}
													}
												}
											},
											'library-folder': {
												type: 'display.element',
												initial: {
													props: {
														position: 'relative',
														height: 154,
														width: 300
													},
													attr: {
														text: 'Add folder...'
													}
												},
												children: {
													keys: [ 'folder-desc', 'folder-label', 'folder-text' ],
													hash: {
														'folder-desc': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 15,
																	left: 10,
																	height: 50,
																	width: 290
																},
																attr: {
																	text: 'Please provide a unique name for your folder.'
																}
															}
														},
														'folder-label': {
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
																	text: 'Folder name:'
																}
															}
														},
														'folder-text': {
															type: 'display.form.textfield',
															initial: {
																props: {
																	top: 96,
																	left: 10,
																	width: 280,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														}
													}
												}
											},
											'import-asset': {
												type: 'display.element',
												initial: {
													props: {
														position: 'relative',
														width: 400,
														height: 198
													},
													attr: {
														text: 'Import Asset'
													}
												},
												children: {
													keys: [ 'import-desc', 'asset-lbl-label', 'asset-lbl-text', 'asset-url-label', 'asset-url-text', 'asset-file-label', 'asset-file-text', 'asset-progress' ],
													hash: {
														'import-desc': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 15,
																	left: 10,
																	height: 60,
																	width: 390
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
																	top: 85,
																	left: 10,
																	height: 16,
																	width: 150
																},
																attr: {
																	text: 'Name:'
																}
															}
														},
														'asset-lbl-text': {
															type: 'display.form.textfield',
															initial: {
																props: {
																	top: 85,
																	left: 60,
																	width: 300,
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
																	top: 135,
																	left: 10,
																	height: 16,
																	width: 150
																},
																attr: {
																	text: 'Path:'
																}
															}
														},
														'asset-url-text': {
															type: 'display.form.textfield',
															initial: {
																props: {
																	top: 135,
																	left: 60,
																	width: 300,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														},
														'asset-file-label': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 110,
																	left: 10,
																	height: 16,
																	width: 150
																},
																attr: {
																	text: 'Upload:'
																}
															}
														},
														'asset-file-text': {
															type: 'display.form.file',
															initial: {
																props: {
																	top: 107,
																	left: 60,
																	width: 300,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																},
																attr: {
																	'data-url': '/upload',
																	'data-form-data': '{"script": "true"}',
																	name: 'files[]'
																}
															}
														},
														'asset-progress': {
															type: 'display.element',
															initial: {
																props: {
																	display: 'none',
																	left: 10,
																	top: 170,
																	width: 350,
																	height: 16
																}
															},
															children: {
																keys: [ 'asset-progress-label', 'asset-progress-bar' ],
																hash: {
																	'asset-progress-label': {
																		type: 'display.label',
																		initial: {
																			props: {
																				'font-family': 'arial',
																				height: 16,
																				width: 150
																			},
																			attr: {
																				text: 'Progress:'
																			}
																		}
																	},
																	'asset-progress-bar': {
																		type: 'display.element',
																		initial: {
																			props: {
																				top: 5,
																				left: 60,
																				width: 290,
																				height: 7,
																				fill: {
																					type: 'solid',
																					colors: [
																						{
																							rgb: '#000000'
																						}
																					]
																				},
																				'border-width': 1,
																				'border-color': '#bbbbbb'
																			},
																			attr: {
																				'data-url': '/upload',
																				'data-form-data': '{"script": "true"}',
																				name: 'files[]'
																			}
																		},
																		children: {
																			keys: [ 'duration' ],
																			hash: {
																				'duration': {
																					type: 'display.element',
																					initial: {
																						props: {
																							width: 0,
																							height: 5,
																							fill: {
																								type: 'solid',
																								colors: [
																									{
																										rgb: '#8ac820'
																									}
																								]
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
											'save-movie': {
												type: 'display.element',
												initial: {
													props: {
														position: 'relative',
														height: 154,
														width: 300
													},
													attr: {
														text: 'Save As...'
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
																	top: 15,
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
																	top: 75,
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
																	top: 96,
																	left: 10,
																	width: 280,
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
														position: 'relative',
														height: 124,
														width: 300
													},
													attr: {
														text: 'Open Movie'
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
																	top: 15,
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
																	top: 45,
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
																	top: 66,
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
														position: 'relative',
														height: 124,
														width: 300
													},
													attr: {
														text: 'Register'
													}
												},
												children: {
													keys: [ 'register-desc', 'register-user-lbl', 'register-user-txt', 'register-pass-lbl', 'register-pass-txt', 'register-email-lbl', 'register-email-txt' ],
													hash: {
														'register-desc': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 15,
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
																	top: 45,
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
																	top: 45,
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
																	top: 45,
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
																	top: 45,
																	left: 190,
																	height: 18,
																	width: 100,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														},
														'register-email-lbl': {
															type: 'display.label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 70,
																	left: 10,
																	height: 18,
																	width: 35
																},
																attr: {
																	text: 'email:'
																}
															}
														},
														'register-email-txt': {
															type: 'display.form.textfield',
															initial: {
																props: {
																	top: 70,
																	left: 45,
																	height: 18,
																	width: 245,
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
														position: 'relative',
														height: 150,
														width: 450
													},
													attr: {
														text: 'Embed Tag'
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
																	top: 15,
																	left: 10,
																	height: 50,
																	width: 440
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
																	top: 50,
																	left: 10,
																	width: 435,

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
												type: 'linear',
												direction: 0,
												colors: [
													{
														rgb: '#8bc920',
														pos: 0.1,
														opacity: 1
													},
													{
														rgb: '#4b7715',
														pos: 0.9,
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
