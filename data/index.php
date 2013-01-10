<?php

//For security reasons, don't display any errors or warnings. Comment out in DEV.
error_reporting(E_ALL);
//start session
session_start();

include("../includes/class.login.php");
include("../includes/class.projects.php");
include("../includes/class.components.php");
$log = new Auth();
$log->encrypt = false;
$proj = new Projects();
$comp = new Components( '..' . DIRECTORY_SEPARATOR . 'components' . DIRECTORY_SEPARATOR );

$a = $_REQUEST['action'];

switch ( $a ) {
	case "loggedIn" :
		echo ( $log->isLoggedIn() );
		break;
	case "login" :
		echo ( $log->login( $_REQUEST['u'], $_REQUEST['p'] ) == true ) ? "1" : "0";
		break;
	case "logout" :
		$log->logout();
		break;
	case "register" :
		$u = $_REQUEST['u'];
		$p = $_REQUEST['p'];
		$q = $log->userExists( $u, $p );
		if ( $q == 0 ) {
			$log->register( $u, $p );
			echo 1;
		} else if ( $q == -1 ) echo -1;
		else echo 0;
		break;
	case "list" :
		if ( !$log->isLoggedIn() ) {
			echo '-1';
		} else {
			echo json_encode( $proj->list_projects( $log->userId() ) );
		}
		break;
	case "get" :
		if ( !$log->isLoggedIn() ) {
			echo '-1';
		} else {
			echo json_encode( $proj->get_project( $log->userId(), $_REQUEST['name'] ) );
		}
		break;
	case "put" :
		if ( !$log->isLoggedIn() ) {
			echo '-1';
		} else {
			echo json_encode( $proj->put_project( $log->userId(), $_REQUEST['name'], $_REQUEST['data'] ) );
		}
		break;
	case 'components' :
		set_header( 'application/x-javascript' );
		echo json_encode( $comp->get_component_list() );
		break;
	case 'getComponent' :
		if ( !isset( $_REQUEST['id'] ) )
			echo '-1';
		else if ( !isset( $_REQUEST['type'] ) )
			echo $comp->get_component( $_REQUEST['id'], 'json' );
		else {
			switch ( $_REQUEST['type'] ) {
				case 'class':
				case 'json':
				case 'props':
					set_header( 'application/x-javascript' );
					echo $comp->get_component( $_REQUEST['id'], $_REQUEST['type'] );
					break;
				case 'preview':
				case 'icon':
					$pic = $comp->get_component( $_REQUEST['id'], $_REQUEST['type'] );
					set_header( get_mime( $pic ) );
					header( 'Content-length: '.filesize( $pic ) );
					$file = @ fopen( $pic, 'rb' );
					if ( $file ) {
						fpassthru( $file );
						exit;
					}
					break;
			}
		}
		break;
	case 'embed' :
		if ( $log->isLoggedIn() && isset( $_REQUEST['name'] ) ) {
			echo $proj->get_embed_code( $log->userId(), $_REQUEST['name'] );
		} else {
			echo -1;
		}
		break;
	case 'preview' :
		if ( $log->isLoggedIn() && isset( $_REQUEST['name'] ) ) {
			echo $proj->get_embed_code( $log->userId(), $_REQUEST['name'] );
		} else {
			echo -1;
		}
		break;
	default :
		if ( isset( $_REQUEST['id'] ) ) {
			set_header( 'application/x-javascript' );
			echo $proj->display( $_REQUEST['id'] );
		}
}

function set_header( $mime ) {
	header("Access-Control-Allow-Origin: *;");
	header("Access-Control-Allow-Headers: X-Requested-With;");
	header("Access-Control-Allow-Headers: X-Requested-With;");
	header("Content-Type: $mime;");
	header("Cache-control: no-cache;");
	header("Cache-control: no-store;");
	header("Pragma: no-cache;");
	header("Expires: 0;");
}

function get_mime( $filename ) {
	$ext = substr($filename, -3);
	// set the MIME type
	switch ($ext) {
		case 'jpg':
			$mime = 'image/jpeg';
			break;
		case 'gif':
			$mime = 'image/gif';
			break;
		default:
			$mime = 'image/png';
	}
	return $mime;
}
