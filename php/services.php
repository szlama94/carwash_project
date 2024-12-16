<?php

// Include environment
require_once("./environment.php");

// Set SQL command
$query= "SELECT * FROM `services`";

// Connect to MySQL server
$db = new Database();

// Execute SQL command
$result = $db->execute($query);

// Close connection
$db = null;

// Ser response
Util::setResponse($result);