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
	var defaultStateName = 'initial';
	
	/**
	 * Container class
	 * This is the potential container class for all display objects
	 * providing border and background visuals. Necessary to accomodate
	 * idiocyncratic Internet Explorer behaviour.
	 * 
	 * Requires:
	 *		element.js
	 **/
	var clazz = $class.create( { 
		namespace : 'display.container',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
			if ( $.browser.msie ) {
				if ( $.browser.version >= 9 ) {
					// create background
					this.__bg = new types.display.element( this.fluxid() + '__bg', {} );
					this.__bg.applyStateStyles();
					this.__bgOuter = new types.display.element( this.fluxid() + '__bgOuter', {} );
					this.__bgOuter.$node().append( this.__bg.$node() );
					this.__bgOuter.applyStateStyles();
					this.$node().append( this.__bgOuter.$node() );
	
					// create container
					this.__container = new types.display.element( this.fluxid() + '__container', {} );
					this.__container.applyStateStyles();
					this.$node().append( this.__container.$node() );

					// create border overlay
					this.__border = new types.display.element( this.fluxid() + '__border', {} );
					this.__border.applyStateStyles();
					this.$node().append( this.__border.$node() );
				}
			}
		},
		fields : {
			isContainer : true
		},
		methods : {
			// creates border styles, including radius.
			style : function( type, prop, updateState ) {
				if ( !!prop && !!updateState )
					this.states.style( type, types.core.clone( prop ) );
				if ( $.browser.msie ) {
					if ( $.browser.version >= 9 ) {
						if ( type.indexOf( 'border' ) == 0 ) {
							if ( type == 'border-radius' ) {
								this.__bgOuter.style( type, prop );
								return this.__border.style( type, prop );
							} else if ( type == 'border-width' ) {
								this.__container.x( prop );
								this.__container.y( prop );
								return this.__border.style( type, prop );
							} else
								return this.__border.style( type, prop );
						}
						if ( type == 'width' || type == 'height' ) {
							this.__bgOuter.style( type, prop );
							this.__bg.style( type, prop );
							this.__border.style( type, prop );
							this.__container.style( type, prop );
						}
					}
				}
				
				return clazz.Super.style.call( this, type, prop );
			}
		}
	} );
	
} )(jQuery,this);
