<?php

require_once('../../common/php/environment.php');

$args = Util::getArgs();

$db = new Database();

// Adatok beszúrása a feedback táblába
$query = $db->preparateInsert("feedback", array_keys($args));

$result = $db->execute($query, array_values($args));

$db = null;

// Sikeres vagy hibás válasz küldése
if ($result["affectedRows"] > 0) {
    Util::setResponse("Vélemény sikeresen rögzítve!");
}
Util::setError("Hiba történt a mentés során!");