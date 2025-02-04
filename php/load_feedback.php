<?php

require_once('../../common/php/environment.php');

$db = new Database();

$query = "SELECT `id`, 
                 `name`, 
                 `gender`, 
                 `age`, 
                 `comment`, 
                 `rating` 
          FROM   `feedback`";

$result = $db->execute($query);

Util::setResponse($result);

$db = null;

?>