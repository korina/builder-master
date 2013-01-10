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
	 * Dialog class
	 * Displays dialogues for the user to confirm or enter info into
	 *
	 * Requires:
	 *		../element.js
	 **/
	 
	var clazz = $class.create( {
		namespace : 'controls.dialog',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			alertMsg: 'alert-message',
			importAsset: 'import-asset',
			newLibraryFolder: 'library-folder',
			importComponent: 'import-component',
			saveMovie: 'save-movie',
			openMovie: 'open-movie',
			registerUser: 'register-user',
			embedMovie: 'embed-movie',
			folderTxt: 'folder-text',
			lblTxt: 'asset-lbl-text',
			urlTxt: 'asset-url-text',
			fileTxt: 'asset-file-text',
			userTxt: 'register-user-txt',
			passTxt: 'register-pass-txt',
			emailTxt: 'register-email-txt',
			registerMsg: 'register-msg-lbl',
			embedTxt: 'embed-text',
			filenameTxt: 'file-name-text',
			fileOpenList: 'file-open-list',
			progress: 'asset-progress'
		},
		methods : {
			initialise : function() {
				types.controls.dialog._inst = this;
				this.$node().dialog( { modal : true } );
				this.hide();
			},
			bindEvents : function() {
				this.addListener( 'dialog.submit', this.handleSubmit );
				this.addListener( 'dialog.close', this.hide );
				clazz.Super.bindEvents.apply( this, Array.prototype.slice.call( arguments ) );
			},
			// Check if dialogue is visible.
			isOpen : function() {
				return types.controls.dialog.getInstance().$node().dialog( "isOpen" );
				//types.controls.dialog.getInstance().visible();
			},
			// Hide dialogue.
			hide : function() {
				types.controls.dialog.getInstance().$node().dialog( "close" );
				//types.controls.dialog.getInstance().visible( false );
			},
			// Show dialogue.
			show : function() {
				types.controls.dialog.getInstance().$node().dialog( "open" );
				//types.controls.dialog.getInstance().visible( true );
			},
			// Sets the height of the dialog
			height : function( h ) {
				types.controls.dialog.getInstance().$node().dialog( "option", "height", h );
			},
			// Sets the width of the dialog
			width : function( w ) {
				types.controls.dialog.getInstance().$node().dialog( "option", "width", w );
			},
			// Sets the title of the dialog
			title : function( t ) {
				types.controls.dialog.getInstance().$node().dialog( "option", "title", t );
			},
			// Returns content element.
			contentContainer : function() {
				return this.getChildById('dialog-content');
			},
			// Set children of the content element to blank text.
			// Then show or hide according to whether they match the passed value for type.
			setContent : function( type ) {
				var j,i,t = this; c = t.contentContainer().$node().children(),
					l = [ t.folderTxt, t.lblTxt, t.urlTxt, t.userTxt, t.passTxt, t.emailTxt ];
				t.contentContainer().getChildById( t.progress ).display( false );
				for ( i = 0; i < l.length; i++ ) {
					j = t.getChildById( l[i] );
					if ( !!j ) j.text('');
				}
				for ( i = 0; i < c.length; i++ ) {
					var p = types.display.element.getInstance( c[i] );
					if ( p.fluxid() == type ) {
						p.display( true );
						t.height( p.height() + 85 );
						t.width( p.width() + 20 );
						t.title( p.attribute( 'text' ) );
						t.current = type;
					} else
						p.display( false );
				}
			},
			// ensures correct URL formatting
			properUrl : function( url ) {
				if ( url.indexOf( 'http' ) != 0 ) url = 'http://' + url;
				return url;
			},
			// All the variations of dialogues so far used with corresponding events dispatched.
			handleSubmit : function() {
				var c, d = types.controls.dialog.getInstance();
				switch( d.current ) {
					case d.importAsset:
						c = d.getChildById( d.importAsset );
						var lbl = c.getChildById( d.lblTxt ).text();
						var url = c.getChildById( d.urlTxt ).text();
						var file = c.getChildById( d.fileTxt ).$node();
						var progress = c.getChildById( d.progress );
						if ( !types.core.isURL( url ) && url != "" ) return d.showAlert( 'Please supply a valid path.' );
						if ( url == "" && file == null ) return d.showAlert( 'Please supply an asset to upload or path to remote asset.' );
						if ( file[0].files && file[0].files.length > 0 ) {
							progress.display( true );
							progress.getChildById( 'duration' ).width( 0 );
							d.$node().fileupload( {
								dataType: 'text',
								url: '/data/upload',
								progressall: function ( e, data ) {
									progress.getChildById( 'duration' ).width( 288 * ( data.loaded / data.total ) );
								}
							} );
							d.$node().fileupload( {
								formData: { label : lbl },
								done : function( e, data ) {
									console.log( data );
									var dat = JSON.parse( data.result );
									// only supports http and https for now
									var s = types.core.serverPath;
									s = s.substr( 0, s.length - 1 );
									url = d.properUrl( s + dat.D[0].url );
									d.dispatch( 'dialog.confirm.' + d.current, lbl, url );
								},
								error : function( e, message, other ) {
									d.showAlert( "Could not upload asset. Are you logged in?" );
									console.log( e, message, other );
								}
							} )
							.fileupload( 'add', { files: file.get(0).files } );
						} else {
							// only supports http and https for now
							url = d.properUrl( url );
							d.dispatch( 'dialog.confirm.' + d.current, lbl, url );
						}
						break;
					case d.newLibraryFolder:
						c = d.getChildById( d.newLibraryFolder );
						var lbl = c.getChildById( d.folderTxt ).text().replace( '/', '-' );
						d.dispatch( 'dialog.confirm.' + d.current, lbl );
						break;
					case d.importComponent:
						c = d.getChildById( d.importComponent );
						var lbl = c.getChildById( d.lblTxt ).text();
						var url = c.getChildById( d.urlTxt ).text();
						if ( !types.core.isURL( url ) ) return d.showAlert( 'Please supply a valid path.' );
						// only supports http and https for now
						if ( url.indexOf( 'http' ) != 0 ) url = 'http://' + url;
						d.dispatch( 'dialog.confirm.' + d.current, lbl, url );
						break;
					case d.saveMovie:
						c = d.getChildById( d.saveMovie );
						var filename = c.getChildById( d.filenameTxt ).text();
						if ( filename.length < 3 )
							return d.showAlert( 'The filename specified is less than the required 3 characters in length.' );
						d.dispatch( 'dialog.confirm.' + d.current, filename );
						break;
					case d.openMovie:
						c = d.getChildById( d.openMovie );
						var filename = c.getChildById( d.fileOpenList ).value();
						if ( filename == '-' )
							return d.showAlert( 'You must select a file to open before clicking \'Ok\'' );
						d.dispatch( 'dialog.confirm.' + d.current, filename );
						break;
					case d.registerUser:
						c = d.getChildById( d.registerUser );
						var user = c.getChildById( d.userTxt ).text(),
							pass = c.getChildById( d.passTxt ).text(),
							email = c.getChildById( d.emailTxt ).text();
						if ( user.length < 3 ) return d.showAlert( 'Username must be at least three characters' );
						if ( pass.length < 6 ) return d.showAlert( 'Password must be at least six characters' );
						if ( !types.controls.dialog.validEmail( email ) ) return d.showAlert( 'Email must be valid' );
						d.dispatch( 'dialog.confirm.' + d.current, user, pass, email );
						break;
					default:
						d.hide();
						break;
				}
			},
			showAlert : function( $msg ) {
				this.setContent( this.alertMsg );
				var c = this.getChildById( this.alertMsg );
				c.getChildById( 'message-text' ).text( $msg );
				this.show();
			}
		},
		statics : {
			getInstance : function() {
				return types.controls.dialog._inst;
			},
			validEmail : function( email ) { 
				var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test( email );
			}
		}
	} );
	
} )(jQuery,this);
