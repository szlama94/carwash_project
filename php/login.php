<?php

require_once("../../common/php/environment.php");

$args = Util::getArgs();

$query = "SELECT 	`id`,
					`type`,
					`first_name`,
					`last_name`,
					`gender`,
					`password`,
					`born`
		  FROM 		`users` 
		  WHERE 	`email` = ? 
		  AND   	`valid` = 1
		  LIMIT 1";

$db = new Database();

$result = $db->execute($query, array($args['email']));

$db = null;

if (is_null($result))
	Util::setError("Felhasználó nem létezik ezen az e-mail címen!");

$result = $result[0];

if ($result['password'] !== $args['password'])
	Util::setError("Helytelen jelszó!");

unset($result['password']);

Util::setResponse($result);
