<?php
declare(strict_types=1);

require_once("./environment.php");

// Set SQL command
$query= "SELECT `id`, 
								`type`, 
								`first_name`, 
								`last_name`, 
								`middle_name`, 
								`born`, 
								`gender`, 
								`country`, 
								`country_code`, 
								`phone`, 
								`city`, 
								`postcode`, 
								`address`, 
								`email`, 
								`year`, 
								`profession`, 
								`class`, 
								`valid` 
		 FROM `users`;";


$db = new Database();

$result = $db->execute($query);

$db = null;

Util::setResponse($result);