<?php
declare(strict_types=1);

require_once("../../common/php/environment.php");

$args = Util::getArgs();

// Ellenőrizzük az 'id' mezőt
if (empty($args['id'])) {
    Util::setError('Hiányzó felhasználói azonosító!');
}

// SQL lekérdezés létrehozása
$query = "UPDATE `users` 
          SET 
                `first_name` = ?, 
                `last_name` = ?, 
                `gender` = ?, 
                `country` = ?, 
                `country_code` = ?, 
                `phone` = ?, 
                `city` = ?, 
                `postcode` = ?, 
                `address` = ? 
          WHERE `id` = ?";

// Az adatok beállítása az SQL paraméterekhez
$updateData = [
    $args['first_name'],
    $args['last_name'],
    $args['gender'],
    $args['country'],
    $args['country_code'],
    $args['phone'],
    $args['city'],
    $args['postcode'],
    $args['address'],
    $args['id']
];

// Adatbázis kapcsolat létrehozása és végrehajtás
$db = new Database();
$result = $db->execute($query, $updateData);
$db = null;

// Válasz küldése
if ($result) {
    Util::setResponse("Sikeres frissítés!");
} else {
    Util::setError("Nem történt frissítés, vagy hiba történt.");
}
?>