<?php
require_once('./environment.php');

$args = Util::getArgs();

// Ellenőrizzük, hogy a dátum be van-e állítva
if (empty($args['date'])) {
    Util::setError("Hiányzik a foglalási dátum!");
}

$db = new Database();

$query = "SELECT `booking_time` FROM `bookings` WHERE `booking_date` = ?";
$result = $db->execute($query, [$args['date']]);

$db = null;

// Sikeres válasz
if ($result) {
    Util::setResponse($result);
} else {
    Util::setError("Nem sikerült betölteni a foglalási időpontokat.");
}
?>
