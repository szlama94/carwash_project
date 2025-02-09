<?php
require_once("../../common/php/environment.php");

$query= "SELECT `booking_date`,
                `booking_time`
         FROM   `bookings`";

$db = new Database();

$result = $db->execute($query);

$db = null;

Util::setResponse($result);

?>