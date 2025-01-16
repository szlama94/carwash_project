<?php

require_once('./environment.php');

// Fejléc beállítása JSON válaszhoz
header('Content-Type: application/json');

$db = new Database();


$query = "SELECT `id`, 
                 `name`, 
                 `gender`, 
                 `age`, 
                 `feedback`, 
                 `point` 
          FROM   `feedback`";

$result = $db->execute($query);

// Válasz visszaküldése
echo json_encode([
    "success" => true,
    "data" => $result
]);

$db = null;

?>
