<?php

require_once('./environment.php');

// Fejléc beállítása JSON válaszhoz
header('Content-Type: application/json');

// Kérésből az `id` beolvasása
$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Hiányzó felhasználói azonosító!"
    ]);
    exit;
}

// Adatbázis kapcsolat létrehozása
$db = new Database();

// Felhasználói adatok lekérése az adatbázisból
$query = "SELECT 
             `id`, 
             `type`, 
             `first_name`, 
             `last_name`, 
             `born`, 
             `gender`, 
             `img`, 
             `img_type`, 
             `country`, 
             `country_code`, 
             `phone`, 
             `city`, 
             `postcode`, 
             `address`, 
             `email`
          FROM `users`
          WHERE `id` = ?";

$result = $db->execute($query, [$data['id']]);

if ($result && count($result) > 0) {
    $userData = $result[0];

    // Formázzuk a születési dátumot, ha nem null
    if (!empty($userData['born'])) {
        $userData['born'] = date('Y-m-d', strtotime($userData['born']));
    }

    echo json_encode([
        "success" => true,
        "data" => $userData
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "A felhasználó adatai nem találhatók!"
    ]);
}

$db = null;
?>