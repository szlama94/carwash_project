<?php

require_once("./environment.php");

$query = "SELECT `id`,
                 `name`,
                 `gender`,
                 `age`,
                 `feedback`,
                 `point`, 
          FROM `feedback` 
          WHERE `valid` = 1";

$db = new Database();

$result = $db->execute($query);

$db = null;

Util::setResponse($result);