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
	var defaultStateName = 'initial';

	/**
	 * State class
	 * Provides enclosed object state management, mostly to allow for a cleaner display
	 * object.
	 **/
	$.fn.fluxui.$class.create( {
		namespace : 'state',
		constructor : function( $initial, $states ) {
			this.initial = ( !!$initial ) ? types.core.clone( $initial ) : {props : {}, attr : {}};
			this.states = ( !!$states ) ? types.core.clone( $states ) : {};
			var i;
			for ( i in this.states )
				if ( this.states.hasOwnProperty( i ) ) {
					this.states[i].props = this.states[i].props || {};
					this.states[i].attr = this.states[i].attr || {};
				}
			this.initial.attr = this.initial.attr || {};
			this.initial.props = this.initial.props || {};
		},
		statics : {
			counter : 0
		},
		fields : {
			initial : null,
			states : null,
			state : defaultStateName
		},
		methods : {
			
			/**
			 * Retrieval
			 **/
			
			currentState : function( $s ) {
				if ( !!$s )
					this.state = $s;
				return $s;
			},
			
			// checks if a state has been added
			exists : function( $name ) {
				if ( $name == defaultStateName ) return true;
				return !!this.states[$name];
			},
			
			addState : function( $name ) {
				if ( $name == defaultStateName ) return;
				this.states[$name] = {};
				this.states[$name].props = {};
				this.states[$name].attr = {};
			},
			
			// Returns the current state data (extending initial state)
			getCurrentStateData : function() {
				return this.getStateData( this.state );
			},
			
			getStateData : function( $name ) {
				var i = defaultStateName;
				var props = types.core.clone( this[i] );
				//console.log( props );
				if ( $name != i ) {
					$.extend( true, props.attr, this.states[$name].attr );
					$.extend( true, props.props, this.states[$name].props );
				}
				return props;
			},
			
			/**
			 * Styles
			 **/
			
			// update a style in the state
			style : function( type, prop ) {
				var dp = this.initial;
				if ( this.state == defaultStateName ) {
					if ( prop != null )
						dp.props[type] = types.core.clone( prop );
					return dp.props[type];
				} else {
					if ( !this.states[this.state] ) this.states[this.state] = {props : {}, attr : {}};
					var sp = this.states[this.state];
					if ( prop != null )
						sp.props[type] = ( types.core.isEqual( dp.props[type], prop ) ) ? null : types.core.clone( prop );
					return sp.props[type] || dp.props[type];
				}
			},
			
			/**
			 * Attributes
			 **/
			
			setAttributeOnCurrentState : function( attr, value ) {
				this.setAttributeOnState( this.state, attr, value );
			},
			
			setAttributeOnAllStates : function( attr, value ) {
				for ( var i in this.states )
					if ( this.states.hasOwnProperty( i ) )
						this.setAttributeOnState( i, attr, null );
				this.setAttributeOnState( defaultStateName, attr, value );
			},
			
			setAttributeOnState : function( $state, $attr, $value ) {
				if ( $state == defaultStateName )
					this.initial.attr[$attr] = $value
				else
					this.states[$state].attr[$attr] = $value;
			}
		}
	} );
	
} )(jQuery,this);