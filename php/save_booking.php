<?php

declare(strict_types=1);

require_once("../../common/php/environment.php");


// Lekérjük az összes adatot JSON formátumban
$data = Util::getArgs();

// Ellenőrizzük, hogy minden adat megvan-e
$date = $data['date'] ?? null;
$time = $data['time'] ?? null;
$vehicle_plate = $data['vehicle_plate'] ?? null;
$package = $data['package'] ?? null;
$user_id = $data['user_id'] ?? null;

if (is_null($date) || is_null($time) || is_null($vehicle_plate) || is_null($package) || is_null($user_id)) {
    Util::setError("Hiányzó adatok a foglalás mentéshez.");
}

// Kapcsolódás az adatbázishoz
$db = new Database();

// Foglalás mentése az insert lekérdezéssel
$query = $db->preparateInsert("bookings", ["user_id", "date", "time", "vehicle_plate", "package"]);
$params = [$user_id, $date, $time, $vehicle_plate, $package];

$result = $db->execute($query, $params, "INSERT");

if ($result && $result['affectedRows'] > 0) {
    Util::setResponse("Foglalás sikeresen mentve.");
} else {
    Util::setError("Nem sikerült menteni a foglalást.");
}
?>