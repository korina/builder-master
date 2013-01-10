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
	var inst = types.display.element.getInstance;
		
	var props = {
		type: 'properties.button',
		initial: {
			props: {
				fill: {
					type: 'linear',
					direction: 'top',
					colors: [
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0
						},
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0.295
						},
						{
							rgb: '#000000',
							opacity: 1,
							pos: 0.295
						},
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0.30
						},
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0.715
						},
						{
							rgb: '#000000',
							opacity: 1,
							pos: 0.72
						},
						{
							rgb: '#d6d6d6',
							opacity: 1,
							pos: 0.725
						}

					]
				},
				position: 'relative',
				width: 300,
				height: 215
			}
		},
		children: {
			keys: [ 'left', 'left-label', 'top', 'top-label', 'width', 'width-label', 'height', 'height-label', 'event-list', 'event-label', 'action-list', 'action-label', 'event-ctrls', 'id', 'id-label', 'class', 'class-label', 'flux-id', 'flux-id-label' ],
			hash: {
				left: {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 10,
							width: 50
						}
					},
					bind: {
						text: {
							event: 'events.display.button.left.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.button.left'
						},
						keyup: {
							event: 'properties.button.left'
						}
					}
				},
				'left-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 70,
							top: 10,
							width: 20
						},
						attr: {
							text: 'x'
						}
					}
				},
				top: {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 40,
							width: 50
						}
					},
					bind: {
						text: {
							event: 'events.display.button.top.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.button.top'
						},
						keyup: {
							event: 'properties.button.top'
						}
					}
				},
				'top-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 70,
							top: 40,
							width: 20
						},
						attr: {
							text: 'y'	
						}
					}
				},
				width: {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 100,
							top: 10,
							width: 50
						}
					},
					bind: {
						text: {
							event: 'events.display.button.width.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.button.width'
						},
						keyup: {
							event: 'properties.button.width'
						}
					}
				},
				'width-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 160,
							top: 10,
							width: 20
						},
						attr: {
							text: 'w'
						}
					}
				},
				height: {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 100,
							top: 40,
							width: 50
						}
					},
					bind: {
						text: {
							event: 'events.display.button.height.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.button.height'
						},
						keyup: {
							event: 'properties.button.height'
						}
					}
				},
				'height-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 160,
							top: 40,
							width: 20
						},
						attr: {
							text: 'h'
						}
					}
				},
				'event-list': {
					type: 'display.form.dropdown',
					initial: {
						props: {
							left: 10,
							top: 70,
							width: 55
						},
						attr: {
							labels: [ 'click', 'over', 'out' ],
							values: [ 'click', 'mouseover', 'mouseout' ]
						}
					}
				},
				'event-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 70,
							top: 70
						},
						attr: {
							text: 'on'
						}
					}
				},
				'action-list': {
					type: 'display.form.dropdown',
					initial: {
						props: {
							left: 100,
							top: 70,
							width: 140
						},
						attr: {
							labels: [ 'goto next frame', 'goto previous frame', 'goto frame label', 'goto url', 'mail to', 'dispatch event' ],
							values: [ 'gotoNextFrame', 'gotoPrevFrame', 'gotoFrame', 'gotoUrl', 'gotoEmail', 'dispatch' ]
						}
					}
				},
				'action-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 250,
							top: 70
						},
						attr: {
							text: 'action'
						}
					}
				},
				'event-ctrls': {
					type: 'display.element',
					initial: {
						props: {
							top: 90,
							left: 0,
							width: 300,
							height: 65
						}
					},
					children: {
						keys: [ 'ctrl-blank', 'ctrl-goto-label', 'ctrl-goto-url', 'ctrl-goto-email', 'ctrl-dispatch-event' ],
						hash: {
							'ctrl-blank': {
								type: 'display.element',
								initial: {}
							},
							'ctrl-goto-label': {
								type: 'display.element',
								initial: {
									props: {
										width: 300,
										height: 65
									}
								},
								children: {
									keys: [ 'frame-lbl-field', 'frame-lbl-label' ],
									hash: {
										'frame-lbl-field': {
											type: 'display.form.textfield',
											initial: {
												props: {
													top: 10,
													left: 10,
													width: 200
												}
											}
										},
										'frame-lbl-label': {
											type: 'display.label',
											initial: {
												props: {
													top: 10,
													left: 220
												},
												attr: {
													text: 'frame label'
												}
											}
										}
									}
								}
							},
							'ctrl-goto-url': {
								type: 'display.element',
								initial: {
									props: {
										width: 300,
										height: 65
									}
								},
								children: {
									keys: [ 'url-field', 'url-label' ],
									hash: {
										'url-field': {
											type: 'display.form.textfield',
											initial: {
												props: {
													top: 10,
													left: 10,
													width: 200
												}
											}
										},
										'url-label': {
											type: 'display.label',
											initial: {
												props: {
													top: 10,
													left: 220
												},
												attr: {
													text: 'url'
												}
											}
										}
									}
								}
							},
							'ctrl-goto-email': {
								type: 'display.element',
								initial: {
									props: {
										width: 300,
										height: 65
									}
								},
								children: {
									keys: [ 'email-field', 'email-label' ],
									hash: {
										'email-field': {
											type: 'display.form.textfield',
											initial: {
												props: {
													top: 10,
													left: 10,
													width: 200
												}
											}
										},
										'email-label': {
											type: 'display.label',
											initial: {
												props: {
													top: 10,
													left: 220
												},
												attr: {
													text: 'email'
												}
											}
										}
									}
								}
							},
							'ctrl-dispatch-event': {
								type: 'display.element',
								initial: {
									props: {
										width: 300,
										height: 65
									}
								},
								children: {
									keys: [ 'event-field', 'event-label' ],
									hash: {
										'event-field': {
											type: 'display.form.textfield',
											initial: {
												props: {
													top: 10,
													left: 10,
													width: 200
												}
											}
										},
										'event-label': {
											type: 'display.label',
											initial: {
												props: {
													top: 10,
													left: 220
												},
												attr: {
													text: 'event'
												}
											}
										}
									}
								}
							}
						}
					}
				},
				'id': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 160,
							width: 80
						}
					},
					bind: {
						text: {
							event: 'events.display.button.id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.button.id'
						},
						keyup: {
							event: 'properties.button.id'
						}
					}
				},
				'id-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 100,
							top: 160,
							width: 20
						},
						attr: {
							text: 'id'
						}
					}
				},
				'class': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 130,
							top: 160,
							width: 80
						}
					},
					bind: {
						text: {
							event: 'events.display.button.class.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.button.class'
						},
						keyup: {
							event: 'properties.button.class'
						}
					}
				},
				'class-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 160,
							width: 40
						},
						attr: {
							text: 'class'
						}
					}
				},
				'flux-id': {
					type: 'display.form.textfield',
					initial: {
						props: {
							left: 10,
							top: 190,
							width: 200
						}
					},
					bind: {
						text: {
							event: 'events.display.button.flux-id.changed'
						}
					},
					behavior: {
						change: {
							event: 'properties.button.flux-id'
						},
						keyup: {
							event: 'properties.button.flux-id'
						}
					}
				},
				'flux-id-label': {
					type: 'display.label',
					initial: {
						props: {
							left: 220,
							top: 190,
							width: 40
						},
						attr: {
							text: 'flux id'
						}
					}
				}
			}
		}
	}
	
	/**
	 * Button property class
	 * Provides functionality for the button element in the property panel.
	 *
	 * Requires:
	 *		propsheet.js
	 *		../controls/properties.js
	 **/
	 
	var clazz = $.fn.fluxui.$class.create( {
		namespace : 'properties.button',
		inherits : types.properties.propsheet,
		constructor : function( $id, $descriptor ) {
			clazz.Super.constructor.call( this, $id, $descriptor );
		},
		fields : {
			ens : 'display.button'
		},
		methods : {
			initialise : function( $id, $decorator ) {
				clazz.Super.initialise.call( this, $id, $decorator );
				
				var me = this;
				this.actionlist = this.getChildById( 'action-list' );
				this.eventlist = this.getChildById( 'event-list' );
				
				this.frameFld = this.getChildById( 'frame-lbl-field' );
				this.urlFld = this.getChildById( 'url-field' );
				this.emailFld = this.getChildById( 'email-field' );
				this.eventFld = this.getChildById( 'event-field' );
				
				this.actionlist.change( this, this.onAction );
				this.eventlist.change( this, this.onEvent );
				
				this.frameFld.change( this, this.frameChange );
				this.urlFld.change( this, this.urlChange );
				this.emailFld.change( this, this.emailChange );
				this.eventFld.change( this, this.eventChange );
				
				this.updateCtrls();
			},
			bindEvents : function() {
				var me = this;
				this.addListener( 'properties.button.*', function( $ns, $evt ) {
					me.handlePropertyChange( $($evt.target) );
				} );
				clazz.Super.bindEvents.apply( this, Array.prototype.slice.call( arguments ) );
			},
			// Show certain controls in panel based on fluxid.
			showCtrls : function( $name ) {
				var p, i;
				switch( $name ) {
					case 'gotoFrame':
						p = 'ctrl-goto-label';
						break;
					case 'gotoUrl':
						p = 'ctrl-goto-url';
						break;
					case 'gotoEmail':
						p = 'ctrl-goto-email';
						break;
					case 'dispatch':
						p = 'ctrl-dispatch-event';
						break;
					default:
						p = 'ctrl-blank';
						break;
				}
				var c = this.getChildById( 'event-ctrls' ).getChildren();
				for ( i = 0; i < c.length; i++ )
					c[i].display( c[i].fluxid() == p );
			},
			// Give the first target's behaviour an action (from the action list) and value (passed).
			createAction : function( $v ) {
				var a = inst( types.selection.getInstance().targets( 0 ) ).actions,
					e = this.eventlist.value(),
					t = a.behavior[e];
				if ( !t ) {
					a.behavior[e] = {};
					t = a.behavior[e];
				}
				t.action = this.actionlist.value();
				t.value = $v;
			},
			// Handler for actionlist change.
			onAction : function() {
				this.showCtrls( this.actionlist.value() );
				if ( this.actionlist.index() < 2 )
					this.createAction();
			},
			// Further handlers.
			onEvent : function() {
				this.updateCtrls();
			},
			frameChange : function() {
				this.createAction( this.frameFld.text() );
			},
			urlChange : function() {
				this.createAction( this.urlFld.text() );
			},
			emailChange : function() {
				this.createAction( this.emailFld.text() );
			},
			eventChange : function() {
				this.createAction( this.eventFld.text() );
			},
			// Setting the text content of various fields in the prop sheet.
			updateCtrls : function() {
				var itm = inst( types.selection.getInstance().targets(0) ),
					t = this.eventlist.value();
				if ( !itm ) return;
				var evt = itm.actions.behavior[t];
				if ( !!evt && !!evt.action ) {
					this.actionlist.value( evt.action );
					switch( evt.action ) {
						case 'gotoFrame':
							this.frameFld.text( evt.value );
							break;
						case 'gotoUrl':
							this.urlFld.text( evt.value );
							break;
						case 'gotoEmail':
							this.emailFld.text( evt.value );
							break;
						case 'dispatch':
							this.eventFld.text( evt.value );
							break;
					}
					return;
				}
				this.actionlist.index( 0 );
				this.actionlist.$node().trigger( 'change' );
				this.showCtrls();
			},
			update : function() {
				this.updateCtrls();
			}
		},
		statics : {
			create : function() {
				var ns = 'display.button';
				types.serialiser.parse( ns + '.props', props, types.controls.properties.getInstance() );
			}
		}
	} );
	
} )(jQuery,this);
