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
	var lib;
	
	/**
	 * Library class
	 * Provides user interaction with library assets with the mouse from the properties panel.
	 *
	 * Requires:
	 *		../display/element.js
	 *		dialog.js
	 *		accordion.js
	 *		accordionpanel.js
	 **/
	
	var clazz = $class.create( {
		namespace : 'controls.library',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
			lib = this;
		},
		fields : {
			preview : null,
			treemenu : null,
			cntr : 20,
			assetNodes : null,
			selectionHandlerId : null
		},
		methods : {
			// Attaching functions to the relevent events; import, add, and click.
			initialise : function() {
				var me = this;
				this.assetViewer = this.getChildById( 'asset-viewer' );
				this.preview = this.getChildById( 'preview' );
				this.assetNodes = [];
				me.addTree();
			},

			bindEvents : function() {
				var me = this;
				this.addListener( 'dialog.confirm.import-asset', function( evt, label, url ) { me.addAssetToSelectedFolder( label, url ) } );
				this.addListener( 'dialog.confirm.library-folder', function( evt, label ) { me.addFolderToSelection( label ); } );
				this.addListener( 'properties.library.add.asset', function() { me.handleAddAssetClick() } );
				this.addListener( 'properties.library.add.folder', function() { me.handleAddFolderClick() } );
				clazz.Super.bindEvents.apply( this, Array.prototype.slice.call( arguments ) );
			},

			addTree : function() {
				var me = this;
				me.treemenu = new dhtmlXTreeObject( 'treemenu-asset-list', '100%', '100%', 0 );
				me.treemenu.setImagePath( 'treemenu/imgs/' );
				me.treemenu.enableDragAndDrop( true, true );
				me.selectionHandlerId = this.treemenu.attachEvent( 'onSelect', function( id ) { me.handleSelection( id ); } );
			},

			isNode : function( i ) {
				for ( var j in this.assetNodes )
					if ( this.assetNodes[j] == i ) return true;
				return false;
			},

			// Search children for all assets.
			getAssets : function() {
				var d = this.treemenu.getAllChildless()
				d = ( typeof d == 'string' ) ? d.split( ',' ) : [d];
				for ( var i in d )
					if ( !this.isNode( d[i] ) )
						d.splice( i, 1 );
				var o = {}, url, path;
				for ( i in d ) {
					url = this.treemenu.getUserData( d[i], 'url' );
					path = this.getItemPath( d[i] );
					o[this.treemenu.getItemText( d[i] )] = {
						url : url,
						path : path
					}
				}
				return o;
			},
			getItemPath : function( i ) {
				var s = "",
					p = this.treemenu.getParentId( i );
				return ( !!p && p != 0 && p != '' ) ? this.getItemPath( p ) + "/" + this.treemenu.getItemText( p ) : "";
			},
			getSelectedFolder : function() {
				var i = this.treemenu.getSelectedItemId();
				if ( this.isNode( i ) )
					i = this.treemenu.getParentId( i );
				return i;
			},
			getFolder : function( $root, $labels ) {
				if ( $root == '' ) $root = 0;
				var s = this.treemenu.getSubItems( $root ),
					subs = String( s ).split( ',' ),
					label = "";
				while ( label == "" )
					label = $labels.shift();
				for ( var i in subs )
					if ( this.treemenu.getItemText( parseInt( subs[i] ) ) == label )
						return ( $labels.length > 0 ) ? this.getFolder( subs[i], $labels ) : subs[i];
				var t = this.addFolder( $root, label );
				return ( $labels.length > 0 ) ? this.getFolder( t, $labels ) : t;
			},
			handleSelection : function( id ) {
				var u = this.treemenu.getUserData( id, 'url' );
				this.showPreview( u || 'assets/white-pixel.png' );
			},
			// Pop up a dialogue box for adding an asset.
			handleAddAssetClick : function() {
				var d = types.controls.dialog.getInstance();
				if ( !d.isOpen() ) {
					d.setContent( d.importAsset );
					d.show();
				}
			},
			handleAddFolderClick : function() {
				var d = types.controls.dialog.getInstance();
				if ( !d.isOpen() ) {
					d.setContent( d.newLibraryFolder );
					d.show();
				}
			},
			addFolder : function( $parentId, $label ) {
				var c = this.cntr;
				this.cntr++;
				this.treemenu.insertNewChild( $parentId, c, $label );
				this.treemenu.setItemImage( c, 'folderClosed.gif' );
				types.controls.dialog.getInstance().hide();
				return c;
			},
			addFolderToSelection : function( $label ) {
				var p = this.getSelectedFolder();
				if ( p == '' ) p = 0;
				return this.addFolder( p, $label );
			},
			// Add an asset to the library.
			addAsset : function( $url, $parentId, $label ) {
				var c = this.cntr;
				this.cntr++;
				this.assetNodes.push( c );
				this.treemenu.insertNewChild( $parentId, c, $label );
				this.treemenu.setUserData( c, 'url', $url );
				types.controls.dialog.getInstance().hide();
				assets[$label] = { url: $url };
				this.dispatch( 'properties.library.item.added', $label, $url );
			},
			// Adds an asset using a URL path
			addAssetToPath : function( $url, $path, $label ) {
				if ( !!$path ) {
					var p = this.getFolder( 0, $path.split( '/' ) );
					this.treemenu.selectItem( p );
					this.addAssetToSelectedFolder( $label, $url );
				} else
					this.addAsset( $url, 0, $label );
			},
			// Adds an asset with the info provided form the dialogue box, then hides the the dialogue box.
			addAssetToSelectedFolder : function( $label, $url ) {
				var p = this.getSelectedFolder();
				if ( p == '' ) p = 0;
				this.addAsset( $url, p, $label );
			},
			// Fill the preview pane with the image provided.
			showPreview : function( $url ) {
				this.preview.src( $url );
				this.preview.x( ( this.assetViewer.width() / 2 ) - ( this.preview.width() / 2 ) );
				this.preview.y( ( this.assetViewer.height() / 2 ) - ( this.preview.height() / 2 ) );
			},
			clear : function() {
				this.treemenu.detachEvent( this.selectionHandlerId );
				this.treemenu.destructor();
				this.assetNodes = [];
				this.cntr = 20;
				this.addTree();
			}
		}
	});
	
} )(jQuery,this);
