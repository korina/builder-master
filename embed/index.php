<?php

//For security reasons, don't display any errors or warnings. Comment out in DEV.
error_reporting(E_ALL);

include("../includes/class.login.php");
include("../includes/class.projects.php");
$log = new Auth();
$log->encrypt = false;
$proj = new Projects();

if ( isset( $_REQUEST['id'] ) ) {
	header("Access-Control-Allow-Origin: *;");
	header("Access-Control-Allow-Headers: X-Requested-With;");
	header("Access-Control-Allow-Headers: X-Requested-With;");
	header("Content-Type: application/x-javascript;");
	header("Cache-control: no-cache;");
	header("Cache-control: no-store;");
	header("Pragma: no-cache;");
	header("Expires: 0;");
	$jq = '1';
	$rt = '1';
	if ( isset( $_REQUEST['jquery'] ) ) $jq = $_REQUEST['jquery'];
	if ( isset( $_REQUEST['runtime'] ) ) $rt = $_REQUEST['runtime'];
	echo $proj->display( $_REQUEST['id'], $jq, $rt );
}
