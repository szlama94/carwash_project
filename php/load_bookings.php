<?php
require_once('../../common/php/environment.php');

// Adatbázis kapcsolat létrehozása
$db = new Database();

// A kérésből érkező paraméterek lekérése
$args = Util::getArgs();

// SQL lekérdezés létrehozása, amely lekéri a felhasználó foglalásait
// b = booking tábla s= services tábla
$query = "SELECT 
            b.id, 
            DATE_FORMAT(b.booking_date, '%Y.%m.%d') AS date,  -- A foglalás dátumának formázása (év.hónap.nap)
            TIME_FORMAT(b.booking_time, '%H:%i') AS time,  -- A foglalás időpontjának formázása (óra:perc)
            s.services_name AS package,  -- A szolgáltatás neve
            s.price  -- A szolgáltatás ára
          FROM bookings b
          INNER JOIN services s ON b.service_id = s.id  -- Kapcsolódás a services táblához a service_id alapján
          WHERE b.user_id = ?  -- Csak a bejelentkezett felhasználó foglalásait kérdezi le
          ORDER BY b.booking_date DESC, b.booking_time ASC";
          //A foglalásokat dátum szerint csökkenő sorrendben rendezi, majd idő szerint növekvőben

// A lekérdezés végrehajtása és az eredmény visszaadása
Util::setResponse($db->execute($query, [$args['user_id']]) ?: []);

// Adatbáziskapcsolat lezárása
$db = null;
?>
