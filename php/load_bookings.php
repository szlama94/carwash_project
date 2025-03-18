<?php
require_once('../../common/php/environment.php');

$db = new Database();

// A kérésből érkező paraméterek lekérése
$args = Util::getArgs();

// SQL lekérdezés létrehozása, amely lekéri a felhasználó foglalásait
$query = "SELECT      `bookings_row`.`id`, 
                      `bookings`.`id` AS `booking_id`,
          DATE_FORMAT(`bookings`.`booking_date`, '%Y.%m.%d') AS date, 


          TIME_FORMAT(`bookings_row`.`booking_time`, '%H:%i') AS time, 
                      `services`.`services_name` AS `package`,  
                      `services`.`price` 
          FROM        `bookings_row` 
          INNER JOIN  `bookings` 
                  ON  `bookings`.`id` = `bookings_row`.`booking_id` AND
                      `bookings`.`user_id` = ? 
          INNER JOIN  `services` 
                  ON  `services`.`id` = `bookings_row`.`service_id`  
            ORDER BY  `bookings`.`booking_date` DESC, 
                      `bookings_row`.`booking_time` ASC";
          

// A lekérdezés végrehajtása és az eredmény visszaadása
Util::setResponse($db->execute($query, [$args['user_id']]) ?: []);

// Adatbáziskapcsolat lezárása
$db = null;