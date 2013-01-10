<?php
require_once("class.database.php");

class Auth extends Database {
 
    //table fields
    var $user_table = 'users';          //Users table name
    var $user_column = 'useremail';     //USERNAME column (value MUST be valid email)
    var $pass_column = 'password';      //PASSWORD column
	var $id_column = 'userid';			//ID column
    var $user_level = 'userlevel';      //(optional) userlevel column
 
    //encryption
    var $encrypt = false;       //set to true to use md5 encryption for the password
	
	//registration function
	function register( $email, $password ) {
        //conect to DB
        $this->dbconnect();
        //check if encryption is used
        if ( $this->encrypt == true )
            $password = md5( $password );
        //execute login via qry function that prevents MySQL injections
        $this->qry( "INSERT INTO ".$this->user_table." ( ".$this->user_column.", ".$this->pass_column." ) VALUES ( '?', '?' );" , $email, $password );
    }
	
	function userExists( $email ) {
		$this->dbconnect();
		$result = $this->qry( "SELECT COUNT(*) FROM ".$this->user_table." WHERE ".$this->user_column."='?';", $email );
		$row = mysql_fetch_array( $result );
        if ( $row != "Error" ) {
            return ( $row[0] > 0 ) ? 1 : 0;
        } else {
            return -1;
        }
	}
	
	function isLoggedIn() {
		return ( isset( $_SESSION['loginid'] ) ) ? 1 : 0;
	}

	function userId() {
		return ( isset( $_SESSION['loginid'] ) ) ? $_SESSION['loginid'] : 0;
	}
 
    //login function
    function login( $username, $password ) {
        //conect to DB
        $this->dbconnect();
        //check if encryption is used
        if ( $this->encrypt == true )
            $password = md5( $password );
        //execute login via qry function that prevents MySQL injections
		$q = "SELECT * FROM ".$this->user_table." WHERE ".$this->user_column."='?' AND ".$this->pass_column." = '?';";
        $result = $this->qry( $q, $username, $password );
        $row = mysql_fetch_assoc( $result );
        if ( $row != "Error" ) {
            if ( $row[$this->user_column] != "" && $row[$this->pass_column] != "" ) {
                //register sessions
				$_SESSION['loginid'] = $row[$this->id_column];
                //you can add additional sessions here if needed
                $_SESSION['loggedin'] = $row[$this->pass_column];
                //userlevel session is optional. Use it if you have different user levels
                $_SESSION['userlevel'] = $row[$this->user_level];
                return true;
            } else {
                session_destroy();
                return false;
            }
        } else {
            return false;
        }
 
    }
 
    //logout function
    function logout(){
        session_destroy();
        return;
    }
 
    //check if loggedin
    function logincheck( $logincode, $pass_column, $user_column ){
        //conect to DB
        $this->dbconnect();
        //make sure password column and table are set
        if ( $this->pass_column == "" )
            $this->pass_column = $pass_column;
        if ( $this->user_column == "" )
            $this->user_column = $user_column;
        //exectue query
        $result = $this->qry( "SELECT * FROM ".$this->user_table." WHERE ".$this->pass_column." = '?';" , $logincode );
        $rownum = mysql_num_rows( $result );
        //return true if logged in and false if not
        return ( $rownum > 0 );
    }
 
    //reset password
    function passwordreset( $username, $pass_column, $user_column ) {
        //conect to DB
        $this->dbconnect();
        //generate new password
        $newpassword = $this->createPassword();
 
        //make sure password column and table are set
        if ( $this->pass_column == "" )
            $this->pass_column = $pass_column;
        if ( $this->user_column == "" )
            $this->user_column = $user_column;
        //check if encryption is used
        $newpassword_db = ( $this->encrypt == true ) ? md5($newpassword) : $newpassword;
 
        //update database with new password
        $qry = "UPDATE ".$this->user_table." SET ".$this->pass_column."='".$newpassword_db."' WHERE ".$this->user_column."='".stripslashes($username)."'";
        $result = mysql_query( $qry ) or die( mysql_error() );
 
        $to = stripslashes( $username );
        //some injection protection
        $illegals = array( "%0A","%0D","%0a","%0d","bcc:","Content-Type","BCC:","Bcc:","Cc:","CC:","TO:","To:","cc:","to:" );
        $to = str_replace( $illegals, "", $to );
        $getemail = explode( "@", $to );
 
        //send only if there is one email
        if ( sizeof( $getemail ) > 2 )
            return false;
        else {
            //send email
            $from = $_SERVER['SERVER_NAME'];
            $subject = "Password Reset: ".$_SERVER['SERVER_NAME'];
            $msg = "
 
Your new password is: ".$newpassword."
 
";
 
            //now we need to set mail headers
            $headers = "MIME-Version: 1.0 rn" ;
            $headers .= "Content-Type: text/html; \r\n" ;
            $headers .= "From: $from  \r\n" ;
 
            //now we are ready to send mail
            $sent = mail($to, $subject, $msg, $headers);
            return ( $sent ) ? true : false;
        }
    }
 
    //create random password with 8 alphanumerical characters
    function createPassword() {
        $chars = "abcdefghijkmnopqrstuvwxyz023456789";
        srand( (double) microtime() * 1000000 );
        $i = 0;
        $pass = '' ;
        while ( $i <= 7 ) {
            $num = rand() % 33;
            $tmp = substr( $chars, $num, 1 );
            $pass = $pass . $tmp;
            $i++;
        }
        return $pass;
    }
}