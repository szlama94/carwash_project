<?php

require_once("./environment.php");

$query= "SELECT `id`,
                `services_name`,
                `description`,
                `price`
         FROM   `services`";

$db = new Database();

$result = $db->execute($query);

$db = null;

Util::setResponse($result);
