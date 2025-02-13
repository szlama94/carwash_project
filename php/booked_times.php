<?php
require_once("../../common/php/environment.php");

$data = Util::getArgs();

// SQL lekérdezés csak a kiválasztott dátumhoz
$query = "SELECT DISTINCT  `booking_time`
                     FROM  `bookings`
                     WHERE `booking_date` = :selectedDate";

$db = new Database();

$result = $db->execute($query, $data);

$db = null;

Util::setResponse($result);
?>