<?php
require_once("../../common/php/environment.php");

$data = Util::getArgs();

$userId = $data['user_id'] ?? '';

if (!$userId) {
    Util::setError('Felhasználói azonosító szükséges!');
}

$db = new Database();

$query = "SELECT `package`, `date`, `time`, `price` 
          FROM bookings 
          WHERE user_id = ?";

          
$result = $db->execute($query, [$userId], 'SELECT');

if ($result) {
    Util::setResponse($result);
} else {
    Util::setResponse([]);
}
?>
