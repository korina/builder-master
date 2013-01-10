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
	 * Input class
	 * Provides for the input HTML tag and forms the basis of all other input related classes, even those like dropdown
	 * and textarea which are not using input tags.
	 *
	 * Requires:
	 *		../element.js
	 **/
	var clazz = $class.create( {
		namespace : 'display.form.input',
		inherits : types.display.element,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			markup : '<input />'
		},
		methods : {
			initialise : function( $id, $descriptor ) {
				var me = this;
				var d = $descriptor,
					i = d.initial;
				if ( !!i.attr ) {
					var a = i.attr;
					if ( a.formName )
						this.$node().attr( 'formName', a.formName );
				}
				if ( !!d.bind ) {
					var b = d.bind;
					for ( var i in b ) {
						if ( b.hasOwnProperty( i ) ) {
							if ( !!b[i].event )
								$.fn.fluxui.evt().addListener( b[i].event, function( $ns, $data ) {
									if ( i == 'text' )
										me.$node().val( $data );
									else
										me.$node().attr( i, $data );
								} );
						}
					}
				}
			},
			// Add a child element. See 'add child at'.
			addChild : function ( $id, $elem, $marker, $value, $type, $group, $chosen ) {
				this.addChildAt( $id.children().length, $id, $elem, $marker, $value, $type, $group, $chosen );
			},
			// Adds a child element in the given location. This function builds up the child based on the passed $elem value.
			// Others passed values optional. It then appends it to an element (passed as a JQuery element).
			addChildAt : function( $indx, $id, $elem, $marker, $value, $type, $group, $chosen ) {
				$chosen = !$chosen ? '' : ' ' + $chosen; // Typically 'selected' or 'checked'
				$value = !$value ? '' : ' value="' + $value + '"';
				$type = !$type ? '' : ' type="' + $type + '"';
				$group = !$group ? '' : ' name="' + $group + '"';
				var str = '<' + $elem + $type + $value + $group + $chosen + ' >' + $marker + '</' + $elem + '><br />';
				if ( $indx == 0 )
					$id.prepend( str );
				else if ( $indx >= $id.children().length )
					$id.append( str );
				else
					$id.find( ':nth-child(' + ( $indx + 1 ) + ')' ).before( str );
			},
			// Remove any number of children from an element (passed as a JQuery element)
			removeChild: function ( $id, $html, $value, $position ) {
				if ( !$html && !$value && !$position )
					$id.empty();
				else
					for ( option in $id )
						if ( $id[option].html() === $html || $id[option].val === $value || option === $position )
							$id[option].remove();
			}
		}
	} );
	
} )(jQuery,this);
