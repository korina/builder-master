( function( $ ) {
	
	$().fluxui.initialise( { debug : true } );

	var propertyFrames = {
		keys: [ 'stage-props', 'container-props', 'image-props', 'label-props' ],
		hash: {
			'stage-props': {
				type: 'element',
				initial: {
					props: {
						fill: {
							type: 'linear',
							direction: 'top',
							colors: [
								{
									rgb: '#cccccc',
									opacity: 1,
									pos: 0
								},
								{
									rgb: '#cccccc',
									opacity: 1,
									pos: 0.63
								},
								{
									rgb: '#000000',
									opacity: 1,
									pos: 0.635
								},
								{
									rgb: '#cccccc',
									opacity: 1,
									pos: 0.64
								}
							]
						},
						position: 'relative',
						width: 300,
						height: 100,
						overflow: 'hidden'
					}
				},
				children: {
					keys: [ 'width', 'width-label', 'height', 'height-label', 'stage-color-picker', 'stage-color-label', 'transparent', 'transparent-label', 'id', 'id-label', 'class', 'class-label' ],
					hash: {
						width: {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 10,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.stage.width.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.stage.width'
								}
							}
						},
						'width-label': {
							type: 'label',
							initial: {
								props: {
									left: 70,
									top: 10,
									width: 20
								},
								attr: {
									text: 'w'
								}
							}
						},
						height: {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 40,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.stage.height.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.stage.height'
								}
							}
						},
						'height-label': {
							type: 'label',
							initial: {
								props: {
									left: 70,
									top: 40,
									width: 20
								},
								attr: {
									text: 'h'
								}
							}
						},
						'stage-color-picker': {
							type: 'colorpicker',
							initial: {
								props: {
									left: 100,
									top: 8
								},
								attr: {
									allowGradient: true
								}
							},
							bind: {
								color: {
									event: 'events.stage.color.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.stage.color'
								},
								click: {
									event: 'color.request'
								}
							}
						},
						'stage-color-label': {
							type: 'label',
							initial: {
								props: {
									left: 130,
									top: 10,
									width: 100
								},
								attr: {
									text: 'bgcolor'
								}
							}
						},
						'transparent': {
							type: 'checkbox',
							initial: {
								props: {
									left: 104,
									top: 40
								},
								attr: {
									checked: true
								}
							},
							bind: {
								text: {
									event: 'events.stage.transparent.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.stage.transparent'
								}
							}
						},
						'transparent-label': {
							type: 'label',
							initial: {
								props: {
									left: 130,
									top: 40
								},
								attr: {
									text: 'transparent'
								}
							}
						},
						'id': {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 70,
									width: 80
								}
							},
							bind: {
								text: {
									event: 'events.stage.id.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.stage.id'
								}
							}
						},
						'id-label': {
							type: 'label',
							initial: {
								props: {
									left: 100,
									top: 70,
									width: 20
								},
								attr: {
									text: 'id'
								}
							}
						},
						'class': {
							type: 'textfield',
							initial: {
								props: {
									left: 130,
									top: 70,
									width: 80
								}
							},
							bind: {
								text: {
									event: 'events.stage.class.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.stage.class'
								}
							}
						},
						'class-label': {
							type: 'label',
							initial: {
								props: {
									left: 220,
									top: 70,
									width: 40
								},
								attr: {
									text: 'class'
								}
							}
						}
					}
				}
			},
			'container-props': {
				type: 'element',
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
									pos: 0.38
								},
								{
									rgb: '#000000',
									opacity: 1,
									pos: 0.385
								},
								{
									rgb: '#d6d6d6',
									opacity: 1,
									pos: 0.39
								},
								{
									rgb: '#d6d6d6',
									opacity: 1,
									pos: 0.77
								},
								{
									rgb: '#000000',
									opacity: 1,
									pos: 0.775
								},
								{
									rgb: '#d6d6d6',
									opacity: 1,
									pos: 0.78
								}
							]
						},
						position: 'relative',
						width: 300,
						height: 160
					}
				},
				children: {
					keys: [ 'x', 'x-label', 'y', 'y-label', 'width', 'width-label', 'height', 'height-label', 'bgcolor', 'bgcolor-label', 'border-width', 'border-width-label', 'border-color', 'border-color-label', 'border-radius', 'border-radius-label', 'id', 'id-label', 'class', 'class-label' ],
					hash: {
						x: {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 10,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.x.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.x'
								}
							}
						},
						'x-label': {
							type: 'label',
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
						y: {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 40,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.y.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.y'
								}
							}
						},
						'y-label': {
							type: 'label',
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
							type: 'textfield',
							initial: {
								props: {
									left: 100,
									top: 10,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.width.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.width'
								}
							}
						},
						'width-label': {
							type: 'label',
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
							type: 'textfield',
							initial: {
								props: {
									left: 100,
									top: 40,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.height.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.height'
								}
							}
						},
						'height-label': {
							type: 'label',
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
						'bgcolor': {
							type: 'colorpicker',
							initial: {
								props: {
									left: 190,
									top: 8
								},
								attr: {
									allowGradient: true
								}
							},
							bind: {
								color: {
									event: 'events.element.bgcolor.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.bgcolor'
								},
								click: {
									event: 'color.request'
								}
							}
						},
						'bgcolor-label': {
							type: 'label',
							initial: {
								props: {
									left: 220,
									top: 10
								},
								attr: {
									text: 'bgcolor'
								}
							}
						},
						'border-color': {
							type: 'colorpicker',
							initial: {
								props: {
									left: 100,
									top: 68
								}
							},
							bind: {
								color: {
									event: 'events.element.border-color.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.border-color'
								},
								click: {
									event: 'color.request'
								}
							}
						},
						'border-color-label': {
							type: 'label',
							initial: {
								props: {
									left: 130,
									top: 70
								},
								attr: {
									text: 'border color'	
								}
							}
						},
						'border-width': {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 70,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.border-width.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.border-width'
								}
							}
						},
						'border-width-label': {
							type: 'label',
							initial: {
								props: {
									left: 70,
									top: 70
								},
								attr: {
									text: 'border weight'
								}
							}
						},
						'border-color': {
							type: 'colorpicker',
							initial: {
								props: {
									left: 160,
									top: 68
								}
							},
							bind: {
								color: {
									event: 'events.element.border-color.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.border-color'
								},
								click: {
									event: 'color.request'
								}
							}
						},
						'border-color-label': {
							type: 'label',
							initial: {
								props: {
									left: 190,
									top: 70
								},
								attr: {
									text: 'border color'
								}
							}
						},
						'border-radius': {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 100,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.border-radius.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.border-radius'
								}
							}
						},
						'border-radius-label': {
							type: 'label',
							initial: {
								props: {
									left: 70,
									top: 100
								},
								attr: {
									text: 'border radius'
								}
							}
						},
						'id': {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 130,
									width: 80
								}
							},
							bind: {
								text: {
									event: 'events.element.id.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.id'
								}
							}
						},
						'id-label': {
							type: 'label',
							initial: {
								props: {
									left: 100,
									top: 130,
									width: 20
								},
								attr: {
									text: 'id'
								}
							}
						},
						'class': {
							type: 'textfield',
							initial: {
								props: {
									left: 130,
									top: 130,
									width: 80
								}
							},
							bind: {
								text: {
									event: 'events.element.class.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.class'
								}
							}
						},
						'class-label': {
							type: 'label',
							initial: {
								props: {
									left: 220,
									top: 130,
									width: 40
								},
								attr: {
									text: 'class'
								}
							}
						}
					}
				}
			},
			'image-props': {
				type: 'element',
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
									pos: 0.33
								},
								{
									rgb: '#000000',
									opacity: 1,
									pos: 0.33
								},
								{
									rgb: '#d6d6d6',
									opacity: 1,
									pos: 0.335
								},
								{
									rgb: '#d6d6d6',
									opacity: 1,
									pos: 0.81
								},
								{
									rgb: '#000000',
									opacity: 1,
									pos: 0.81
								},
								{
									rgb: '#d6d6d6',
									opacity: 1,
									pos: 0.815
								}

							]
						},
						position: 'relative',
						width: 300,
						height: 190
					}
				},
				children: {
					keys: [ 'x', 'x-label', 'y', 'y-label', 'width', 'width-label', 'height', 'height-label', 'reset-asset', 'reset-asset-label', 'border-width', 'border-width-label', 'border-color', 'border-color-label', 'border-radius', 'border-radius-label', 'asset-source-label', 'asset-source', 'placeholder-asset-label', 'placeholder-asset', 'id', 'id-label', 'class', 'class-label' ],
					hash: {
						x: {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 10,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.x.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.x'
								}
							}
						},
						'x-label': {
							type: 'label',
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
						y: {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 40,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.y.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.y'
								}
							}
						},
						'y-label': {
							type: 'label',
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
							type: 'textfield',
							initial: {
								props: {
									left: 100,
									top: 10,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.width.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.width'
								}
							}
						},
						'width-label': {
							type: 'label',
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
							type: 'textfield',
							initial: {
								props: {
									left: 100,
									top: 40,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.height.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.height'
								}
							}
						},
						'height-label': {
							type: 'label',
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
						'placeholder-asset': {
							type: 'image',
							initial: {
								props: {
									left: 190,
									top: 10,
									width: 16,
									cursor: 'pointer'
								},
								attr: {
									src: 'btn-placeholder-asset'
								}
							},
							behavior: {
								click: {
									event: 'properties.element.placeholder'
								}
							}
						},
						'placeholder-asset-label': {
							type: 'label',
							initial: {
								props: {
									left: 210,
									top: 10,
									width: 70
								},
								attr: {
									text: 'placeholder'
								}
							}
						},
						'reset-asset': {
							type: 'image',
							initial: {
								props: {
									left: 190,
									top: 40,
									width: 16,
									cursor: 'pointer'
								},
								attr: {
									src: 'btn-reset-asset'
								}
							},
							behavior: {
								click: {
									event: 'properties.element.reset-asset'
								}
							}
						},
						'reset-asset-label': {
							type: 'label',
							initial: {
								props: {
									left: 210,
									top: 40,
									width: 60
								},
								attr: {
									text: 'reset size'
								}
							}
						},
						'border-color': {
							type: 'colorpicker',
							initial: {
								props: {
									left: 100,
									top: 68
								}
							},
							bind: {
								color: {
									event: 'events.element.border-color.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.border-color'
								},
								click: {
									event: 'color.request'
								}
							}
						},
						'border-color-label': {
							type: 'label',
							initial: {
								props: {
									left: 130,
									top: 70
								},
								attr: {
									text: 'border color'
								}
							}
						},
						'border-width': {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 70,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.border-width.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.border-width'
								}
							}
						},
						'border-width-label': {
							type: 'label',
							initial: {
								props: {
									left: 70,
									top: 70
								},
								attr: {
									text: 'border weight'
								}
							}
						},
						'border-color': {
							type: 'colorpicker',
							initial: {
								props: {
									left: 160,
									top: 68
								}
							},
							bind: {
								color: {
									event: 'events.element.border-color.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.border-color'
								},
								click: {
									event: 'color.request'
								}
							}
						},
						'border-color-label': {
							type: 'label',
							initial: {
								props: {
									left: 190,
									top: 70
								},
								attr: {
									text: 'border color'
								}
							}
						},
						'border-radius': {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 100,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.border-radius.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.border-radius'
								}
							}
						},
						'border-radius-label': {
							type: 'label',
							initial: {
								props: {
									left: 70,
									top: 100
								},
								attr: {
									text: 'border radius'
								}
							}
						},
						'asset-source-label': {
							type: 'label',
							initial: {
								props: {
									left: 220,
									top: 130,
									width: 60
								},
								attr: {
									text: 'source'
								}
							}
						},
						'asset-source': {
							type: 'dropdown',
							initial: {
								props: {
									left: 10,
									top: 130,
									width: 200
								}
							},
							bind: {
								text: {
									event: 'events.element.source.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.source'
								}
							}
						},
						'id': {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 160,
									width: 80
								}
							},
							bind: {
								text: {
									event: 'events.element.id.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.id'
								}
							}
						},
						'id-label': {
							type: 'label',
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
							type: 'textfield',
							initial: {
								props: {
									left: 130,
									top: 160,
									width: 80
								}
							},
							bind: {
								text: {
									event: 'events.element.class.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.class'
								}
							}
						},
						'class-label': {
							type: 'label',
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
						}
					}
				}
			},
			'label-props': {
				type: 'element',
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
									pos: 0.355
								},
								{
									rgb: '#000000',
									opacity: 1,
									pos: 0.358
								},
								{
									rgb: '#d6d6d6',
									opacity: 1,
									pos: 0.361
								}

							]
						},
						position: 'relative',
						width: 300,
						height: 260
					}
				},
				children: {
					keys: [ 'x', 'x-label', 'y', 'y-label', 'width', 'width-label', 'height', 'height-label', 'color', 'color-label', 'id', 'id-label', 'class', 'class-label', 'text-content', 'text-content-label', 'font-family', 'font-family-label', 'align', 'align-label', 'decoration', 'decoration-label', 'font-size', 'font-size-label', 'weight', 'weight-label' ],
					hash: {
						x: {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 10,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.x.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.x'
								}
							}
						},
						'x-label': {
							type: 'label',
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
						y: {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 40,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.y.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.y'
								}
							}
						},
						'y-label': {
							type: 'label',
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
							type: 'textfield',
							initial: {
								props: {
									left: 100,
									top: 10,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.width.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.width'
								}
							}
						},
						'width-label': {
							type: 'label',
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
							type: 'textfield',
							initial: {
								props: {
									left: 100,
									top: 40,
									width: 50
								}
							},
							bind: {
								text: {
									event: 'events.element.height.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.height'
								}
							}
						},
						'height-label': {
							type: 'label',
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
						'color': {
							type: 'colorpicker',
							initial: {
								props: {
									left: 190,
									top: 8
								},
								attr: {
									allowGradient: true
								}
							},
							bind: {
								color: {
									event: 'events.element.color.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.color'
								},
								click: {
									event: 'color.request'
								}
							}
						},
						'color-label': {
							type: 'label',
							initial: {
								props: {
									left: 220,
									top: 10
								},
								attr: {
									text: 'color'
								}
							}
						},
						'id': {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 70,
									width: 80
								}
							},
							bind: {
								text: {
									event: 'events.element.id.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.id'
								}
							}
						},
						'id-label': {
							type: 'label',
							initial: {
								props: {
									left: 100,
									top: 70,
									width: 20
								},
								attr: {
									text: 'id'	
								}
							}
						},
						'class': {
							type: 'textfield',
							initial: {
								props: {
									left: 130,
									top: 70,
									width: 80
								}
							},
							bind: {
								text: {
									event: 'events.element.class.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.class'
								}
							}
						},
						'class-label': {
							type: 'label',
							initial: {
								props: {
									left: 220,
									top: 70,
									width: 40
								},
								attr: {
									text: 'class'
								}
							}
						},
						'text-content': {
							type: 'textarea',
							initial: {
								props: {
									left: 10,
									top: 100,
									width: 200,
									height: 55
								}
							},
							bind: {
								text: {
									event: 'events.element.textcontent.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.textcontent'
								}
							}
						},
						'text-content-label': {
							type: 'label',
							initial: {
								props: {
									left: 220,
									top: 100,
									width: 40
								},
								attr: {
									text: 'html content'
								}
							}
						},
						'font-family': {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 130,
									width: 80
								},
								attr: {
									text: 'Arial'
								}
							},
							bind: {
								text: {
									event: 'events.element.font-family.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.font-family'
								}
							}
						},
						'font-family-label': {
							type: 'label',
							initial: {
								props: {
									left: 100,
									top: 130
								},
								attr: {
									text: 'face'
								}
							}
						},
						'font-size': {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 160,
									width: 50
								},
								attr: {
									text: '12'
								}
							},
							bind: {
								text: {
									event: 'events.element.font-size.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.font-size'
								}
							}
						},
						'font-size-label': {
							type: 'label',
							initial: {
								props: {
									left: 70,
									top: 160
								},
								attr: {
									text: 'size'
								}
							}
						},
						'font-family' : {
							type : 'dropdown',
							initial : {
								props : {
									left: 10,
									top: 170,
									width: 200
								},
								attr: {
									labels : ['Arial', 'Courier New', 'Georgia', 'Impact', 'Times New Roman', 'Trebuchet MS', 'Verdana'],
									values : ['Arial', 'Courier New', 'Georgia', 'Impact', 'Times New Roman', 'Trebuchet MS', 'Verdana']
								}
							},
							bind : {
								text : {
									event : 'events.element.font-family.changed'
								}
							},
							behavior : {
								change : {
									event : 'properties.element.font-family'
								}
							}
						},
						'font-family-label': {
							type: 'label',
							initial: {
								props: {
									left: 220,
									top: 170
								},
								attr: {
									text: 'typeface'	
								}
							}
						},
						'align' : {
							type : 'dropdown',
							initial : {
								props : {
									left: 10,
									top: 200,
									width: 65
								},
								attr: {
									labels : ['Left', 'Right', 'Center', 'Justify'],
									values : ['left', 'right', 'center', 'justify']
								}
							},
							bind : {
								text : {
									event : 'events.element.align.changed'
								}
							},
							behavior : {
								change : {
									event : 'properties.element.align'
								}
							}
						},
						'align-label': {
							type: 'label',
							initial: {
								props: {
									left: 85,
									top: 200
								},
								attr: {
									text: 'align'
								}
							}
						},
						'decoration' : {
							type : 'dropdown',
							initial : {
								props : {
									left: 125,
									top: 200,
									width: 100
								},
								attr: {
									labels : ['None', 'Underline', 'Overline', 'Line-through', 'Blink'],
									values : ['none', 'underline', 'overline', 'line-through', 'blink']
								}
							},
							bind : {
								text : {
									event : 'events.element.decoration.changed'
								}
							},
							behavior : {
								change : {
									event : 'properties.element.decoration'
								}
							}
						},
						'decoration-label': {
							type: 'label',
							initial: {
								props: {
									left: 235,
									top: 200
								},
								attr: {
									text: 'decorate'
								}
							}
						},
						'font-size': {
							type: 'textfield',
							initial: {
								props: {
									left: 10,
									top: 230,
									width: 50
								},
								attr: {
									text: '12'
								}
							},
							bind: {
								text: {
									event: 'events.element.font-size.changed'
								}
							},
							behavior: {
								change: {
									event: 'properties.element.font-size'
								}
							}
						},
						'font-size-label': {
							type: 'label',
							initial: {
								props: {
									left: 70,
									top: 230
								},
								attr: {
									text: 'font-size'
								}
							}
						},
						'weight' : {
							type : 'dropdown',
							initial : {
								props : {
									left: 125,
									top: 230,
									width: 100
								},
								attr: {
									labels : ['Normal', 'Bold'],
									values : ['normal', 'bold']
								}
							},
							bind : {
								text : {
									event : 'events.element.weight.changed'
								}
							},
							behavior : {
								change : {
									event : 'properties.element.weight'
								}
							}
						},
						'weight-label': {
							type: 'label',
							initial: {
								props: {
									left: 235,
									top: 230
								},
								attr: {
									text: 'weight'
								}
							}
						}
					}
				}
			}
		}
	};

	var colorPanel = {
		keys: [ 'color-panel' ],
		hash: {
			'color-panel': {
				type: 'gradientpicker',
				initial: {
					props: {
						position: 'relative',
						width: 300,
						height: 120
					}
				},
				children: {
					keys: [ 'color-type-lbl', 'color-type', 'color-angle-lbl', 'color-angle', 'color-viewer', 'swatch-panel' ],
					hash: {
						'color-type-lbl': {
							type: 'label',
							initial: {
								props: {
									left: 10,
									top: 10,
									width: 40
								},
								attr: {
									text: 'type:'
								}
							}
						},
						'color-type': {
							type: 'dropdown',
							initial: {
								props: {
									left: 45,
									top: 10
								},
								attr: {
									labels: [ 'solid', 'linear', 'radial' ],
									values: [ 'solid', 'linear', 'radial' ]
								}
							}
						},
						'color-angle-lbl': {
							type: 'label',
							initial: {
								props: {
									left: 120,
									top: 10,
									width: 40
								},
								attr: {
									text: 'angle:'
								}
							}
						},
						'color-angle': {
							type: 'dropdown',
							initial: {
								props: {
									left: 160,
									top: 10
								},
								attr: {
									labels: [ 'left', 'top left', 'top', 'top right', 'right', 'bottom right', 'bottom', 'bottom left' ],
									values: [ '0deg', '315deg', '270deg', '225deg', '180deg', '135deg', '90deg', '45deg' ]
								}
							}
						},
						'color-viewer': {
							type: 'element',
							initial: {
								props: {
									left: 10,
									top: 40,
									width: 270,
									height: 40
								}
							}
						},
						'swatch-panel': {
							type: 'element',
							initial: {
								props: {
									fill: {
										type: 'linear',
										colors: [
											{
												rgb: '#999999',
												pos: 0
											},
											{
												rgb: '#cccccc',
												pos: 0.4
											},
											{
												rgb: '#cccccc',
												pos: 0.6
											},
											{
												rgb: '#999999',
												pos: 1
											}
										]
									},
									left: 10,
									top: 80,
									width: 270,
									height: 10
								}
							}
						}
					}
				}
			}
		}
	};

	alignmentPanel = {
		keys: [ 'align-panel' ],
		hash: {
			'align-panel': {
				type: 'element',
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
									pos: 0.423
								},
								{
									rgb: '#000000',
									opacity: 1,
									pos: 0.425
								},
								{
									rgb: '#d6d6d6',
									opacity: 1,
									pos: 0.427
								}
							]
						},
						position: 'relative',
						width: 300,
						height: 275
					}
				},
				children: {
					keys: [ 'realtime-label', 'box', 'type', 'top', 'right', 'bottom', 'left', 'align-label', 'align-left', 'align-center-x', 'align-right', 'align-top', 'align-center-y', 'align-bottom', 'distribute-label', 'distribute-left', 'distribute-center-x', 'distribute-right', 'distribute-top', 'distribute-center-y', 'distribute-bottom', 'match-label', 'match-width', 'match-height', 'match-both', 'space-label', 'space-x', 'space-y' ],
					hash: {
						'realtime-label': {
							type: 'label',
							initial: {
								props: {
									left: 10,
									top: 10
								},
								attr: {
									text: 'Realtime:'
								}
							}
						},
						box: {
							type: 'element',
							initial: {
								props: {
									top: 40,
									left: 15,
									width: 120,
									height: 60,
									'border-style': 'solid',
									'border-color': '#333333',
									'border-width': 1
								},
								attr: {
									text: 'Realtime:'
								}
							}
						},
						type: {
							type: 'dropdown',
							initial: {
								props: {
									top: 60,
									left: 30
								},
								attr: {
									labels: [ 'none', 'anchoring', 'center x', 'center y', 'center both' ],
									values: [ 'none', 'anchor', 'horz', 'vert', 'both' ]
								}
							}
						},
						top: {
							type: 'checkbox',
							initial: {
								props: {
									left: 70,
									top: 33
								}
							}
						},
						right: {
							type: 'checkbox',
							initial: {
								props: {
									left: 130,
									top: 63
								}
							}
						},
						bottom: {
							type: 'checkbox',
							initial: {
								props: {
									left: 70,
									top: 95
								}
							}
						},
						left: {
							type: 'checkbox',
							initial: {
								props: {
									left: 8,
									top: 63
								}
							}
						},
						'align-label': {
							type: 'label',
							initial: {
								props: {
									top: 125,
									left: 10
								},
								attr: {
									text: 'Align:'
								}
							}
						},
						'align-left': {
							type: 'button',
							initial: {
								props: {
									top: 145,
									left: 10,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.align.left'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'align-left-img'
											}
										}
									}
								}
							}
						},
						'align-center-x': {
							type: 'button',
							initial: {
								props: {
									top: 145,
									left: 40,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.align.center.x'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'align-center-x-img'
											}
										}
									}
								}
							}
						},
						'align-right': {
							type: 'button',
							initial: {
								props: {
									top: 145,
									left: 70,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.align.right'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'align-right-img'
											}
										}
									}
								}
							}
						},
						'align-top': {
							type: 'button',
							initial: {
								props: {
									top: 145,
									left: 120,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.align.top'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'align-top-img'
											}
										}
									}
								}
							}
						},
						'align-center-y': {
							type: 'button',
							initial: {
								props: {
									top: 145,
									left: 150,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.align.center.y'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'align-center-y-img'
											}
										}
									}
								}
							}
						},
						'align-bottom': {
							type: 'button',
							initial: {
								props: {
									top: 145,
									left: 180,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.align.bottom'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'align-bottom-img'
											}
										}
									}
								}
							}
						},
						'distribute-label': {
							type: 'label',
							initial: {
								props: {
									top: 175,
									left: 10
								},
								attr: {
									text: 'Distribute:'
								}
							}
						},
						'distribute-left': {
							type: 'button',
							initial: {
								props: {
									top: 195,
									left: 10,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.distribute.left'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'distribute-left-img'
											}
										}
									}
								}
							}
						},
						'distribute-center-x': {
							type: 'button',
							initial: {
								props: {
									top: 195,
									left: 40,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.distribute.center.x'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'distribute-center-x-img'
											}
										}
									}
								}
							}
						},
						'distribute-right': {
							type: 'button',
							initial: {
								props: {
									top: 195,
									left: 70,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.distribute.right'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'distribute-right-img'
											}
										}
									}
								}
							}
						},
						'distribute-top': {
							type: 'button',
							initial: {
								props: {
									top: 195,
									left: 120,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.distribute.top'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'distribute-top-img'
											}
										}
									}
								}
							}
						},
						'distribute-center-y': {
							type: 'button',
							initial: {
								props: {
									top: 195,
									left: 150,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.distribute.center.y'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'distribute-center-y-img'
											}
										}
									}
								}
							}
						},
						'distribute-bottom': {
							type: 'button',
							initial: {
								props: {
									top: 195,
									left: 180,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.distribute.bottom'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'distribute-bottom-img'
											}
										}
									}
								}
							}
						},
						'match-label': {
							type: 'label',
							initial: {
								props: {
									top: 225,
									left: 10
								},
								attr: {
									text: 'Match size:'
								}
							}
						},
						'match-width': {
							type: 'button',
							initial: {
								props: {
									top: 245,
									left: 10,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.match.width'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'match-width-img'
											}
										}
									}
								}
							}
						},
						'match-height': {
							type: 'button',
							initial: {
								props: {
									top: 245,
									left: 40,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.match.height'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'match-height-img'
											}
										}
									}
								}
							}
						},
						'match-both': {
							type: 'button',
							initial: {
								props: {
									top: 245,
									left: 70,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.match.both'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'match-both-img'
											}
										}
									}
								}
							}
						},
						'space-label': {
							type: 'label',
							initial: {
								props: {
									top: 225,
									left: 120
								},
								attr: {
									text: 'Space:'
								}
							}
						},
						'space-x': {
							type: 'button',
							initial: {
								props: {
									top: 245,
									left: 120,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.space.x'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'space-x-img'
											}
										}
									}
								}
							}
						},
						'space-y': {
							type: 'button',
							initial: {
								props: {
									top: 245,
									left: 150,
									width: 19,
									height: 19
								}
							},
							behavior: {
								click: {
									event: 'properties.space.y'
								}
							},
							children: {
								keys: [ 'img' ],
								hash: {
									img: {
										type: 'image',
										initial: {
											attr: {
												src: 'space-y-img'
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};

	var libraryPanel = {
		keys: [ 'library-panel' ],
		hash: {
			'library-panel': {
				type: 'library',
				initial: {
					props: {
						position: 'relative',
						width: 300,
						height: 400
					}
				},
				children: {
					keys: ['icon-bar', 'asset-viewer', 'asset-list-container'],
					hash: {
						'icon-bar': {
							type: 'element',
							initial: {
								props: {
									fill: {
										type: 'solid',
										colors: [
											{
												rgb: '#bbbbbb',
												opacity: 1
											}
										]
									},
									width: 300,
									height: 26
								}
							},
							children: {
								keys: ['add-asset'],
								hash: {
									'add-asset': {
										type: 'image',
										initial: {
											props: {
												right: 25,
												left: '',
												top: 5,
												width: 16,
												height: 16,
												cursor: 'pointer'
											},
											attr: {
												src: 'btn-add-asset'
											}
										},
										behavior: {
											click: {
												event: 'properties.library.add'
											}
										}
									}
								}
							}
						},
						'asset-viewer': {
							type: 'element',
							initial: {
								props: {
									fill: {
										type: 'solid',
										colors: [
											{
												rgb: '#ffffff',
												opacity: 1
											}
										]
									},
									top: 26,
									width: 300,
									height: 150
								}
							},
							children: {
								keys: [ 'preview' ],
								hash: {
									preview: {
										type: 'image',
										initial: {
											props: {
												'max-width': 300,
												'max-height': 150
											},
											attr: {
												center: 'both',
												src: 'white-pixel'
											}
										}
									}
								}
							}
						},
						'asset-list-container': {
							type: 'element',
							initial: {
								props: {
									top: 180,
									width: 300,
									height: 274,
									overflow: 'auto'
								}
							},
							children: {
								keys: ['asset-list'],
								hash: {
									'asset-list': {
										type: 'element',
										initial: {
											props: {
												width: 275
											}
										}
									}
								}
							}
						}
					}
				},
				data: {
					keys: [ 'asset-button' ],
					hash: {
						'asset-button': {
							type: 'libitem',
							initial: {
								props: {
									position: 'relative',
									width: 275,
									height: 26
								}
							},
							behavior: {
								click: {
									event: 'properties.library.item.click'
								}
							},
							children: {
								keys: ['asset-label', 'asset-btn'],
								hash: {
									'asset-label': {
										type: 'label',
										initial: {
											props: {
												top: 5,
												left: 5,
												width: 200,
												height: 16
											},
											attr: {
												text: 'this is the label'
											}
										}
									},
									'asset-btn': {
										type: 'image',
										initial: {
											props: {
												right: 5,
												left: '',
												top: 5,
												width: 16,
												height: 16,
												cursor: 'pointer'
											},
											attr: {
												src: 'btn-remove-asset'
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};

	var componentPanel = {
		keys: [ 'component-panel' ],
		hash: {
			'component-panel': {
				type: 'components',
				initial: {
					props: {
						position: 'relative',
						width: 300,
						height: 450
					}
				},
				children: {
					keys: ['component-viewer', 'component-list-container'],
					hash: {
						'component-viewer': {
							type: 'element',
							initial: {
								props: {
									fill: {
										type: 'solid',
										colors: [
											{
												rgb: '#ffffff',
												opacity: 1
											}
										]
									},
									top: 0,
									width: 300,
									height: 150
								}
							},
							children: {
								keys: [ 'preview' ],
								hash: {
									preview: {
										type: 'image',
										initial: {
											props: {
												'max-width': 300,
												'max-height': 150
											},
											attr: {
												center: 'both',
												src: 'white-pixel'
											}
										}
									}
								}
							}
						},
						'component-list-container': {
							type: 'element',
							initial: {
								props: {
									top: 150,
									width: 300,
									height: 274,
									overflow: 'auto'
								}
							},
							children: {
								keys: ['component-list'],
								hash: {
									'component-list': {
										type: 'element',
										initial: {
											props: {
												width: 275
											}
										}
									}
								}
							}
						}
					}
				},
				data: {
					keys: [ 'component-button' ],
					hash: {
						'component-button': {
							type: 'componentitem',
							initial: {
								props: {
									position: 'relative',
									width: 275,
									height: 26,
									cursor: 'pointer'
								}
							},
							behavior: {
								click: {
									event: 'properties.component.item.click'
								},
								dblclick: {
									event: 'properties.component.item.dblclick'
								}
							},
							children: {
								keys: ['component-label', 'component-icon'],
								hash: {
									'component-label': {
										type: 'label',
										initial: {
											props: {
												top: 5,
												left: 45,
												width: 200,
												height: 16
											},
											attr: {
												text: 'this is the label'
											}
										}
									},
									'component-icon': {
										type: 'image',
										initial: {
											props: {
												top: 5,
												left: 5
											},
											attr: {
												src: 'white-pixel'
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};

	var editor =  {
		assets : {
			'align-left-img': {
				url: 'assets/align-left.gif'
			},
			'align-center-x-img': {
				url: 'assets/align-center-x.gif'
			},
			'align-right-img': {
				url: 'assets/align-right.gif'
			},
			'align-top-img': {
				url: 'assets/align-top.gif'
			},
			'align-center-y-img': {
				url: 'assets/align-center-y.gif'
			},
			'align-bottom-img': {
				url: 'assets/align-bottom.gif'
			},
			'distribute-left-img': {
				url: 'assets/distribute-left.gif'
			},
			'distribute-center-x-img': {
				url: 'assets/distribute-center-x.gif'
			},
			'distribute-right-img': {
				url: 'assets/distribute-right.gif'
			},
			'distribute-top-img': {
				url: 'assets/distribute-top.gif'
			},
			'distribute-center-y-img': {
				url: 'assets/distribute-center-y.gif'
			},
			'distribute-bottom-img': {
				url: 'assets/distribute-bottom.gif'
			},
			'match-width-img': {
				url: 'assets/match-width.gif'
			},
			'match-height-img': {
				url: 'assets/match-height.gif'
			},
			'match-both-img': {
				url: 'assets/match-both.gif'
			},
			'space-x-img': {
				url: 'assets/space-x.gif'
			},
			'space-y-img': {
				url: 'assets/space-y.gif'
			},
			'accordion-btn': {
				url: 'assets/accordion-btn.gif'
			},
			'accordion-btn-selected': {
				url: 'assets/accordion-btn-selected.gif'
			},
			'accordion-right-arrow': {
				url: 'assets/accordion-right-arrow.gif'
			},
			'accordion-down-arrow': {
				url: 'assets/accordion-down-arrow.gif'
			},
			'placeholder': {
				url: 'assets/spacer.gif'
			},
			'ico-properties': {
				url: 'assets/ico-properties.png'
			},
			'ico-palette': {
				url: 'assets/ico-palette.png'
			},
			'ico-align': {
				url: 'assets/ico-align.png'
			},
			'ico-library': {
				url: 'assets/ico-library.png'
			},
			'ico-components': {
				url: 'assets/ico-components.png'
			},
			'logo': {
				url: 'assets/logo.gif'
			},
			'btn-div': {
				url: 'assets/btn-div.png'
			},
			'btn-img': {
				url: 'assets/btn-img.png'
			},
			'btn-lbl': {
				url: 'assets/btn-lbl.png'
			},
			'btn-add-asset': {
				url: 'assets/btn-add-asset.png'
			},
			'btn-remove-asset': {
				url: 'assets/btn-remove-asset.png'
			},
			'btn-reset-asset': {
				url: 'assets/btn-reset-asset.png'
			},
			'btn-placeholder-asset': {
				url: 'assets/btn-placeholder-asset.png'
			},
			'alpha-bg': {
				url: 'assets/alpha-bg.png'
			},
			'white-pixel': {
				url: 'assets/white-pixel.png'
			}
		},
		library: {

		},
		movie: {
			type: 'element',
			initial: {
				props: {
					width: 520,
					height: 468,
					fill: {
						type: 'solid',
						colors: [
							{
								rgb: '#000000',
								opacity: 1
							}
						]
					}
				},
				attr: {
					anchor: [ 1, 1, 1, 1 ]
				}
			},
			children: {
				keys: [ 'header', 'left-sidebar', 'workspace', 'right-sidebar', 'request-dialog' ],
				hash: {
					header: {
						type: 'element',
						initial: {
							props: {
								fill: {
									type: 'solid',
									colors: [
										{
											rgb: '#373737',
											opacity: 1,
											pos: 0
										}
									]
								},
								width: 520,
								height: 68
							},
							attr: {
								anchor: [ 1, 1, 0, 1 ]
							}
						},
						children: {
							keys: [ 'logo', 'menu' ],
							hash: {
								logo: {
									type: 'image',
									initial: {
										props: {
											left: 20,
											top: 17
										},
										attr: {
											src: 'logo'
										}
									}
								},
								menu: {
									type: 'menu',
									initial: {
										props: {
											top: 25,
											left: '',
											right: 80,
											width: 270,
											height: 20
										}
									},
									children: {
										keys: [ 'login-menu', 'app-menu' ],
										hash: {
											'login-menu': {
												type: 'element',
												initial: {
													props: {
														width: 270,
														height: 20
													}
												},
												children: {
													keys: [ 'user-txt', 'pass-txt', 'login-btn', 'register' ],
													hash: {
														'user-txt': {
															type: 'textfield',
															initial: {
																props: {
																	width: 70
																}
															}
														},
														'pass-txt': {
															type: 'textfield',
															initial: {
																props: {
																	left: 80,
																	width: 70
																},
																attr: {
																	text: 'password'
																}
															}
														},
														'login-btn': {
															type: 'button',
															initial: {
																props: {
																	left: 160,
																	width: 40,
																	height: 18,
																	'border-color': '#999999',
																	'border-width': 1
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.login'
																}
															},
															children: {
																keys: [ 'login-label' ],
																hash: {
																	'login-label': {
																		type: 'label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				left: 4,
																				width: 40,
																				height: 18
																			},
																			attr: {
																				text: 'Login'
																			}
																		}
																	}
																}
															}
														},
														'register': {
															type: 'button',
															initial: {
																props: {
																	left: 210,
																	width: 58,
																	height: 18,
																	'border-color': '#999999',
																	'border-width': 1
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.register'
																}
															},
															children: {
																keys: [ 'register-label' ],
																hash: {
																	'register-label': {
																		type: 'label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				left: 4,
																				width: 60,
																				height: 20
																			},
																			attr: {
																				text: 'Register'
																			}
																		}
																	}
																}
															}
														}
													}
												}
											},
											'app-menu': {
												type: 'element',
												initial: {
													props: {
														left: 70,
														width: 200,
														height: 20,
														visibility: 'hidden'
													}
												},
												children: {
													keys: [ 'embed-btn', 'new-btn', 'open-btn', 'save-btn' ],
													hash: {
														'embed-btn': {
															type: 'button',
															initial: {
																props: {
																	width: 40,
																	height: 20
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.embed'
																}
															},
															children: {
																keys: [ 'embed-label' ],
																hash: {
																	'embed-label': {
																		type: 'label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				width: 40,
																				height: 20
																			},
																			attr: {
																				text: 'Embed'
																			}
																		}
																	}
																}
															}
														},
														'new-btn': {
															type: 'button',
															initial: {
																props: {
																	width: 40,
																	height: 20,
																	left: 60
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.new'
																}
															},
															children: {
																keys: [ 'new-label' ],
																hash: {
																	'new-label': {
																		type: 'label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				width: 40,
																				height: 20
																			},
																			attr: {
																				text: 'New'
																			}
																		}
																	}
																}
															}
														},
														'open-btn': {
															type: 'button',
															initial: {
																props: {
																	width: 40,
																	height: 20,
																	left: 110
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.open'
																}
															},
															children: {
																keys: [ 'open-label' ],
																hash: {
																	'open-label': {
																		type: 'label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				width: 40,
																				height: 20
																			},
																			attr: {
																				text: 'Open'
																			}
																		}
																	}
																}
															}
														},
														'save-btn': {
															type: 'button',
															initial: {
																props: {
																	width: 40,
																	height: 20,
																	left: 160
																}
															},
															behavior: {
																click: {
																	event: 'menu.click.save'
																}
															},
															children: {
																keys: [ 'save-label' ],
																hash: {
																	'save-label': {
																		type: 'label',
																		initial: {
																			props: {
																				color: '#ffffff',
																				'font-size': 12,
																				'font-family': 'arial',
																				'font-weight': 'bold',
																				width: 40,
																				height: 20
																			},
																			attr: {
																				text: 'Save'
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					},
					'left-sidebar': {
						type: 'element',
						initial: {
							props: {
								fill: {
									type: 'solid',
									colors: [
										{
											rgb: '#373737',
											opacity: 1
										}
									]
								},
								top: 68,
								width: 340,
								height: 400
							},
							attr: {
								anchor: [ 1, 0, 1, 1 ]
							}
						},
						children: {
							keys: [ 'panels' ],
							hash: {
								panels: {
									type: 'accordion',
									initial: {
										props: {
											fill: {
												type: 'solid',
												colors: [
													{
														rgb: '#373737',
														opacity: 1
													}
												]
											},
											width: 300,
											height: 400,
											left: 20,
											'overflow-y': 'auto'
										},
										attr: {
											anchor: [ 1, 1, 1, 1 ]
										}
									},
									data: {
										keys: [ 'button' ],
										hash: {
											button: {
												type: 'button',
												initial: {
													props: {
														width: 300,
														height: 36
													}
												},
												frames: {
													keys: [ 'initial', '_over', '_selected' ],
													hash: {
														initial: {},
														_over: {},
														_selected: {}
													}
												},
												children: {
													keys: [ 'background', 'icon', 'label', 'state-icon' ],
													hash: {
														background: {
															type: 'image',
															initial: {
																props: {
																	width: 300,
																	height: 36
																},
																attr: {
																	src: 'accordion-btn'
																}
															},
															states: {
																_over: {
																	attr: {
																		src: 'accordion-btn-selected'
																	}
																},
																_selected: {
																	attr: {
																		src: 'accordion-btn-selected'
																	}
																}
															}
														},
														'icon': {
															type: 'image',
															initial: {
																props: {
																	top: 8,
																	left: 9
																},
																attr: {
																	src: 'placeholder'
																}
															}
														},
														label: {
															type: 'label',
															initial: {
																props: {
																	color: '#ffffff',
																	top: 9,
																	left: 40,
																	'font-size': 13
																},
																attr: {
																	text: 'Button'
																}
															}
														},
														'state-icon': {
															type: 'image',
															initial: {
																props: {
																	width: 8,
																	height: 8,
																	left: 260,
																	top: 14
																},
																attr: {
																	src: 'accordion-right-arrow'
																}
															},
															states: {
																_selected: {
																	attr: {
																		src: 'accordion-down-arrow'
																	}
																}
															}
														}
													}
												}
											}
										}
									},
									children: {
										keys: [ 'acc-property-panel', 'acc-color-panel', 'acc-align-panel', 'acc-library-panel', 'acc-component-panel' ],
										hash: {
											'acc-property-panel': {
												type: 'accordionPanel',
												initial: {
													props: {
														position: 'relative',
														width: 300,
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#d6d6d6',
																	opacity: 1
																}
															]
														}
													},
													attr: {
														id: 'propertiesPanel',
														text: 'Properties',
														icon: 'ico-properties'
													}
												},
												children: propertyFrames
											},
											'acc-color-panel': {
												type: 'accordionPanel',
												initial: {
													props: {
														width: 300,
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#d6d6d6',
																	opacity: 1
																}
															]
														}
													},
													attr: {
														id: 'colorPanel',
														text: 'Color',
														icon: 'ico-palette'
													}
												},
												children: colorPanel
											},
											'acc-align-panel': {
												type: 'accordionPanel',
												initial: {
													props: {
														width: 300,
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#d6d6d6',
																	opacity: 1
																}
															]
														}
													},
													attr: {
														id: 'alignPanel',
														text: 'Alignment',
														icon: 'ico-align'
													}
												},
												children: alignmentPanel
											},
											'acc-library-panel': {
												type: 'accordionPanel',
												initial: {
													props: {
														width: 300,
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#d6d6d6',
																	opacity: 1
																}
															]
														}
													},
													attr: {
														id: 'libraryPanel',
														text: 'Library',
														icon: 'ico-library'
													}
												},
												children: libraryPanel
											},
											'acc-component-panel': {
												type: 'accordionPanel',
												initial: {
													props: {
														width: 300,
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#d6d6d6',
																	opacity: 1
																}
															]
														}
													},
													attr: {
														id: 'componentPanel',
														text: 'Components',
														icon: 'ico-components'
													}
												},
												children: componentPanel
											}
										}
									}
								}
							}
						}
					},
					workspace: {
						type: 'element',
						initial: {
							props: {
								fill: {
									type: 'solid',
									colors: [
										{
											rgb: '#666666',
											opacity: 1
										}
									]
								},
								top: 68,
								left: 340,
								width: 90,
								height: 400,
								'overflow': 'auto'
							},
							attr: {
								anchor: [ 1, 1, 1, 1 ]
							}
						},
						children:{
							keys: [ 'stage-container' ],
							hash: {
								'stage-container': {
									type: 'element',
									initial: {
										props: {
											fill: {
												type: 'solid',
												colors: [
													{
														rgb: '#666666',
														opacity: 1
													}
												]
											},
											'min-height': 2000,
											'min-width': 2000
										}
									},
									children: {
										keys: [ 'stage', 'view', 'hud' ],
										hash: {
											stage: {
												type: 'element',
												initial: {
													props: {
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#FFFFFF',
																	opacity: 1,
																	pos: 0
																}
															]
														},
														width: 400,
														height: 300,
														overflow: 'visible'
													},
													attr: {
														center: 'both'
													}
												}
											},
											view: {
												type: 'view',
												initial: {
													props: {
														fill: {
															type: 'solid',
															colors: [
																{
																	rgb: '#FFFFFF',
																	opacity: 1,
																	pos: 0
																}
															]
														},
														width: 400,
														height: 300,
														overflow: 'visible',
														visibility: 'hidden'
													},
													attr: {
														center: 'both'
													}
												}
											},
											hud: {
												type: 'element',
												initial: {
													props: {
														overflow: 'visible',
														width: 1,
														height: 1
													}
												}
											}
										}
									}
								}
							}
						}
					},
					'right-sidebar': {
						type: 'element',
						initial: {
							props: {
								fill: {
									type: 'solid',
									colors: [
										{
											rgb: '#373737',
											opacity: 1,
											pos: 0
										}
									]
								},
								top: 68,
								left: 430,
								width: 90,
								height: 400
							},
							attr: {
								anchor: [ 1, 1, 1, 0 ]
							}
						},
						children: {
							keys: [ 'btn-div', 'btn-img', 'btn-lbl' ],
							hash: {
								'btn-div': {
									type: 'image',
									initial: {
										props: {
											top: 4,
											left: 16,
											cursor: 'pointer'
										},
										attr: {
											src: 'btn-div'
										}
									},
									behavior: {
										click: {
											event: 'controls.add.div'
										}
									}
								},
								'btn-img': {
									type: 'image',
									initial: {
										props: {
											top: 4,
											left: 50,
											cursor: 'pointer'
										},
										attr: {
											src: 'btn-img'
										}
									},
									behavior: {
										click: {
											event: 'controls.add.img'
										}
									}
								},
								'btn-lbl': {
									type: 'image',
									initial: {
										props: {
											top: 30,
											left: 16,
											cursor: 'pointer'
										},
										attr: {
											src: 'btn-lbl'
										}
									},
									behavior: {
										click: {
											event: 'controls.add.lbl'
										}
									}
								}
							}
						}
					},
					'request-dialog': {
						type: 'dialog',
						initial: {
							props: {
								fill: {
									type: 'solid',
									colors: [
										{
											rgb: '#ffffff',
											opacity: 1
										}
									]
								},
								top: '50%',
								left: '50%',
								'margin-left': -150,
								'margin-top': -100,
								width: 300,
								height: 200,
								'border-width': 1,
								'border-color': '#bbbbbb'
							}
						},
						children: {
							keys: [ 'header-bg', 'header-label', 'dialog-close-btn', 'dialog-content', 'btn-submit' ],
							hash: {
								'header-bg': {
									type: 'element',
									initial: {
										props: {
											fill: {
												type: 'solid',
												colors: [
													{
														rgb: '#bbbbbb',
														opacity: 1
													}
												]
											},
											width: 300,
											height: 26
										}
									}
								},
								'header-label': {
									type: 'label',
									initial: {
										props: {
											'font-family': 'arial',
											'font-weight': 'bold',
											top: 5,
											left: 10,
											width: 100,
											height: 16
										},
										attr: {
											text: 'Alert'
										}
									}
								},
								'dialog-close-btn': {
									type: 'image',
									initial: {
										props: {
											top: 5,
											left: '',
											right: 10,
											width: 16,
											height: 16,
											cursor: 'pointer'
										},
										attr: {
											src: 'btn-remove-asset'
										}
									},
									behavior: {
										click: {
											event: 'dialog.close'
										}
									}
								},
								'dialog-content': {
									type: 'element',
									initial: {
										props: {
											top: 26,
											height: 174,
											width: 300
										}
									},
									children: {
										keys: [ 'import-asset', 'save-movie', 'open-movie', 'register-user', 'embed-movie' ],
										hash: {
											'import-asset': {
												type: 'element',
												initial: {
													props: {
														height: 174,
														width: 300
													}
												},
												children: {
													keys: [ 'import-desc', 'asset-lbl-label', 'asset-lbl-text', 'asset-url-label', 'asset-url-text' ],
													hash: {
														'import-desc': {
															type: 'label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 5,
																	left: 10,
																	height: 60,
																	width: 290
																},
																attr: {
																	text: 'Please specify an asset to import. The label you supply will help differentiate the asset in the library, while the path should be an absolute path to the asset.'
																}
															}
														},
														'asset-lbl-label': {
															type: 'label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 75,
																	left: 10,
																	height: 16,
																	width: 150
																},
																attr: {
																	text: 'Asset label:'
																}
															}
														},
														'asset-lbl-text': {
															type: 'textfield',
															initial: {
																props: {
																	top: 96,
																	left: 10,
																	width: 150,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														},
														'asset-url-label': {
															type: 'label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 122,
																	left: 10,
																	height: 16,
																	width: 150
																},
																attr: {
																	text: 'Asset path:'
																}
															}
														},
														'asset-url-text': {
															type: 'textfield',
															initial: {
																props: {
																	top: 143,
																	left: 10,
																	width: 150,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														}
													}
												}
											},
											'save-movie': {
												type: 'element',
												initial: {
													props: {
														height: 104,
														width: 300
													}
												},
												children: {
													keys: [ 'save-desc', 'file-name-label', 'file-name-text' ],
													hash: {
														'save-desc': {
															type: 'label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 5,
																	left: 10,
																	height: 50,
																	width: 290
																},
																attr: {
																	text: 'Please provide a unique name for your movie. (Note: Providing an existing name will overwrite that project).'
																}
															}
														},
														'file-name-label': {
															type: 'label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 65,
																	left: 10,
																	height: 16,
																	width: 150
																},
																attr: {
																	text: 'File name:'
																}
															}
														},
														'file-name-text': {
															type: 'textfield',
															initial: {
																props: {
																	top: 86,
																	left: 10,
																	width: 150,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														}
													}
												}
											},
											'open-movie': {
												type: 'element',
												initial: {
													props: {
														height: 104,
														width: 300
													}
												},
												children: {
													keys: [ 'open-desc', 'file-open-label', 'file-open-list' ],
													hash: {
														'open-desc': {
															type: 'label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 5,
																	left: 10,
																	height: 50,
																	width: 290
																},
																attr: {
																	text: 'Please select a file to open.'
																}
															}
														},
														'file-open-label': {
															type: 'label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 35,
																	left: 10,
																	height: 16,
																	width: 150
																},
																attr: {
																	text: 'File name:'
																}
															}
														},
														'file-open-list': {
															type: 'dropdown',
															initial: {
																props: {
																	top: 56,
																	left: 10,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														}
													}
												}
											},
											'register-user': {
												type: 'element',
												initial: {
													props: {
														height: 104,
														width: 300
													}
												},
												children: {
													keys: [ 'register-desc', 'register-user-lbl', 'register-user-txt', 'register-pass-lbl', 'register-pass-txt' ],
													hash: {
														'register-desc': {
															type: 'label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 5,
																	left: 10,
																	height: 50,
																	width: 290
																},
																attr: {
																	text: 'Provide a username and password.'
																}
															}
														},
														'register-user-lbl': {
															type: 'label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 35,
																	left: 10,
																	height: 18,
																	width: 35
																},
																attr: {
																	text: 'user:'
																}
															}
														},
														'register-user-txt': {
															type: 'textfield',
															initial: {
																props: {
																	top: 35,
																	left: 45,
																	height: 18,
																	width: 100,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														},
														'register-pass-lbl': {
															type: 'label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 35,
																	left: 155,
																	height: 18,
																	width: 35
																},
																attr: {
																	text: 'pass:'
																}
															}
														},
														'register-pass-txt': {
															type: 'textfield',
															initial: {
																props: {
																	top: 35,
																	left: 190,
																	height: 18,
																	width: 100,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														}
													}
												}
											},
											'embed-movie': {
												type: 'element',
												initial: {
													props: {
														height: 120,
														width: 300
													}
												},
												children: {
													keys: [ 'embed-desc', 'embed-text' ],
													hash: {
														'embed-desc': {
															type: 'label',
															initial: {
																props: {
																	'font-family': 'arial',
																	top: 5,
																	left: 10,
																	height: 50,
																	width: 290
																},
																attr: {
																	text: 'Copy and paste the code below into your web pages HTML.'
																}
															}
														},
														'embed-text': {
															type: 'textarea',
															initial: {
																props: {
																	top: 40,
																	left: 5,
																	width: 285,
																	height: 70,
																	'border-width': 1,
																	'border-color': '#bbbbbb'
																}
															}
														}
													}
												}
											}
										}
									}
								},
								'btn-submit': {
									type: 'button',
									initial: {
										props: {
											fill: {
												type: 'solid',
												colors: [
													{
														rgb: '#bbbbbb',
														opacity: 1
													}
												]
											},
											right: 10,
											left: '',
											top: '',
											bottom: 10,
											width: 70,
											height: 32,
											'border-radius': 5
										}
									},
									behavior: {
										click: {
											event: "dialog.submit"
										}
									},
									children: {
										keys: [ 'import-submit-label' ],
										hash: {
											'import-submit-label': {
												type: 'label',
												initial: {
													props: {
														top: 8,
														width: 70,
														'text-align': 'center',
														'font-weight': 'bold',
														'font-family': 'arial'
													},
													attr: {
														text: 'Ok'
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	
	$.fn.fluxui.evt().addListener( 'app.loaded', function() {
		$('#movie-container').fluxui( editor, function( data ) { new data.types.editor( data.inst ); } );
	} );
} )(jQuery);
