<?php
declare(strict_types=1);

require_once("./environment.php");

$args = Util::getArgs();

// Ellenőrizzük, hogy az 'id' mező létezik-e
if (!isset($args['id'])) {
    Util::setError("Hiányzó felhasználói azonosító!");
}

// Ellenőrizzük, hogy az összes kötelező mező létezik-e
$requiredFields = [
    'first_name',
    'last_name',
    'born',
    'gender',
    'country',
    'country_code',
    'phone',
    'city',
    'postcode',
    'address'
];

foreach ($requiredFields as $field) {
    if (!isset($args[$field])) {
        Util::setError("Hiányzó kötelező mező: " . $field);
    }
}

// SQL lekérdezés a felhasználói adatok frissítésére
$query = "UPDATE `users`
          SET `first_name` = ?, 
              `last_name` = ?, 
              `birth_date` = ?, 
              `gender` = ?, 
              `country` = ?, 
              `country_code` = ?, 
              `phone` = ?, 
              `city` = ?, 
              `postcode` = ?, 
              `address` = ?
          WHERE `id` = ?";

// Adatbázis kapcsolat létrehozása és lekérdezés végrehajtása
$db = new Database();
$result = $db->execute($query, [
    $args['first_name'],
    $args['last_name'],
    $args['born'],
    $args['gender'],
    $args['country'],
    $args['country_code'],
    $args['phone'],
    $args['city'],
    $args['postcode'],
    $args['address'],
    $args['id']  // Az id-t csak a WHERE feltételben használjuk
]);

$db = null;

// Válasz küldése a kliensnek
if ($result) {
    Util::setResponse("Sikeres frissítés!");
} else {
    Util::setError("Hiba történt a frissítés során!");
}
?>