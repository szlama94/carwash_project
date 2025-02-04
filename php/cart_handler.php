<?php
session_start();
require_once("../../common/php/environment.php");

// Kérések kezelése
$args = Util::getArgs();
$action = $args['action'] ?? null;

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

switch ($action) {
    case 'add':
        $package = $data['package'] ?? null;
        if ($package) {
            $_SESSION['cart'][] = $package;
            Util::setResponse([
                'success' => true,
                'data' => [
                    'cart' => $_SESSION['cart'],
                    'message' => 'Csomag hozzáadva a kosárhoz!'
                ],
                'error' => null
            ]);
        } else {
            Util::setResponse([
                'success' => false,
                'data' => null,
                'error' => 'Csomag adatok hiányoznak!'
            ]);
        }
        break;

    case 'remove':
        $packageId = $args['package_id'] ?? null;
        if ($packageId !== null) {
            $_SESSION['cart'] = array_filter($_SESSION['cart'], function ($pkg) use ($packageId) {
                return $pkg['id'] !== $packageId;
            });
            Util::setResponse([
                'success' => true,
                'message' => 'Csomag eltávolítva a kosárból!',
                'cart' => $_SESSION['cart']
            ]);
        } else {
            Util::setError('Nincs megadva csomag azonosító!');
        }
        break;

    case 'get':
        Util::setResponse([
            'success' => true,
            'cart' => $_SESSION['cart']
        ]);
        break;

    default:
        Util::setError('Ismeretlen művelet!');
        break;
}
