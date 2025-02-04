<?php
session_start();
require_once("../../common/php/environment.php");

// Kérések kezelése
$args = Util::getArgs();
$action = $args['action'] ?? null;

// Inicializáljuk a kosarat, ha még nincs beállítva
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

switch ($action) {
    case 'add':
        $package = $args['package'] ?? null;
        if ($package) {
            $_SESSION['cart'][] = $package;
            Util::setResponse([
                'success' => true,
                'data' => [
                    'cart' => $_SESSION['cart'],
                    'message' => 'Csomag hozzáadva a kosárhoz!'
                ]
            ]);
        } else {
            Util::setResponse([
                'success' => false,
                'error' => 'Csomag adatok hiányoznak!'
            ]);
        }
        break;

    case 'remove':
        $packageId = $args['package_id'] ?? null;
        if ($packageId !== null) {
            // Szűrjük ki az eltávolítandó csomagot
            $_SESSION['cart'] = array_values(array_filter($_SESSION['cart'], function ($pkg) use ($packageId) {
                return $pkg['id'] !== $packageId;
            }));
            Util::setResponse([
                'success' => true,
                'data' => [
                    'cart' => $_SESSION['cart'],
                    'message' => 'Csomag eltávolítva a kosárból!'
                ]
            ]);
        } else {
            Util::setResponse([
                'success' => false,
                'error' => 'Nincs megadva csomag azonosító!'
            ]);
        }
        break;

    case 'get':
        Util::setResponse([
            'success' => true,
            'data' => [
                'cart' => $_SESSION['cart']
            ]
        ]);
        break;

    default:
        Util::setResponse([
            'success' => false,
            'error' => 'Ismeretlen művelet!'
        ]);
        break;
}
