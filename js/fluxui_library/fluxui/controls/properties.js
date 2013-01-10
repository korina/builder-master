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
	 * Properties class
	 * Finds and loads the property sheets for elements of the composition into the properties panel.
	 *
	 * Requires:
	 *		../display/element.js
	 *		accordion.js
	 *		accordionpanel.js
	 **/
	
	var clazz = $class.create( {
		namespace : 'controls.properties',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
			types.controls.properties.getInstance( this );
		},
		fields : {
			propSheets : {},
			currentSheet : null
		},
		methods : {
			// Adds a new prop sheet and makes this the new current prop sheet (i.e. is the only one visible in the panel).
			addChild : function( $n ) {
				var $cls = types.display.element.getInstance( $n );
				this.propSheets[$cls.ens] = $cls;
				clazz.Super.addChild.call( this, $n );
				if ( !this.currentSheet ) this.currentSheet = $cls.ens;
				this.showSheet( this.currentSheet );
			},
			// Looks for prop sheet corresponding to the passed name in the passed path location. When found, create this sheet
			// so that it becomes an invisible (non-active) prop sheet in the panel.
			loadSheet : function( $path, $clsName ) {
				var me = this, t = types, segs;
				$.getScript( $path, function() {
					segs = $clsName.split( '.' );
					for ( var i = 0; i < segs.length; i++ )
						if ( t[segs[i]] )
							t = t[segs[i]];
						else {
							console.log( 'Could not find prop sheet', $clsName );
							return;
						}
					t.create();
				} );
			},
			// Chnages which prop sheet is currently visible in the panel.
			showSheet : function( $element ) {
				this.currentSheet = $element;
				var fnd;
				for ( var i in this.propSheets )
					if ( this.propSheets.hasOwnProperty( i ) ) {
						this.propSheets[i].display( i == this.currentSheet );
						if ( i == this.currentSheet ) {
							if ( !!this.propSheets[i].update )
								this.propSheets[i].update();
							fnd = true;
						}
					}
				if ( !fnd ) console.log( "Could not find property sheet for element", $element );
				return fnd;
			}
		},
		statics : {
			getInstance : function( inst ) {
				if ( !!inst )
					types.controls.properties._inst = inst;
				return types.controls.properties._inst;
			}
		}
	} );
	
} )(jQuery,this);
