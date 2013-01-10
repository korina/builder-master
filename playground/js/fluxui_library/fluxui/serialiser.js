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

	/**
	 * Serialiser class
	 * Serialises and deserialises the class tree into JSON format.
	 **/
	$.fn.fluxui.$class.create( {
		namespace : 'serialiser',
		statics : {
			parse : function( id, data, parent, cb, node ) {
				if ( !data.type ) data.type == 'display.element';
				var i = types.display.element.make( data.type, id, data, node ),
					k, v, n;
				i.applyStateStyles();
				if ( !!parent && !!parent.addChild )
					parent.addChild( i.node );
				if ( !!data.children )
					for ( var c = 0; c < data.children.keys.length; c++ ) {
						k = data.children.keys[c];
						v = data.children.hash[k];
						n = types.serialiser.parse( k, v, i );
					}
				if ( !!cb )
					cb.call( i );
				else if ( !!i.initialise )
					i.initialise( id, data );
				i.applyStateAttributes();
				if ( !!i.actions )
					i.actions.applyBehaviors();
				return i;
			},
			encode : function( obj, output ) {
				if ( !output ) output = {};
				output.type = obj.entity();
				output.initial = types.core.clone( obj.states.initial );
				output.states = types.core.clone( obj.states.states );
				output.frames = types.core.clone( obj.frames );
				output.behavior = types.core.clone( obj.actions.behavior );
				output.bind = types.core.clone( obj.actions.bind );
				output.data = types.core.clone( obj.data );
				var c, h;
				if ( obj.numChildren() > 0 ) {
					h = output.children = { keys : obj.getChildIds(), hash : {} };
					c = obj.getChildren();
					for ( var i = 0; i < obj.numChildren(); i++ )
						types.serialiser.encode( c[i], h.hash[c[i].fluxid()] = {} );
				}
				return output;
			}
		}
	} );
	
} )(jQuery,this);