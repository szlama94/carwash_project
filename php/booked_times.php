<?php
require_once("../../common/php/environment.php");

// Lekérdezzük az összes dátumot és időpontot
$query = "SELECT `date`, `time` 
            FROM `bookings`";

$db = new Database();

$result = $db->execute($query);

$db = null;

Util::setResponse($result);
?>
