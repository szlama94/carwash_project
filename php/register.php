<?php
require_once('../../common/php/environment.php');

$args = Util::getArgs();

// Ellenőrzés, hogy az e-mail cím már regisztrálva van-e
$db = new Database();

$query = "SELECT `id` 
          FROM   `users` 
          WHERE  `email` = ?";

$result = $db->execute($query, [$args['email']]);

if (!empty($result)) {
    Util::setError("Ez az e-mail cím már regisztrálva van!");
}

// Adatok beszúrása (jelszó titkosítás nélkül)
$query = $db->preparateInsert("users", [
                                        "type", 
                                        "first_name", 
                                        "last_name", 
                                        "born", 
                                        "country_code",
                                        "phone",
                                        "gender",
                                        "email", 
                                        "password", 
                                        "valid"
]);

$result = $db->execute($query, [
    'U',  // Alapértelmezett típus
    $args['first_name'],
    $args['last_name'],
    $args['born'],
    $args['country_code'] = $args['country_code'] ?? null,
    $args['phone'] = $args['phone'] ?? null,
    $args['gender'],
    $args['email'],
    $args['password'],
    1  // Alapértelmezett érvényesség
]);

$db = null;

// Sikeres válasz vagy hibaüzenet küldése
if ($result) {
    Util::setResponse("Sikeres regisztráció!");}

Util::setError("Hiba történt a regisztráció során!");