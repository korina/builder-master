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
	 * Timer class
	 * This is the animation timer engine.  Functions are removed when they return false.
	 * When all functions are removed, the timer is deleted.  Only one timer required
	 * to process all functions, application wide.
	 **/
	$.fn.fluxui.$class.create( {
		namespace : 'timer',
		statics : {
			timerID : 0,
			timers : [],
			start : function() {
				if ( types.timer.timerID )
					return;
				( function(){
					for ( var i = 0; i < types.timer.timers.length; i++ )
						if ( types.timer.timers[i]() === false ) {
							types.timer.timers.splice(i, 1);
							i--;
						}
					types.timer.timerID = setTimeout( arguments.callee, 0 );
				} )();
			},
			stop: function(){
				clearTimeout( types.timer.timerID );
				types.timer.timerID = 0;
			},
			add: function( fn ){
				types.timer.timers.push( fn );
				types.timer.start();
			}
		}
	} );
	
} )(jQuery,this);