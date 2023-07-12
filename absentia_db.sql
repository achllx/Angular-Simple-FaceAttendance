-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 12, 2023 at 05:20 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `absentia_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `agency`
--

CREATE TABLE `agency` (
  `agency_id` varchar(255) NOT NULL,
  `agency_name` varchar(255) NOT NULL,
  `latitude` text NOT NULL,
  `longitude` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agency`
--

INSERT INTO `agency` (`agency_id`, `agency_name`, `latitude`, `longitude`) VALUES
('absentia', 'Absentia', '-6.292944483273201,-6.292951148391189,-6.293003802820188,-6.2930078018905276', '106.64298158619563,106.64301511380626,106.64302181932835,106.6429909739266'),
('rumahfred', 'Rumah Frederico', '-6.155227917969536,-6.15531909322543,-6.155327814336047,-6.155235053424908', '106.80641088854168,106.80639892715975,106.80651933840444,106.80652412295721'),
('undefined', 'undefined', '1', '1');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `attend_id` int(13) NOT NULL,
  `user_id` int(13) NOT NULL,
  `clock_in` datetime(6) DEFAULT NULL,
  `clock_out` datetime(6) DEFAULT NULL,
  `attend_date` date NOT NULL,
  `timeliness` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`attend_id`, `user_id`, `clock_in`, `clock_out`, `attend_date`, `timeliness`) VALUES
(44, 1000, '2023-06-13 09:35:59.000000', '2023-06-13 18:35:59.000000', '2023-06-13', 80),
(45, 12030, '2023-06-13 08:30:00.000000', '2023-06-13 17:35:59.000000', '2023-06-13', 100),
(46, 12031, '2023-06-13 08:30:00.000000', '2023-06-13 17:46:18.000000', '2023-06-13', 100),
(47, 1000, '2023-06-14 08:30:00.000000', '2023-06-14 17:46:18.000000', '2023-06-14', 100),
(48, 12030, '2023-06-14 09:46:18.000000', '2023-06-14 18:46:18.000000', '2023-06-14', 80),
(49, 12031, '2023-06-14 09:46:18.000000', '2023-06-14 18:46:18.000000', '2023-06-14', 80),
(51, 1000, '2023-06-15 14:10:45.594000', '2023-06-15 14:12:29.240000', '2023-06-15', 60),
(52, 12030, '2023-07-12 20:59:35.134000', '2023-07-12 21:02:00.788000', '2023-07-12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(13) NOT NULL,
  `user_agency_id` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_status` varchar(255) NOT NULL,
  `user_role` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_picture` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_agency_id`, `user_password`, `user_name`, `user_status`, `user_role`, `user_email`, `user_picture`) VALUES
(1000, 'absentia', '111111', 'Admin Marchel', 'admin', 'admin absentia', 'marchel@student.president.ac.id', 'AdminMarchel'),
(12030, 'absentia', '111111', 'Vincent', 'intern', 'intern', 'vincent@student.president.ac.id', 'Vincent'),
(12031, 'absentia', '111111', 'Frederico', 'admin', 'admin', 'frederico@student.president.ac.id', 'Frederico');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agency`
--
ALTER TABLE `agency`
  ADD PRIMARY KEY (`agency_id`),
  ADD UNIQUE KEY `agency_name` (`agency_name`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attend_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_email` (`user_email`),
  ADD KEY `user_agency_id` (`user_agency_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `attend_id` int(13) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(13) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12032;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`user_agency_id`) REFERENCES `agency` (`agency_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
