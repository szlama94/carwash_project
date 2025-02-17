<?php

require_once('../../common/php/environment.php');


$data = Util::getArgs();

if (empty($data['id'])) {
    Util::setError("Hiányzó felhasználói azonosító!");
}

// Adatbázis kapcsolat létrehozása
$db = new Database();

// Felhasználói adatok lekérése
$query = "SELECT `id`, 
                 `type`, 
                 `first_name`, 
                 `last_name`, 
                 `born`, 
                 `gender`, 
                 `email`, 
                 `country`, 
                 `country_code`, 
                 `phone`, 
                 `city`, 
                 `postcode`, 
                 `address`
          FROM   `users` 
          WHERE  `id` = ?";

$result = $db->execute($query, [$data['id']]);

$db = null;

if ($result) 
{
    Util::setResponse($result[0]);
} 
else 
{
    Util::setError("A felhasználó adatai nem találhatók.");
}
?>