-- phpMyAdmin SQL Dump
-- version 3.5.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 02, 2014 at 08:25 PM
-- Server version: 5.5.40-36.1
-- PHP Version: 5.4.23

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `boknows_hex`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `salt` char(16) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `gameQueue` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=9 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `salt`, `email`, `gameQueue`) VALUES
(1, 'bo_knows', 'ffe62e8fd5f46f83e9e8128a6da2c2664803acb7c3991553624435235a694e56', '3e3e9a66aad3975', 'lawrence.boland@gmail.com', '[{"gameID":1,"status":"accepted"},{"gameID":2,"status":"accepted"}]'),
(4, 'bo_knows2', '9227a7588debeee8d0f86373b80664b048363e5994fb0052ea061aba0f3aae82', '3eabdeb87cb067e', 'bo_knows@cfiresim.com', ''),
(5, 'bo_knows3', '30035d6d2b2c922e472bf943e5a150b048f90616425412257f4e4d097188514d', '2c7393686e47b439', 'bo_knows3@cfiresim.com', ''),
(7, 'Silver', '60b60076fbb142830e9db9b8ea60954839ca760e12c07bf3c0accadf64a7a195', '486cfab46ccb9ab1', 'mwhite23@vt.edu', ''),
(8, 'mskinner', '67397e99549c5ea30888e9148cb1fa23de060f658a3cf8786430956e86c97dc3', '53185e89300f5212', 'marlon.s.skinner@gmail.com', '[{"gameID":1,"status":"accepted"},{"gameID":2,"status":"accepted"}]');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
