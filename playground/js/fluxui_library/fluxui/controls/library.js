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
			this.assetCounter = 0;
			lib = this;
		},
		methods : {
			container : function() {
				return this.getChildById('asset-list');
			},
			// Attaching functions to the relevent events; import, add, and click.
			initialise : function() {
				var me = this;
				eventDispatcher.addListeners( {
					'dialog.confirm.import-asset' : function( evt, label, url ) { me.handleImportDialogSubmit( label, url ); },
					'properties.library.add' : function() { me.handleAddAssetClick(); },
					'properties.library.item.clicked' : function( evt, url ) { me.showPreview( url ); }
				} );
			},
			// Add an asset to the library.
			addAsset : function( $url, $label ) {
				var d = this.data.hash['asset-button'];
				if ( !!d ) {
					var p = types.serialiser.parse( 'asset_' + this.assetCounter++, d, this.container() );
					p.setUrl( $url );
					p.setLabel( $label );
					assets[$label] = { url: $url };
				}
				eventDispatcher._dispatch( 'properties.library.item.added', $label, $url );
			},
			// Fill the preview pane with the image provided.
			showPreview : function( url ) {
				this.getChildById( 'preview' ).src( url );
			},
			// Search children for all assets.
			getAssets : function() {
				var d = {};
				var c = this.container().getChildren();
				for ( var i = 0; i < c.length; i++ )
					d[c[i].label] = { url: c[i].url };
				return d;
			},
			// Pop up a dialogue box for adding an asset.
			handleAddAssetClick : function() {
				var d = types.controls.dialog.getInstance();
				if ( !d.isOpen() ) {
					d.setContent( d.importAsset );
					d.show();
				}
			},
			// Adds an asset with the info provided form the dialogue box, then hides the the dialogue box.
			handleImportDialogSubmit : function( $label, $url ) {
				lib.addAsset( $url, $label );
				types.controls.dialog.getInstance().hide();
			},
			clear : function() {
				var c = this.container().getChildren();
				for ( var i = 0; i < c.length; i++ )
					c[i].remove();
			}
		}
	} );
	
	/**
	 * Library item class
	 * A single asset within the library. 
	 *
	 * Requires:
	 *		../display/element.js
	 *		library.js
	 **/
	
	var clazb = $class.create( {
		namespace : 'controls.libitem',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazb.Super.constructor.call( this, $id, $descriptor );
		},
		methods : {
			// Bind functions to user interaction events.
			initialise : function() {
				var me = this;
				this.$node().bind( 'click', function() { me.click(); } );
				this.getChildById( 'asset-btn' ).$node().bind( 'click', function() { me.remove(); } );
			},
			// Set the URL for the asset
			setUrl : function( $url ) {
				this.url = $url;
			},
			// Set the text label (name) for the asset.
			setLabel : function( $label ) {
				this.label = $label;
				this.getChildById('asset-label').text( $label );
			},
			// Dispatch an event with the asset's URL.
			click : function() {
				eventDispatcher._dispatch( 'properties.library.item.clicked', this.url );
			},
			remove : function() {
				var lbl = this.getChildById('asset-label').text();
				this.$node().remove();
				eventDispatcher._dispatch( 'properties.library.item.removed', lbl );
			}
		}
	} );
	
} )(jQuery,this);
