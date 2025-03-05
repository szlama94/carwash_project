<?php

require_once('../../common/php/environment.php');

$db = new Database();

$query = "SELECT *
          FROM   `feedbacks`";

$result = $db->execute($query);

$db = null;

Util::setResponse($result);

