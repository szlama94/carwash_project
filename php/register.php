<?php
declare(strict_types=1);

// Környezet betöltése
require_once('./environment.php');

// Fejléc beállítása JSON válaszhoz
header('Content-Type: application/json');

// Bemeneti adatok fogadása
$args = Util::getArgs();

// Adatok validálása
$errors = [];

// Kötelező mezők ellenőrzése
$requiredFields = ['first_name', 
                    'last_name', 
                    'email', 
                    'emailConfirm', 
                    'password', 
                    'passwordConfirm', 
                    'born', 
                    'gender'];
foreach ($requiredFields as $field) {
    if (empty(trim($args[$field]))) {
        $errors[] = ucfirst($field) . " mező hiányzik!";
    }
}

// Jelszó megerősítés ellenőrzése
if ($args['password'] !== $args['passwordConfirm']) {
    $errors[] = "A jelszavak nem egyeznek!";
}

// E-mail megerősítés ellenőrzése
if ($args['email'] !== $args['emailConfirm']) {
    $errors[] = "Az e-mail címek nem egyeznek!";
}

// E-mail formátum ellenőrzése
if (!filter_var($args['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Az e-mail cím érvénytelen!";
}

// Hibaüzenetek visszaküldése
if (!empty($errors)) {
    echo json_encode([
        "success" => false,
        "message" => "Hibák a regisztráció során: " . implode(", ", $errors)
    ]);
    exit;
}

// Ellenőrzés, hogy az e-mail cím már létezik-e az adatbázisban
$query = "SELECT 
                `id` 
          FROM  `users`
          WHERE `email` = ?";

$db = new Database();
$result = $db->execute($query, [$args['email']]);

if (!empty($result)) {
    echo json_encode([
        "success" => false,
        "message" => "Ez az e-mail cím már regisztrálva van!"
    ]);
    exit;
}

// Adatok előkészítése beszúráshoz
$hashedPassword = password_hash($args['password'], PASSWORD_BCRYPT);

try {
    // Beszúrási lekérdezés előkészítése
    $query = $db->preparateInsert("users", [
        "type", 
        "first_name", 
        "last_name", 
        "born", 
        "gender", 
        "email", 
        "password", 
        "valid"
    ]);

    // Adatok beszúrása az adatbázisba
    $result = $db->execute($query, [
        'U', // Alapértelmezett típus
        $args['first_name'],
        $args['last_name'],
        $args['born'],
        $args['gender'],
        $args['email'],
        $args['password'],
        1 // Alapértelmezett érvényesség
    ]);

    // Válasz küldése
    if ($result) {
        echo json_encode([
            "success" => true,
            "message" => "Sikeres regisztráció!"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Hiba történt a regisztráció során!"
        ]);
    }

} catch (Exception $e) {
    // Kivétel kezelése
    echo json_encode([
        "success" => false,
        "message" => "Adatbázis hiba: " . $e->getMessage()
    ]);
}

// Adatbázis kapcsolat lezárása
$db = null;
?>