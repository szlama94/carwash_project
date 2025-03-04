<?php
require_once('../../common/php/environment.php');

$db = new Database();

// A kérésből érkező paraméterek lekérése
$args = Util::getArgs();

// SQL lekérdezés létrehozása, amely lekéri a felhasználó foglalásait
// b = booking tábla s= services tábla
$query = "SELECT b.id, 
          DATE_FORMAT(b.booking_date, '%Y.%m.%d') AS date, 
          TIME_FORMAT(b.booking_time, '%H:%i') AS time, 
                      s.services_name AS package,  
                      s.price 
          FROM        bookings b
          INNER JOIN  services s 
                  ON  b.service_id = s.id  
               WHERE  b.user_id = ?  
            ORDER BY  b.booking_date DESC, b.booking_time ASC";

// Adatbáziskapcsolat lezárása
$db = null;

// A lekérdezés végrehajtása és az eredmény visszaadása
Util::setResponse($db->execute($query, [$args['user_id']]) ?: []);