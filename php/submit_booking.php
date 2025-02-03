<?php
require_once("./environment.php");

$args = Util::getArgs();
$user_id = $args['user_id'];
$booking_date = $args['booking_date'];
$booking_time = $args['booking_time'];
$selectedServices = $args['selectedServices'];

$db = new Database();

foreach ($selectedServices as $service) {
    $query = "INSERT INTO bookings (user_id, services, services_price, car_plate, booking_date, booking_time) 
              VALUES (?, ?, ?, ?, ?, ?)";
    $db->execute($query, [
        $user_id,
        $service['services_name'],
        $service['price'],
        $args['car_plate'],
        $booking_date,
        $booking_time
    ]);
}

$db = null;
Util::setResponse(["Foglalás sikeresen mentve."]);
?>
