<?php
require_once("../../common/php/environment.php");

$data = Util::getArgs();

$db = new Database();

// SQL lekérdezés a kiválasztott dátumhoz az összekapcsolt táblákból
$query = "SELECT DISTINCT TIME_FORMAT(`bookings_row`.`booking_time`, '%H:%i') AS booking_time
                     FROM `bookings_row`
               INNER JOIN `bookings`
                       ON `bookings`.`id` = `bookings_row`.`booking_id`
                    WHERE `bookings`.`booking_date` = :selectedDate";

$result = $db->execute($query, $data);

$db = null;

Util::setResponse($result);
