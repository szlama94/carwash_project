<?php
require_once('../../common/php/environment.php');

$db = new Database();

$args = Util::getArgs();

// SQL törlő lekérdezés
$query = "DELETE 
            FROM bookings 
           WHERE id = ?";


$result = $db->execute($query, [$args['booking_id']]);

if ($result) {
    Util::setResponse("Foglalás sikeresen törölve!");
} else {
    Util::setError("Hiba történt a törlés során!");
}

$db = null;
?>
