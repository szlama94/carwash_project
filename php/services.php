<?php

require_once("./environment.php");

$query= "SELECT * FROM `services`";

$db = new Database();

$result = $db->execute($query);

$db = null;

Util::setResponse($result);