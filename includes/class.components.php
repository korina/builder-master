<?php

class Components {
	
	//path to component directory
	var $directory = "components";
	
	function __construct( $dir ) {
		if ( $dir != NULL )
			$this->directory = $dir;
	}
	
	function get_component_list() {
		$files = glob( $this->directory . "*" );
		$dir = array();
		foreach( $files as $file )
		{
			//check to see if the file is a folder/directory
			if ( is_dir( $file ) )
				array_push( $dir, array_pop( explode( DIRECTORY_SEPARATOR, $file ) ) );
		}
		return $dir;
	}

	function get_component( $id, $type = 'json' ) {
		switch ( $type ) {
			case 'class' :
				return file_get_contents( $this->directory . $id . DIRECTORY_SEPARATOR . 'fluxui.class.js' );
				break;
			case 'props' :
				return file_get_contents( $this->directory . $id . DIRECTORY_SEPARATOR . 'properties.js' );
				break;
			case 'preview' :
			case 'icon' :
				return $this->getImageFilename( $id, $type );
				break;
			default :
				return file_get_contents( $this->directory . $id . DIRECTORY_SEPARATOR . 'json.js' );
				break;
		}
	}
	
	function getImageFilename( $id, $type ) {
		$f = '';
		$dir = opendir( $this->directory . $id );
		while ( $file = @readdir( $dir ) ) {
			if ( !is_dir( $this->directory . $id . DIRECTORY_SEPARATOR . $file ) && $this->startsWith( $file, $type ) )
				$f = $this->directory . $id . DIRECTORY_SEPARATOR . $file;
		}
		@closedir( $this->directory );
		return $f;
	}
	
	function startsWith( $haystack, $needle ) {
		$length = strlen( $needle );
		return ( substr( $haystack, 0, $length ) === $needle );
	}
}