<?php
require_once('../../common/php/environment.php');

$db = new Database();
$args = Util::getArgs();

$query = "SELECT 
            b.id, 
            b.booking_date AS date, 
            b.booking_time AS time, 
            s.services_name AS package,
            s.price
          FROM bookings b
          INNER JOIN services s ON b.service_id = s.id
          WHERE b.user_id = ?
          ORDER BY b.booking_date DESC, b.booking_time ASC";

Util::setResponse($db->execute($query, [$args['user_id']]) ?: []);

$db = null;
?>
