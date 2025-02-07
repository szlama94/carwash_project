-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Feb 07. 16:55
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
  `date` date NOT NULL,
  `time` time NOT NULL,
  `package` varchar(255) NOT NULL,
  ` vehicle_plate` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `gender` char(1) NOT NULL,
  `age` int(3) NOT NULL,
  `comment` text NOT NULL,
  `rating` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `feedback`
--

INSERT INTO `feedback` (`id`, `name`, `gender`, `age`, `comment`, `rating`) VALUES
(1, 'Porszívó Pista\r\n', 'M', 37, '\"Olyan tiszta lett az autóm, hogy most a szomszédok napszemüvegben nézik! 😎✨\"\r\n', 5),
(2, 'Guminyom Gábor\r\n', 'M', 40, '\"Nem mondom, hogy koszos maradt, de még mindig el tudom olvasni a porban írt \'MOSS LE\' feliratot. 📝🚘\"', 3),
(3, 'Béres Virág\r\n', 'F', 24, '\"Majdnem olyan csillogó, mint a körmöm, de még van hova fejlődni! 💅✨\"', 4),
(4, 'Szél Zsuzsi\r\n', 'F', 29, '\"Jó lett, de a kávéautomatát jobban tisztították, mint az autómat. 😅\"', 3),
(23, 'Pötyi', 'F', 23, 'jojo', 4);

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
(33, 'U', 'Roland', 'Alföldi', '1991-01-23', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'alfoldi.roland-2023@keri.mako.hu', '1234Aa', 1),
(34, 'U', 'Katalin', 'Bézi', '1990-03-14', 'F', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'bezi.katalin-2023@keri.mako.hu', '1234Aa', 1),
(35, 'U', 'Dániel', 'Cseh', '2002-05-06', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'cseh.daniel-2023@keri.mako.hu', '1234Aa', 1),
(36, 'U', 'Pál', 'Kondacs', '1989-03-08', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'kondacs.pal-2023@keri.mako.hu', '1234Aa', 1),
(37, 'U', 'Zsolt', 'Nagy', '1970-04-19', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'nagy.zsolt-2023@keri.mako.hu', '1234Aa', 1),
(38, 'U', 'János', 'Sárkány', '1991-12-05', 'M', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sarkany.janos-2023@keri.mako.hu', '1234Aa', 1),
(39, 'U', 'Eszter', 'Szabó-Juhász', '1990-01-20', 'F', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'szabo-juhasz.eszter-2023@keri.mako.hu', '1234Aa', 1),
(40, 'U', 'Bence', 'Szlama', '1994-02-14', 'M', NULL, NULL, 'Magyarország', NULL, '704319806', 'Makó', '6900', 'Bajcsy-Zsilinszky ltp. B1/C lph. 3/1', 'szlama.bence-2023@keri.mako.hu', '1234Aa', 1),
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
(85, 'U', 'Levente', 'Kovács', '1998-02-13', 'M', NULL, NULL, 'Magyarország', '+36', '705555555', 'Szeged', '6721', 'Bajza utca 16/b', 'k.levi@gmail.com', '1234Aa', 1);

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
-- A tábla indexei `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `services_name` (`services_name`,`price`);

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
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT a táblához `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
