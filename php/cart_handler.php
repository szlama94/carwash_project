<?php
session_start();
require_once("./environment.php");  

// Adatok lekérése
$args = Util::getArgs();
$action = $args['action'] ?? '';

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

switch ($action) {
    case 'add':
        $package = $data['package'] ?? null;
        if ($package) {
            $_SESSION['cart'][] = $package;
            Util::setResponse([
                'message' => 'Csomag hozzáadva a kosárhoz!',
                'cart' => $_SESSION['cart']
            ]);
        } else {
            Util::setError('Csomag adatok hiányoznak!');
        }
        break;
    

    case 'remove':
        $packageId = $args['package_id'] ?? null;
        if ($packageId !== null) {
            $_SESSION['cart'] = array_filter($_SESSION['cart'], function ($pkg) use ($packageId) {
                return $pkg['id'] !== $packageId;
            });
            Util::setResponse(['message' => 'Csomag eltávolítva!', 'cart' => $_SESSION['cart']]);
        } else {
            Util::setError('Nincs megadva csomag azonosító!');
        }
        break;

    case 'get':
        Util::setResponse(['data' => $_SESSION['cart']]);
        break;

    default:
        Util::setError('Ismeretlen művelet!');
        break;
}
