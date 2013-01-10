/**
 * @author Ed Rogers
 * @contributor Lee Sylvester
 * @copyright Influxis
 **/
( function( $ ) {

	var types = $.fn.fluxui.types;
	var fdata = $.fn.fluxui.fdata;
	var assets = $.fn.fluxui.assets;
	var $class = $.fn.fluxui.$class;

	/**
	 * Form class
	 * This is not a form object implementation. It provides functionality for dealing with form related requirements.
	 * Currently the form class is not being actively used.
	 *
	 * Requires:
	 *		../element.js
	 **/
	$.fn.fluxui.$class.create( {
		namespace : 'display.form.form',
		statics : {
			// Returns an array of form names used by all elements ( limited by element if required )
			getAllFormNames : function( $element ) {
				if ( !$element )
					$element = 'body';
				var formNames = [];
				$( $element ).find( '[formName]' ).each( function() {
					var thisForm = $( this ).attr( 'formName' );
					var pushing;
					for ( formName in formNames )
						if ( formNames[formName] === thisForm )
							pushing = false;
					if ( pushing !== false )
						formNames.push( thisForm );
				} );
				return formNames;
			},
			// Get a form's elements by form name ( or retrieve the first form's input ), and filter by class, tag and type
			getByFormName : function( $formName, $elClass, $tag, $type ) {
				if ( !$formName )
					var $formName = types.core.getAllFormNames()[0];
				if ( !$elClass && !$tag && !$type )
					return $( '[formName="' + $formName + '"]' );
				else {
					var returnEls = [];
					$( '[formName="' + $formName + '"]' ).each( function() {
						if ( !!$elClass && $( this ).hasClass( $elClass ) === true ) {
							for ( el in returnEls )
								if ( returnEls[el] !== this )
									var pushing = false;
							if ( pushing !== false )
								returnEls.push( this );
						};
						// Lee, check for matches by tag may not be needed, what do you think?
						if ( !!$tag && this.tagName === $tag ) {
							for ( el in returnEls )
								if ( returnEls[el] !== this )
									var pushing = false;
							if ( pushing !== false )
								returnEls.push( this );
						};
						// specifically for 'input' elements
						if ( !!$type && $( this ).attr( 'type' ) === $type ) {
							for ( el in returnEls )
								if ( returnEls[el] !== this )
									var pushing = false;
							if ( pushing !== false )
								returnEls.push( this );
						}
					} );
					return returnEls;
				}
			}
		}
	} );
	
} )(jQuery,this);
