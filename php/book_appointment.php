<?php
require_once('./environment.php');

$args = Util::getArgs();

// Kötelező mezők ellenőrzése
$requiredFields = ['user_id', 'services', 'services_price', 'car_plate', 'booking_date', 'booking_time'];

foreach ($requiredFields as $field) {
    if (empty($args[$field])) {
        Util::setError("Hiányzó mező: $field");
    }
}

// Foglalás mentése
$query = $db->preparateInsert("bookings", [
    "user_id",
    "services",
    "services_price",
    "car_plate",
    "booking_date",
    "booking_time"
]);

$result = $db->execute($query, [
    $args['user_id'],
    $args['services'],
    $args['services_price'],
    $args['car_plate'],
    $args['booking_date'],
    $args['booking_time']
]);

$db = null;

// Válasz küldése
if ($result['affectedRows'] > 0) {
    Util::setResponse("A foglalás sikeresen rögzítve lett.");
} else {
    Util::setError("Hiba történt a foglalás mentése során.");
}
?>
