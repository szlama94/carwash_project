<?php
require_once('../../common/php/environment.php');

$args = Util::getArgs();

$db = new Database();

// SQL beszúrás előkészítése
$query = $db->preparateInsert("bookings", [
    "user_id",
    "booking_date",
    "booking_time",
    "service_id",
    "vehicle_plate"
]);

// Több `service_id` és `time` mentése
foreach ($args['services'] as $service) {
    if (!isset($service['time']) || !isset($service['service_id'])) {
        Util::setError("Hiányzó időpont vagy szolgáltatás ID!");
    }

    $result = $db->execute($query, [
        $args['user_id'],
        $args['booking_date'],
        $service['time'], // Minden szolgáltatás saját időponttal érkezik
        $service['service_id'],
        $args['vehicle_plate']
    ]);

    if (!$result) {
        Util::setError("Hiba történt a foglalás mentése során a szolgáltatás ID: " . $service['service_id']);
    }
}

Util::setResponse("Foglalás sikeresen mentve!");