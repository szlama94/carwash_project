<?php

require_once('./environment.php');

// Fejléc beállítása JSON válaszhoz
header('Content-Type: application/json');

// Bemeneti adatok lekérése
$args = Util::getArgs();

// Kötelező mezők ellenőrzése
$requiredFields = ['name', 'gender', 'age', 'comment', 'rating'];
foreach ($requiredFields as $field) {
    if (empty($args[$field])) {
        echo json_encode([
            "success" => false,
            "message" => "A(z) '{$field}' mező kitöltése kötelező!"
        ]);
        exit;
    }
}

// Adatbázis kapcsolat
$db = new Database();

try {
    $query = $db->preparateInsert("feedback", ["name", "gender", "age", "feedback", "point"]);
    $result = $db->execute($query, [
        $args['name'],
        $args['gender'],
        $args['age'],
        $args['comment'],
        $args['rating']
    ]);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Vélemény sikeresen rögzítve!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Hiba történt a mentés során!"]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Adatbázis hiba: " . $e->getMessage()]);
}

// Adatbázis kapcsolat lezárása
$db = null;

?>
