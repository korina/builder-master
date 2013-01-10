<?php
require_once("class.database.php");

class Projects extends Database {
	
	var $projects_table = 'projects';
	var $user_column = 'userid';
	var $id_column = 'id';
	var $name_column = 'name';
	var $data_column = 'data';
	
	function list_projects( $userid ) {
		$this->dbconnect();
		$result = $this->qry( "SELECT name FROM ".$this->projects_table." WHERE ".$this->user_column."='?';" , $userid );
		$list = array();
		while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
 			array_push( $list, array( 'name' => $row[0] ) );  
		}
		return $list;
	}
	
	function get_project( $userid, $name ) {
		$this->dbconnect();
		$result = $this->qry( "SELECT name, data FROM ".$this->projects_table." WHERE ".$this->user_column."='?' AND ".$this->name_column."='?';" , $userid, $name );
		$row = mysql_fetch_assoc( $result );
		if ( $row != "Error" ) {
			return array( 'name' => $row['name'], 'data' => $row['data'] );
		}
	}
	
	function put_project( $userid, $name, $data ) {
		$this->dbconnect();
		$result = $this->qry( "SELECT * FROM ".$this->projects_table." WHERE ".$this->user_column."='?' AND ".$this->name_column."='?';" , $userid, $name );
		$row = mysql_fetch_assoc( $result );
		if ( $row != "Error" && mysql_num_rows( $result ) > 0 ) {
			$this->qry( "UPDATE ".$this->projects_table." SET ".$this->data_column."='?' WHERE ".$this->user_column."=? AND ".$this->name_column."='?';", $data, $userid, $name );
		} else {
			$this->qry( "INSERT INTO ".$this->projects_table." ( ".$this->user_column.", ".$this->name_column.", ".$this->data_column." ) VALUES ( ?, '?', '?' );", $userid, $name, $data );
		}
		return 1;
	}
	
	function get_embed_code( $userid, $name ) {
		$this->dbconnect();
		$result = $this->qry( "SELECT id FROM ".$this->projects_table." WHERE ".$this->user_column."='?' AND ".$this->name_column."='?';" , $userid, $name );
		$row = mysql_fetch_array( $result );
		if ( $row != "Error" && mysql_num_rows( $result ) > 0 ) {
			return "<script src='http://bristolbraille.co.uk/influxis_test/embed?id=".$row[0]."'></script>
<div class='fluxui_".$row[0]."'></div>";
		} else {
			return '-1';
		}
	}
	
	function display( $id, $jq, $rt ) {
		$this->dbconnect();
		$result = $this->qry( "SELECT data FROM ".$this->projects_table." WHERE ".$this->id_column."=?;" , $id );
		$row = mysql_fetch_array( $result );
		if ( $row != "Error" && mysql_num_rows( $result ) > 0 ) {
			$s = '';
			if ( $jq != '0' ) {
				$s .= $this->getJQuery();
				$s .= $this->getAdditionalJS();
			}
			if ( $rt != '0' )
				$s .= $this->getRuntime();
			$s .= "$(window).load( function() {
					$('.fluxui_".$id."').fluxui( " . $row[0] . " );
				} );";
			return $s;
		} else
			return "";
	}
	
	function getJQuery() {
		return file_get_contents( '../js/jquery.min.js' );
	}
	
	function getAdditionalJS() {
		return file_get_contents( '../js/jquery-ui-1.8.2.custom.min.js' );
	}
	
	function getRuntime() {
		return file_get_contents( '../js/fluxui.js' );
	}
}
