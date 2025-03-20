<?php
require_once('../../common/php/environment.php');

$db = new Database();

// Kérésben lévő adatok lekérése
$args = Util::getArgs();

// Ellenőrzés: booking_id és id megléte
if (empty($args['booking_id']) || empty($args['id']))
    Util::setError("Hiányzó adatok a törléshez.");

$query  = "DELETE 
             FROM `bookings_row` 
            WHERE `id` = ?;";

$result = $db->execute($query, [$args['id']]);

if (!$result["affectedRows"])
    Util::setError("Nem sikerült törölni. booking_row");

$query  = "SELECT `id` 
             FROM `bookings_row` 
            WHERE `booking_id` = ?;";

$result = $db->execute($query, [$args['booking_id']]);

if (is_null($result)) {

$query  = "DELETE 
             FROM `bookings` 
            WHERE `id` = ?;";

$result = $db->execute($query, [$args['booking_id']]);

if (!$result["affectedRows"])
    Util::setError("Nem sikerült törölni. bookings");
}

Util::setResponse("success_appointment_delete");

// Adatbázis kapcsolat lezárása
$db = null;
