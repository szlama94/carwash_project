<?php
require_once("../../common/php/environment.php");

$data = Util::getArgs();

$selectedDate = isset($data['selectedDate']) ? $data['selectedDate'] : null;

// SQL lekérdezés csak a kiválasztott dátumhoz
$query = "SELECT `booking_date`, 
                 `booking_time`
          FROM   `bookings`
          WHERE  `booking_date` = :selectedDate";

$db = new Database();

$params = [":selectedDate" => $selectedDate];  // Paraméter beállítása

$result = $db->execute($query, $params);

$db = null;

Util::setResponse($result);
?>