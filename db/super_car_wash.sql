-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Máj 11. 17:14
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `super_car_wash`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `bookings`
--

CREATE TABLE `bookings` (
  `id` int(10) NOT NULL,
  `user_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `vehicle_plate` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `booking_date`, `vehicle_plate`, `created_at`) VALUES
(45, 17, '2025-06-03', 'AM-JM-423', '2025-04-05 16:28:14'),
(46, 63, '2025-05-15', 'CE-RR-543', '2025-04-05 12:28:48'),
(47, 56, '2025-05-19', 'ALJ-676', '2025-04-05 19:37:41'),
(48, 19, '2025-05-13', 'ARO-315', '2025-04-05 16:13:26'),
(49, 19, '2025-05-03', 'RN-ZT-504', '2025-04-05 12:40:14'),
(50, 69, '2025-05-06', 'JZE-549', '2025-04-05 12:48:45'),
(51, 86, '2025-06-05', 'LSH-082', '2025-04-05 18:45:00'),
(52, 34, '2025-05-02', 'HAY-192', '2025-04-05 12:41:47'),
(53, 75, '2025-05-12', 'PBM-485', '2025-04-05 08:28:06'),
(54, 46, '2025-05-29', 'PH-AN-993', '2025-04-05 16:06:42'),
(55, 44, '2025-05-14', 'FB-AX-104', '2025-04-05 11:10:38'),
(56, 74, '2025-06-09', 'SY-PJ-959', '2025-04-05 11:16:37'),
(57, 53, '2025-05-31', 'HWQ-774', '2025-04-05 14:50:42'),
(58, 59, '2025-05-23', 'FN-EK-138', '2025-04-05 12:57:46'),
(59, 36, '2025-05-28', 'PHQ-227', '2025-04-05 13:59:59'),
(60, 13, '2025-05-01', 'KJF-586', '2025-04-05 13:09:34'),
(61, 2, '2025-06-12', 'CK-MM-718', '2025-04-05 11:52:05'),
(62, 85, '2025-05-30', 'TV-BP-209', '2025-04-05 19:15:48'),
(63, 25, '2025-05-27', 'PS-ZX-734', '2025-04-05 09:53:56'),
(64, 57, '2025-05-16', 'ZV-EQ-019', '2025-04-05 19:23:28'),
(65, 10, '2025-05-24', 'VV-XN-082', '2025-04-05 15:25:55'),
(66, 84, '2025-05-17', 'KR-HD-440', '2025-04-05 16:16:09'),
(67, 12, '2025-06-11', 'EZ-MI-513', '2025-04-05 11:00:38'),
(68, 76, '2025-05-09', 'PS-HU-775', '2025-04-05 08:52:44'),
(69, 61, '2025-06-10', 'XY-YE-189', '2025-04-05 13:12:29'),
(70, 28, '2025-06-02', 'OPP-215', '2025-04-05 15:45:00'),
(71, 32, '2025-05-05', 'FR-RQ-582', '2025-04-05 17:19:48'),
(72, 31, '2025-05-22', 'RDM-933', '2025-04-05 10:37:13'),
(73, 47, '2025-05-10', 'MC-RX-741', '2025-04-05 09:05:22'),
(74, 43, '2025-05-07', 'TGU-026', '2025-04-05 08:22:37'),
(75, 21, '2025-06-13', 'XR-PU-679', '2025-04-05 10:16:00'),
(76, 39, '2025-05-08', 'KLC-700', '2025-04-05 11:30:48'),
(77, 16, '2025-06-04', 'BX-ZZ-335', '2025-04-05 17:02:05'),
(78, 45, '2025-05-21', 'ZRA-581', '2025-04-05 13:24:41'),
(79, 4, '2025-05-20', 'JAX-054', '2025-04-05 10:44:59'),
(80, 77, '2025-05-18', 'YV-AD-093', '2025-04-05 12:01:45'),
(81, 83, '2025-05-25', 'UQQ-876', '2025-04-05 19:08:12'),
(82, 88, '2025-05-04', 'FZ-XA-366', '2025-04-05 09:49:33'),
(83, 70, '2025-06-06', 'DFO-973', '2025-04-05 08:04:07'),
(84, 26, '2025-05-27', 'JKI-720', '2025-04-05 15:58:39'),
(85, 24, '2025-05-30', 'JRA-612', '2025-04-05 10:12:18'),
(86, 11, '2025-06-14', 'KA-NV-047', '2025-04-05 14:30:11'),
(87, 1, '2025-05-26', 'AJL-902', '2025-04-05 11:29:25'),
(88, 14, '2025-05-11', 'KQ-FW-129', '2025-04-05 08:31:31'),
(89, 35, '2025-06-07', 'WE-DR-032', '2025-04-05 18:10:55'),
(90, 38, '2025-05-31', 'UN-KL-624', '2025-04-05 17:25:00'),
(91, 5, '2025-06-03', 'QKX-214', '2025-04-05 19:11:34'),
(92, 51, '2025-06-05', 'ZHZ-430', '2025-04-05 14:39:12'),
(93, 8, '2025-06-13', 'AA-ZX-114', '2025-04-05 17:45:28'),
(94, 23, '2025-06-15', 'YJ-PW-630', '2025-04-05 10:05:14'),
(95, 40, '2025-06-05', 'JVG-124', '2025-05-11 15:05:28'),
(96, 40, '2025-06-07', 'JVG-124', '2025-05-11 15:05:46'),
(97, 33, '2025-06-11', 'ABC123', '2025-05-11 15:06:56'),
(98, 38, '2025-06-05', 'pem456', '2025-05-11 15:08:03'),
(99, 40, '2025-06-04', 'JVG-122', '2025-05-11 15:08:55');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `bookings_row`
--

CREATE TABLE `bookings_row` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `booking_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `bookings_row`
--

INSERT INTO `bookings_row` (`id`, `booking_id`, `service_id`, `booking_time`) VALUES
(67, 45, 6, '13:00:00'),
(68, 46, 12, '09:00:00'),
(69, 47, 3, '13:00:00'),
(70, 48, 9, '14:00:00'),
(71, 49, 7, '10:00:00'),
(72, 50, 6, '15:00:00'),
(73, 51, 8, '17:00:00'),
(74, 52, 5, '17:00:00'),
(75, 53, 6, '17:00:00'),
(76, 54, 8, '14:00:00'),
(77, 55, 1, '14:00:00'),
(78, 56, 1, '10:00:00'),
(79, 57, 8, '09:00:00'),
(80, 58, 5, '09:00:00'),
(81, 59, 9, '14:00:00'),
(82, 60, 8, '10:00:00'),
(83, 61, 5, '09:00:00'),
(84, 62, 1, '08:00:00'),
(85, 63, 7, '13:00:00'),
(86, 64, 3, '16:00:00'),
(87, 65, 11, '08:00:00'),
(88, 66, 12, '08:00:00'),
(89, 67, 4, '15:00:00'),
(90, 68, 3, '10:00:00'),
(91, 69, 1, '17:00:00'),
(92, 70, 2, '08:00:00'),
(93, 71, 9, '17:00:00'),
(94, 72, 10, '15:00:00'),
(95, 73, 12, '11:00:00'),
(96, 74, 1, '10:00:00'),
(97, 75, 6, '10:00:00'),
(98, 76, 4, '16:00:00'),
(99, 77, 6, '10:00:00'),
(100, 78, 11, '10:00:00'),
(101, 79, 12, '12:00:00'),
(102, 80, 9, '14:00:00'),
(103, 81, 10, '10:00:00'),
(104, 82, 5, '08:00:00'),
(105, 83, 12, '14:00:00'),
(106, 84, 3, '17:00:00'),
(107, 85, 11, '10:00:00'),
(108, 86, 5, '16:00:00'),
(109, 87, 2, '13:00:00'),
(110, 88, 3, '10:00:00'),
(111, 89, 11, '16:00:00'),
(112, 90, 7, '14:00:00'),
(113, 91, 6, '11:00:00'),
(114, 92, 5, '13:00:00'),
(115, 93, 7, '12:00:00'),
(116, 94, 5, '17:00:00'),
(117, 95, 2, '15:00:00'),
(118, 95, 3, '16:00:00'),
(119, 96, 4, '08:00:00'),
(120, 97, 8, '08:00:00'),
(121, 97, 9, '09:00:00'),
(122, 98, 11, '08:00:00'),
(123, 98, 12, '09:00:00'),
(124, 99, 2, '12:00:00'),
(125, 99, 1, '13:00:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `gender` char(1) NOT NULL,
  `age` int(3) NOT NULL,
  `comment` text NOT NULL,
  `rating` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `user_id`, `last_name`, `first_name`, `gender`, `age`, `comment`, `rating`) VALUES
(1, 40, 'Szlama', 'Bence', 'M', 31, '\"Olyan tiszta lett az autóm, hogy most a szomszédok napszemüvegben nézik! 😎✨\"', 5),
(2, 38, 'Sárkány', 'János', 'M', 33, '\"Nem mondom, hogy koszos maradt, de még mindig el tudom olvasni a porban írt \'MOSS LE\' feliratot. 📝🚘\" ', 3),
(3, 33, 'Alföldi', 'Roland', 'M', 34, '\"Jó lett, de a kávéautomatát jobban tisztították, mint az autómat. 😅\"', 4),
(4, 34, 'Bézi', 'Katalin', 'F', 35, '\"Majdnem olyan csillogó, mint a körmöm, de még van hova fejlődni! 💅✨\"\r\n', 4);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `services_name` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `price` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `services`
--

INSERT INTO `services` (`id`, `services_name`, `description`, `price`) VALUES
(1, 'exterior_wash', 'description1', 11990),
(2, 'interior_clean', 'description2', 11990),
(3, 'extra_polishing', 'description3', 14990),
(4, 'upholstery_cleaning', 'description4', 14990),
(5, 'ceramic_coating', 'description5', 49990),
(6, 'engine_wash', 'description6', 19990),
(7, 'quick_wash', 'description7', 11990),
(8, 'wax_coating', 'description8', 24990),
(9, 'rim_cleaning', 'description9', 19990),
(10, 'full_cleaning', 'description10', 64990),
(11, 'windshield_polishing', 'description11', 22990),
(12, 'sticker_removal', 'description12', 9990);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `types`
--

CREATE TABLE `types` (
  `id` char(1) NOT NULL,
  `type` varchar(10) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `types`
--

INSERT INTO `types` (`id`, `type`, `name`) VALUES
('F', 'GENDER', 'female'),
('M', 'GENDER', 'male'),
('A', 'USER', 'administrator'),
('U', 'USER', 'user');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `type` char(1) NOT NULL DEFAULT 'U',
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `born` date DEFAULT NULL,
  `gender` char(1) NOT NULL,
  `img` blob DEFAULT NULL,
  `img_type` varchar(100) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `country_code` varchar(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `postcode` varchar(20) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL,
  `valid` tinyint(1) UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `type`, `first_name`, `last_name`, `born`, `gender`, `img`, `img_type`, `country`, `country_code`, `phone`, `city`, `postcode`, `address`, `email`, `password`, `valid`) VALUES
(1, 'U', 'Dániel', 'Aranyosi', '2005-07-31', 'M', NULL, NULL, 'Románia', NULL, NULL, NULL, NULL, NULL, 'aranyosi.daniel-2020@keri.mako.hu', '1234Aa', 1),
(2, 'U', 'Balázs', 'Bakai', '2005-10-26', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'bakai.balazs-2020@keri.mako.hu', '1234Aa', 1),
(3, 'U', 'Lehel', 'Balázs', '2005-09-19', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'balazs.lehel-2020@keri.mako.hu', '1234Aa', 1),
(4, 'U', 'István', 'Ballai', '2005-11-20', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ballai.istvanattila-2020@keri.mako.hu', '1234Aa', 1),
(5, 'U', 'Szabolcs', 'Benkő', '2006-02-16', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'benko.szabolcs-2020@keri.mako.hu', '1234Aa', 1),
(6, 'U', 'Bonifác', 'Burunkai', '2005-06-02', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'burunkai.bonifac-2020@keri.mako.hu', '1234Aa', 1),
(7, 'U', 'Márió', 'Csontos', '2005-10-07', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'csontos.mariodavid-2020@keri.mako.hu', '1234Aa', 1),
(8, 'U', 'István', 'Erdei', '2005-12-12', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'erdei.istvan-2020@keri.mako.hu', '1234Aa', 1),
(9, 'U', 'Kristóf', 'Fehér', '2004-11-13', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'feher.kristoflaszlo-2020@keri.mako.hu', '1234Aa', 1),
(10, 'U', 'Bálint', 'Gulyás', '2005-11-30', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'gulyas.balintjanos-2020@keri.mako.hu', '1234Aa', 1),
(11, 'U', 'Rómeó', 'Hadobás', '2005-11-29', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'hadobas.romeogabor-2020@keri.mako.hu', '1234Aa', 1),
(12, 'U', 'Máté', 'Hegedűs', '2005-07-28', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'hegedus.mate-2020@keri.mako.hu', '1234Aa', 1),
(13, 'U', 'Ákos', 'Jernei', '2005-05-11', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'jernei.akos-2020@keri.mako.hu', '1234Aa', 1),
(14, 'U', 'Balázs', 'Lakatos', '2005-06-20', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'lakatos.balazs-2020@keri.mako.hu', '1234Aa', 1),
(15, 'U', 'Richárd', 'Lewis', '2005-03-27', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'lewis.richardnoel-2020@keri.mako.hu', '1234Aa', 1),
(16, 'U', 'Csaba', 'Löffler', '2005-07-12', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'loffler.csaba-2020@keri.mako.hu', '1234Aa', 0),
(17, 'U', 'Brendon', 'Nagy', '2005-10-26', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'nagy.brendon-2020@keri.mako.hu', '1234Aa', 1),
(18, 'U', 'Raul', 'Nagy', '2005-04-06', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'nagy.raul-2020@keri.mako.hu', '1234Aa', 1),
(19, 'U', 'Dániel', 'Nyári', '2005-07-20', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'nyari.daniel-2020@keri.mako.hu', '1234Aa', 0),
(20, 'U', 'Bence', 'Prágai', '2005-07-06', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pragai.bence-2020@keri.mako.hu', '1234Aa', 1),
(21, 'U', 'Ákos', 'Rácz', '2005-06-17', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'racz.akoscsaba-2020@keri.mako.hu', '1234Aa', 1),
(22, 'U', 'Csaba', 'Selmeczi', '2005-02-11', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'selmeczi.csaba-2020@keri.mako.hu', '1234Aa', 1),
(23, 'U', 'Gellért', 'Simon', '2005-11-27', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'simon.gellertmate-2020@keri.mako.hu', '1234Aa', 1),
(24, 'U', 'Krisztián', 'Szabó', '2005-06-29', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szabo.krisztian-2020@keri.mako.hu', '1234Aa', 1),
(25, 'U', 'Krisztián', 'Szabó', '2005-11-02', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szabo.krisztianjanos-2020@keri.mako.hu', '1234Aa', 1),
(26, 'U', 'Tamás', 'Szabó', '2005-10-16', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szabo.tamas-2020@keri.mako.hu', '1234Aa', 1),
(27, 'U', 'Tamás', 'Szalma', '2005-06-01', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szalma.tamas-2020@keri.mako.hu', '1234Aa', 1),
(28, 'U', 'Zsanett', 'Szeder', '2006-05-27', 'F', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szeder.zsanett-2020@keri.mako.hu', '1234Aa', 0),
(29, 'U', 'Ádám', 'Széll', '2006-04-27', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szell.adam-2020@keri.mako.hu', '1234Aa', 1),
(30, 'U', 'Máté', 'Tóth', '2005-09-01', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'toth.mate-2020@keri.mako.hu', '1234Aa', 1),
(31, 'U', 'Izabella', 'Tóth-Kása', '2005-05-10', 'F', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'toth-kasa.izabella-2020@keri.mako.hu', '1234Aa', 1),
(32, 'U', 'Marcell', 'Vékony', '2003-12-27', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'vekony.marcell-2020@keri.mako.hu', '1234Aa', 1),
(33, 'U', 'Roland', 'Alföldi', '1991-01-23', 'M', NULL, NULL, 'Magyarország', '+36', '701236589', 'Szeged', '6720', 'Bocskai utca 43.', 'alfoldi.roland-2023@keri.mako.hu', '1234Aa', 1),
(34, 'U', 'Katalin', 'Bézi', '1990-03-14', 'F', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'bezi.katalin-2023@keri.mako.hu', '1234Aa', 1),
(35, 'U', 'Dániel', 'Cseh', '2002-05-06', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'cseh.daniel-2023@keri.mako.hu', '1234Aa', 1),
(36, 'U', 'Pál', 'Kondacs', '1989-03-08', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kondacs.pal-2023@keri.mako.hu', '1234Aa', 1),
(37, 'U', 'Zsolt', 'Nagy', '1970-04-19', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'nagy.zsolt-2023@keri.mako.hu', '1234Aa', 1),
(38, 'U', 'János', 'Sárkány', '1991-12-05', 'M', NULL, NULL, 'Magyarország', '+36', '307432310', 'Makó', '6900', 'Lisztes utca 45.', 'sarkany.janos-2023@keri.mako.hu', '1234Aa', 1),
(39, 'U', 'Eszter', 'Szabó-Juhász', '1990-01-20', 'F', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szabo-juhasz.eszter-2023@keri.mako.hu', '1234Aa', 1),
(40, 'A', 'Bence', 'Szlama', '1994-02-14', 'M', NULL, NULL, 'Magyarország', '+36', '704319806', 'Makó', '6900', 'Bajcsy-Zsilinszky ltp. B1/C lph. 3/1', 'szlama.bence-2023@keri.mako.hu', '1234Aa', 1),
(41, 'U', 'Dániel', 'Badó-Gulácsi', NULL, 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'bado-gulac.daniel-2021@keri.mako.hu\r', '1234Aa', 1),
(42, 'U', 'Barnabás', 'Berta', '2006-04-05', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'berta.barnabas-2021@keri.mako.hu\r', '1234Aa', 1),
(43, 'U', 'Richárd', 'Bokor', '2006-07-08', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'bokor.richard-2021@keri.mako.hu\r', '1234Aa', 1),
(44, 'U', 'Benedek', 'Dani', '2006-09-11', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'dani.benedek-2021@keri.mako.hu\r', '1234Aa', 1),
(45, 'U', 'Zoltán', 'Döme', '2006-10-29', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'dome.zoltan-2021@keri.mako.hu\r', '1234Aa', 1),
(46, 'U', 'Balázs', 'Esser', NULL, 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'esser.balazs-2021@keri.mako.hu\r', '1234Aa', 1),
(47, 'U', 'Adrián', 'Fodor', '2006-04-05', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'fodor.adrian-2021@keri.mako.hu\r', '1234Aa', 1),
(48, 'U', 'Bence', 'Guvat', '2006-08-25', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'guvat.bence-2021@keri.mako.hu\r', '1234Aa', 1),
(49, 'U', 'Máté', 'Herczeg', '2006-03-17', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'herczeg.mate-2021@keri.mako.hu\r', '1234Aa', 1),
(50, 'U', 'Zoltán', 'Kardos', '2006-08-13', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kardos.zoltan-2021@keri.mako.hu\r', '1234Aa', 1),
(51, 'U', 'David', 'Kis', '2006-12-21', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kis.david-2021@keri.mako.hu\r', '1234Aa', 1),
(52, 'U', 'Marcell', 'Kis', '2007-03-24', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kis.marcell-2021@keri.mako.hu\r', '1234Aa', 1),
(53, 'U', 'Alexandra', 'Kneip', NULL, 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kneip.alexandr-2021@keri.mako.hu\r', '1234Aa', 1),
(54, 'U', 'Henrik', 'Knoch', NULL, 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'knoch.henrik-2021@keri.mako.hu\r', '1234Aa', 1),
(55, 'U', 'Balázs', 'Kriván', '2006-11-03', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'krivan.balazs-2021@keri.mako.hu\r', '1234Aa', 1),
(56, 'U', 'Tamás', 'Kulcsár', NULL, 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kulcsar.tamas-2021@keri.mako.hu\r', '1234Aa', 1),
(57, 'U', 'Martin', 'Miklós', '2006-05-25', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'miklos.martin-2021@keri.mako.hu\r', '1234Aa', 1),
(58, 'U', 'Zsigmond', 'Oláh', NULL, 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'olah.zsigmond-2021@keri.mako.hu\r', '1234Aa', 1),
(59, 'U', 'Csanád', 'Paku', '2006-05-30', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paku.csanad-2021@keri.mako.hu\r', '1234Aa', 1),
(60, 'U', 'Norbert', 'Répa', '2006-08-25', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'repa.norbert-2021@keri.mako.hu\r', '1234Aa', 1),
(61, 'U', 'Ármin', 'Sötét', '2006-09-30', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sotet.armin-2021@keri.mako.hu\r', '1234Aa', 1),
(62, 'U', 'Benjámin', 'Suba', NULL, 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'suba.benjamin-2021@keri.mako.hu\r', '1234Aa', 1),
(63, 'U', 'Ádám', 'Suhajda', NULL, 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'suhajda.adam-2021@keri.mako.hu\r', '1234Aa', 1),
(64, 'U', 'Dominik', 'Szabados', NULL, 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szabados.dominik-2021@keri.mako.hu\r', '1234Aa', 1),
(65, 'U', 'Bence', 'Szabó', '2007-05-16', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szabo.bence-2021@keri.mako.hu\r', '1234Aa', 1),
(66, 'U', 'László', 'Szalontai', '2007-01-02', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szalontai.laszlo-2021@keri.mako.hu\r', '1234Aa', 1),
(67, 'U', 'Péter', 'Szántó', NULL, 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szanto.peter-2021@keri.mako.hu\r', '1234Aa', 1),
(68, 'U', 'Máté', 'Szélpál', NULL, 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szelpal.mate-2021@keri.mako.hu\r', '1234Aa', 1),
(69, 'U', 'Martin', 'Szőke', NULL, 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szoke.martin-2021@keri.mako.hu\r', '1234Aa', 1),
(70, 'U', 'Ádám', 'Tokai', '2006-03-06', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'tokai.adam-2021@keri.mako.hu\r', '1234Aa', 1),
(71, 'U', 'Dzsenifer', 'Tóth', '2006-10-09', 'F', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'toth.dzsenife-2021@keri.mako.hu\r', '1234Aa', 1),
(72, 'U', 'László', 'Tóth', '2006-06-26', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'toth.laszlo-2021@keri.mako.hu', '1234Aa', 1),
(73, 'A', 'Attila', 'Ódry', '1964-03-08', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'odry.attila@keri.mako.hu', '1234Aa', 1),
(77, 'U', 'Zsolt', 'Lantos', '1975-02-22', 'M', NULL, NULL, 'Magyarország', NULL, '6704319805', 'Makó', '6900', 'Bajcsy-Zsilinszky Ltp. B1/C 3.Em\n10.A', 'lantos.zsolt@gmail.com', '1234Aa', 1),
(84, 'U', 'Zoltán', 'Dávid', '1969-03-16', 'M', NULL, NULL, 'Magyarország', '+36', '7012323456', 'Makó', '6900', 'Gerizdes utca 20.', 'z.z@gmail.com', '1234Aa', 1),
(85, 'U', 'Levente', 'Kovács', '1998-02-13', 'M', NULL, NULL, 'Magyarország', '+36', '705555555', 'Szeged', '6721', 'Bajza utca 16/b', 'k.levi@gmail.com', '1234Aa', 1),
(86, 'U', 'Csaba', 'Kovács', '1984-04-12', 'M', NULL, NULL, 'Magyarország', '+36', '703458956', 'Makó', '6900', 'Bajza Utca 16/b', 'k.csba@gmail.com', '1234Aa', 1),
(87, 'U', 'Gábor', 'Kiss', '1995-03-14', 'M', NULL, NULL, NULL, '+36', '708593214', NULL, NULL, NULL, 'k-gergely@gmail.com', '1234Aa', 1);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `bookings_row`
--
ALTER TABLE `bookings_row`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `services_name` (`services_name`,`price`);

--
-- A tábla indexei `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`type`,`id`) USING BTREE;

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`) USING BTREE,
  ADD KEY `first_name` (`first_name`,`last_name`),
  ADD KEY `last_name` (`last_name`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT a táblához `bookings_row`
--
ALTER TABLE `bookings_row`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT a táblához `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
