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
			importAsset: 'import-asset',
			importComponent: 'import-component',
			saveMovie: 'save-movie',
			openMovie: 'open-movie',
			registerUser: 'register-user',
			embedMovie: 'embed-movie',
			lblTxt: 'asset-lbl-text',
			urlTxt: 'asset-url-text',
			userTxt: 'register-user-txt',
			passTxt: 'register-pass-txt',
			registerMsg: 'register-msg-lbl',
			embedTxt: 'embed-text',
			filenameTxt: 'file-name-text',
			fileOpenList: 'file-open-list'
		},
		methods : {
			initialise : function() {
				types.controls.dialog._inst = this;
				eventDispatcher.addListeners( {
					'dialog.submit' : this.handleSubmit,
					'dialog.close' : this.hide
				} );
				this.hide();
			},
			// Check if dialogue is visible.
			isOpen : function() {
				return types.controls.dialog.getInstance().visible();
			},
			// Hide dialogue.
			hide : function() {
				types.controls.dialog.getInstance().visible( false );
			},
			// Show dialogue.
			show : function() {
				types.controls.dialog.getInstance().visible( true );
			},
			// Returns content element.
			contentContainer : function() {
				return this.getChildById('dialog-content');
			},
			// Set children of the content elment to blank text.
			// Then show or hide according to whether they match the passed value for type.
			setContent : function( type ) {
				var j,i,t = this; c = t.contentContainer().$node().children(),
					l = [ t.lblTxt, t.urlTxt, t.userTxt, t.passTxt ];
				for ( i = 0; i < l.length; i++ ) {
					j = t.getChildById( l[i] );
					if ( !!j ) j.text('');
				}
				for ( i = 0; i < c.length; i++ ) {
					var p = types.display.element.getInstance( c[i] );
					if ( p.fluxid() == type ) {
						p.visible( true );
						t.current = type;
					} else
						p.visible( false );
				}
			},
			// All the variations of dialogues so far used with corresponding events dispatched.
			handleSubmit : function() {
				var c, d = types.controls.dialog.getInstance();
				switch( d.current ) {
					case d.importAsset:
						c = d.getChildById( d.importAsset );
						var lbl = c.getChildById( d.lblTxt ).text();
						var url = c.getChildById( d.urlTxt ).text();
						if ( !types.core.isURL( url ) ) return alert( 'Please supply a valid path.' );
						// only supports http and https for now
						if ( url.indexOf( 'http' ) != 0 ) url = 'http://' + url;
						eventDispatcher._dispatch( 'dialog.confirm.' + d.current, lbl, url );
						break;
					case d.importComponent:
						c = d.getChildById( d.importComponent );
						var lbl = c.getChildById( d.lblTxt ).text();
						var url = c.getChildById( d.urlTxt ).text();
						if ( !types.core.isURL( url ) ) return alert( 'Please supply a valid path.' );
						// only supports http and https for now
						if ( url.indexOf( 'http' ) != 0 ) url = 'http://' + url;
						eventDispatcher._dispatch( 'dialog.confirm.' + d.current, lbl, url );
						break;
					case d.saveMovie:
						c = d.getChildById( d.saveMovie );
						var filename = c.getChildById( d.filenameTxt ).text();
						if ( filename.length < 3 )
							return alert( 'The filename specified is less than the required 3 characters in length.' );
						eventDispatcher._dispatch( 'dialog.confirm.' + d.current, filename );
						break;
					case d.openMovie:
						c = d.getChildById( d.openMovie );
						var filename = c.getChildById( d.fileOpenList ).value();
						if ( filename == '-' )
							return alert( 'You must select a file to open before clicking \'Ok\'' );
						eventDispatcher._dispatch( 'dialog.confirm.' + d.current, filename );
						break;
					case d.registerUser:
						c = d.getChildById( d.registerUser );
						var user = c.getChildById( d.userTxt ).text(),
							pass = c.getChildById( d.passTxt ).text();
						if ( user.length < 3 ) return alert( 'Username must be at least three characters' );
						if ( pass.length < 6 ) return alert( 'Password must be at least six characters' );
						eventDispatcher._dispatch( 'dialog.confirm.' + d.current, user, pass );
						break;
					default:
						d.hide();
						break;
				}
			}
		},
		statics : {
			getInstance : function() {
				return types.controls.dialog._inst;
			}
		}
	} );
	
} )(jQuery,this);
