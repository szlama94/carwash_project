<?php
require_once('../../common/php/environment.php');

$args = Util::getArgs();
$db = new Database();



//Ellenőrizzük, hogy a `service_ids` egy tömb-e
if (!is_array($args['service_ids']) || empty($args['service_ids'])) {
    Util::setError("Érvénytelen vagy üres szolgáltatás lista!");
}

//SQL beszúrás előkészítése
$query = $db->preparateInsert("bookings", [
    "user_id",
    "booking_date",
    "booking_time",
    "service_id",
    "vehicle_plate"
]);

//Több `service_id` mentése
foreach ($args['service_ids'] as $service_id) {
    $result = $db->execute($query, [
        $args['user_id'],
        $args['booking_date'],
        $args['booking_time'],
        $service_id,
        $args['vehicle_plate']
    ]);

    if (!$result) {
        Util::setError("Hiba történt a foglalás mentése során a szolgáltatás ID: $service_id");
    }
}

// 📌 Sikeres válasz
Util::setResponse("Foglalás sikeresen mentve!");
?>
