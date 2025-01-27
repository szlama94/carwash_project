<?php
declare(strict_types=1);

require_once("./environment.php");

$args = Util::getArgs();

// Ellenőrizzük, hogy az 'id' mező létezik-e
if (empty($args['id'])) {
    echo json_encode(['success' => false, 'message' => 'Hiányzó felhasználói azonosító!']);
    exit;
}

// Frissíthető mezők listája
$fieldsToUpdate = [
    'first_name',
    'last_name',
    'gender',
    'country',
    'country_code',
    'phone',
    'city',
    'postcode',
    'address',
];

// Készítünk egy tömböt az SQL paraméterekhez
$updateData = [];
$updateFields = [];

// Csak azok a mezők kerülnek frissítésre, amelyek nincsenek üresen
foreach ($fieldsToUpdate as $field) {
    if (isset($args[$field]) && $args[$field] !== '') {
        $updateFields[] = "`$field` = ?";
        $updateData[] = $args[$field];
    }
}

// Ha nincs mit frissíteni
if (empty($updateFields)) {
    echo json_encode(['success' => false, 'message' => 'Nincs frissítendő adat!']);
    exit;
}

// Összeállítjuk az SQL lekérdezést
$query = "UPDATE `users` 
             SET " . implode(', ', $updateFields) . "
             WHERE `id` = ?";


$updateData[] = $args['id']; // Az `id` hozzáadása az SQL végéhez

// Adatbázis kapcsolat létrehozása és lekérdezés végrehajtása
$db = new Database();
$result = $db->execute($query, $updateData);

$db = null;

// Válasz küldése a kliensnek
if ($result) {
    echo json_encode(['success' => true, 'message' => 'Sikeres frissítés!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Hiba történt a frissítés során!']);
}
exit;
