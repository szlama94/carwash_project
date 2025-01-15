<?php

require_once('./environment.php');

// Fejléc beállítása JSON válaszhoz
header('Content-Type: application/json');

// Bemeneti adatok lekérése
$args = Util::getArgs();

// Adatbázis kapcsolat
$db = new Database();

// Kötelező mezők ellenőrzése
$requiredFields = ['name', 'gender', 'age', 'feedback', 'point'];
foreach ($requiredFields as $field) {
    if (empty($args[$field])) {
        echo json_encode([
            "success" => false,
            "message" => "A(z) '{$field}' mező kitöltése kötelező!"
        ]);
        exit;
    }
}

// Adatok beszúrása
try {
    $query = $db->preparateInsert("feedback", array_keys($args));
    $result = $db->execute($query, array_values($args));

    if ($result) {
        // Sikeres beszúrás válasz
        echo json_encode([
            "success" => true,
            "message" => "Sikeresen elküldted a véleményed!"
        ]);
    } else {
        // Sikertelen beszúrás válasz
        echo json_encode([
            "success" => false,
            "message" => "Hiba történt a vélemény elküldésekor."
        ]);
    }

} catch (Exception $e) {
    // Hibakezelés
    echo json_encode([
        "success" => false,
        "message" => "Hiba történt: " . $e->getMessage()
    ]);
}

// Adatbázis kapcsolat lezárása
$db = null;

?>
