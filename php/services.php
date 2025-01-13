<?php

require_once("./environment.php");

$query= "SELECT `id`,
                `services_name`,
                `description`,
                `price`,
         FROM   `services`,
         WHERE  `valid` = 1";

$db = new Database();

$result = $db->execute($query);

$db = null;

Util::setResponse($result);