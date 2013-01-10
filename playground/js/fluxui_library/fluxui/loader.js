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
	
	/*
		toast, just a minimal but yet powerful resource loader
	
		Version     : 0.2.10
		Author      : AurÃ©lien Delogu (dev@dreamysource.fr)
		Homepage    : https://github.com/pyrsmk/toast
		License     : MIT
	*/
	
	/*
		Load resources
		
		Parameters
			Array resources     : resource list
			Function complete   : called when all resources have been loaded
	*/
	
	var toast = function( resources, complete ) {
		var toast = this.toast,
			resource,
			node,
			doc = document,
			head = doc.getElementsByTagName('head')[0],
			setTimeout = this.setTimeout,
			createElement = 'createElement',
			appendChild = 'appendChild',
			addEventListener = 'addEventListener',
			onreadystatechange = 'onreadystatechange',
			styleSheet = 'styleSheet',
			i,
			scriptsToLoad,
			ten = 10,
			// Watch if all resources have been loaded
			isComplete = function() {
				if ( --scriptsToLoad < 1 && complete && complete() === false )
					setTimeout( isComplete, ten );
			},
			// Watch if a CSS resource has been loaded
			watchStylesheet = function( node ) {
				if ( node.sheet || node[styleSheet] )
					isComplete();
				else
					setTimeout( function() { watchStylesheet( node ); }, ten );
			},
			// Watch if a script has been loaded
			watchScript = function() {
				if ( /ded|co/.test( this.readyState ) )
					isComplete();
			},
			// Watch a resource list
			watchResourceList = function( local, global ) {
				return function() {
					if ( local )
						local();
					global();
				};
			};
		// Waiting for DOM readiness
		if ( head || setTimeout( toast, ten ) ) {
			// Format
			if ( resources === '' + resources )
				resources = [resources];
			// Load resources
			i = scriptsToLoad = resources.length;
			while ( resource = resources[--i] ) {
				// Points out to another resource list
				if(resource.pop)
					toast( resource[0], watchResourceList( resource[1], isComplete ) );
				// CSS
				else if ( /\.css$/.test( resource ) ) {
					// Create LINK element
					node = doc[createElement]( 'link' );
					node.rel = styleSheet;
					node.href = resource;
					head[appendChild]( node );
					// Watching loading state
					watchStylesheet( node );
				}
				// JS
				else {
					// Create SCRIPT element
					node = doc[createElement]( 'script' );
					node.src = resource;
					head[appendChild]( node );
					// Watching loading state
					if ( node[onreadystatechange] === null )
						// Trident, Presto
						node[onreadystatechange] = watchScript;
					else
						// Webkit, Gecko (also IE>=9 and Presto)
						node.onload = isComplete;
				}
			}
		}
	};
	
	$class.create( {
		namespace : 'loader',
		statics : {
			load : function( resources, complete ) {
				toast( resources, complete );
			},
			classesToLoad : function( $data, $list ) {
				$list = $list || [];
				if ( !types.display.element.classLoaded( $data.type ) ) $list.push( types.core.serverPath + 'components/' + $data.type + '/fluxui.class.js' );
				if ( !!$data.children ) {
					var c = $data.children;
					for ( var i = 0; i < c.keys.length; i++ )
						types.loader.classesToLoad( c.hash[c.keys[i]], $list )
				}
				return $list;
			}
		}
	} );
	
} )(jQuery,this);