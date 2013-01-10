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
	 * Dropdown class
	 * Provides for the select HTML tag, including option sub-elements.
	 *
	 * Requires:
	 *		../element.js
	 *		input.js
	 **/
	var clazz = $class.create( {
		namespace : 'display.form.dropdown',
		inherits : types.display.form.input,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			markup : '<select />'
		},
		methods : {
			initialise : function( $id, $descriptor ) {
				clazz.Super.initialise.call( this, $id, $descriptor );
				var i = $descriptor.initial;
				if ( !i.attr ) return;
				var a = i.attr;
				if ( a.formName )
					this.$node().attr( 'formName', a.formName );
				for ( i in a.labels ) {
					var elText = a.labels[i];
					this.addItem( elText, a.values[i] )
				}
				if ( !!a.selected ) this.selected( a.selected );
			},
			// Adds on option with a text label and a value
			addItem : function( $label, $value ) {
				this.addChild( this.$node(), 'option', $label, $value );
			},
			// Adds an option with a text label and a value at a certain index point.
			addItemAt : function( $indx, $label, $value ) {
				this.addChildAt( $indx, this.$node(), 'option', $label, $value );
			},
			// Select one option based on its value
			selectItem : function( $value ) {
				this.$node().find( '[value="' + $value + '"]' ).attr( 'selected', 'selected' );
			},
			// Unselect one option
			unselectItem : function( $value ) {
				this.$node().find( '[value="' + $value + '"]' ).removeAttr( 'selected' );
			},
			// Select one option, unselecting all others
			selectOnly : function( $value ) {
				for ( i = 0; i <= this.numChildren(); i++ ) this.unselectItem( this.__container.$node().children().get( i ).attr( 'value' ) );
				this.selectItem( $value );
			},
			// Remove an option
			removeItem : function( $label ) {
				var c = this.$node().children();
				var url;
				for ( var i = 0; i < c.length; i++ )
					if ( $(c[i]).html() == $label ) {
						url = $(c[i]).val();
						$(c[i]).remove();
					}
				return url;
			},
			removeAll : function() {
				this.$node().empty();
			},
			moveItem : function( $from, $to ) {
				var n = $(this.$node().children()[$from]), v = n.attr( 'value' );
				this.removeItem( n.text() );
				this.addItemAt( $to, n.text(), v );
			},
			index : function( $i ) {
				if ( !isNaN( $i ) )
					this.$node().get(0).selectedIndex = $i;
				return this.$node().get(0).selectedIndex;
			},
			// Search all options for those with matching label text
			contains : function( $t ) {
				if ( !!$t )
					return ( this.$node().find('option:contains(' + $t + ')').length > 0 );
				return false;
			},
			length : function() {
				return this.$node().children().length;
			},
			// Set default option (which will appear in the dropdown first)
			value : function( $v ) {
				if ( !!$v )
					this.$node().val( $v );
				return this.$node().val();
			},
			// Select all options with matching label text
			text : function( $t ) {
				if ( !!$t )
					this.$node().find('option:contains(' + $t + ')').attr('selected', 'selected');
				return $(this.$node().children()[this.index()]).text();
			},
			// Select one or a number of items based on their values
			selected : function( $value ) {
				if ( typeof $value == 'string' ) this.selectItem( $value );
				else for ( i in $value ) this.selectItem( $value[i] );
			},
			change : function( $self, $cb ) {
				this.$node().bind( 'change', function( e ) { $cb.call( $self, e ); } );
			}
		}
	} );
	
} )(jQuery,this);
