<?php
require_once('../../common/php/environment.php');

$args = Util::getArgs();

$services = $args["services"];

unset($args["services"]);

$db = new Database();

// SQL beszúrás előkészítése
$query = $db->preparateInsert("bookings", [
    "user_id",
    "booking_date",
    "vehicle_plate"
]);

$result     = $db->execute($query, array_values($args));

$bookingID  = $result["lastInsertId"];

// SQL beszúrás előkészítése
$query = $db->preparateInsert("bookings_row", [
    "booking_id",
    "booking_time",
    "service_id"
], count($services));

$params = Util::arrayOfAssocArrayToArray($services, $bookingID);
$result = $db->execute($query, $params);

$db = null;

Util::setResponse("Foglalás sikeresen mentve!");