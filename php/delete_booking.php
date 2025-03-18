<?php
require_once('../../common/php/environment.php');

$db = new Database();

// Kérésben lévő adatok lekérése
$args = Util::getArgs();

// Ellenőrzés: booking_id és id megléte
if (empty($args['booking_id']) || empty($args['id']))
    Util::setError("Hiányzó adatok a törléshez.");

$query  = "DELETE FROM `bookings_row` WHERE `id` = ?;";
$result = $db->execute($query, [$args['id']]);
if (!$result["affectedRows"])
    Util::setError("Nem sikerült törölni. booking_row");

$query  = "SELECT `id` FROM `bookings_row` WHERE `booking_id` = ?;";
$result = $db->execute($query, [$args['booking_id']]);

if (is_null($result)) {

    $query  = "DELETE FROM `bookings` WHERE `id` = ?;";
    $result = $db->execute($query, [$args['booking_id']]);
    if (!$result["affectedRows"])
        Util::setError("Nem sikerült törölni. bookings");
}

Util::setResponse("shopping_cart");








// Tranzakció indítása az adatintegritás biztosítása érdekében
//$db->beginTransaction();







try {
    // Törlés a bookings_row táblából
    $query = "DELETE FROM `bookings_row` WHERE `id` = ?";
    $db->execute($query, [$args['id']]);

    $query = "SELECT `id` FROM `bookings_row` WHERE `booking_id` = ?";


    // Ellenőrzés, van-e még sor az adott booking_id-hez a bookings_row táblában
    $query = "SELECT COUNT(*) AS count FROM `bookings_row` WHERE `booking_id` = ?";
    $result = $db->execute($query, [$args['booking_id']]);
    $rowCount = $result[0]['count'];

    if ($rowCount == 0) {
        // Ha nincs több kapcsolódó sor, akkor töröljük a foglalást is
        $query = "DELETE FROM `bookings` WHERE `id` = ?";
        $db->execute($query, [$args['booking_id']]);
    }

    // Tranzakció mentése
    $db->commit();

    Util::setResponse("Az időpont sikeresen törölve!"); // Sikeres törlés üzenet
} catch (Exception $e) {
    // Hiba esetén tranzakció visszavonása
    $db->rollback();
    Util::setResponse(["error" => "Hiba történt a törlés során: " . $e->getMessage()]);
}

// Adatbázis kapcsolat lezárása
$db = null;
?>
