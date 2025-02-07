<?php

require_once("../../common/php/environment.php");
// require_once("Database.php");
// require_once("Util.php");

$data = Util::getArgs();

$date = $data['date'] ?? '';

if ($date) {
    $db = new Database();

    $query = "SELECT time 
              FROM bookings 
              WHERE date = ?";

    $bookedTimes = $db->execute($query, [$date], "SELECT");

    if ($bookedTimes) {
        Util::setResponse(array_column($bookedTimes, 'time'));
    } else {
        Util::setResponse([]);
    }
} 
else
{
    Util::setError("Nincs megadva dátum");
}
?>