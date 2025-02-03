<?php
require_once('./environment.php');

$db = new Database();

$query = "SELECT `id`, `services_name`, `description`, `price` FROM `services`";
$result = $db->execute($query);

$db = null;

// Sikeres válasz
if ($result) {
    Util::setResponse($result);
} else {
    Util::setError("Nem sikerült betölteni a szolgáltatásokat.");
}
?>
