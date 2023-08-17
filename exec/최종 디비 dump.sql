-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: 13.125.238.163    Database: damda
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cirteria_day`
--

DROP TABLE IF EXISTS `cirteria_day`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cirteria_day` (
  `day_no` bigint NOT NULL AUTO_INCREMENT,
  `criteria_id` bigint NOT NULL,
  `day_kor` varchar(50) NOT NULL,
  `day_en` varchar(50) NOT NULL,
  PRIMARY KEY (`day_no`),
  KEY `FK_cirteria_day_TO_timecapsule_criteria_1` (`criteria_id`),
  CONSTRAINT `FK_cirteria_day_TO_timecapsule_criteria_1` FOREIGN KEY (`criteria_id`) REFERENCES `timecapsule_criteria` (`criteria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `email_send_log`
--

DROP TABLE IF EXISTS `email_send_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_send_log` (
  `email_send_log_no` bigint NOT NULL AUTO_INCREMENT,
  `user_no` bigint NOT NULL,
  `email` varchar(50) NOT NULL,
  `verification_code` varchar(50) NOT NULL,
  `create_time` timestamp NOT NULL,
  `expiry_time` timestamp NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`email_send_log_no`),
  KEY `FK_user_TO_email_send_log_1` (`user_no`),
  CONSTRAINT `FK_user_TO_email_send_log_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `item_details`
--

DROP TABLE IF EXISTS `item_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_details` (
  `item_details_no` bigint NOT NULL AUTO_INCREMENT,
  `item_no` bigint NOT NULL,
  `path` varchar(200) NOT NULL,
  PRIMARY KEY (`item_details_no`),
  KEY `FK_items_TO_item_details_1` (`item_no`),
  CONSTRAINT `FK_items_TO_item_details_1` FOREIGN KEY (`item_no`) REFERENCES `items` (`item_no`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items` (
  `item_no` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(50) NOT NULL,
  `price` int NOT NULL DEFAULT '0',
  `icon` varchar(200) NOT NULL,
  `type` varchar(50) NOT NULL,
  PRIMARY KEY (`item_no`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `items_mapping`
--

DROP TABLE IF EXISTS `items_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `items_mapping` (
  `item_mapping_no` bigint NOT NULL AUTO_INCREMENT,
  `user_no` bigint NOT NULL,
  `item_no` bigint NOT NULL,
  PRIMARY KEY (`item_mapping_no`),
  KEY `FK_user_TO_items_mapping_1` (`user_no`),
  KEY `FK_items_TO_items_mapping_1` (`item_no`),
  CONSTRAINT `FK_items_TO_items_mapping_1` FOREIGN KEY (`item_no`) REFERENCES `items` (`item_no`),
  CONSTRAINT `FK_user_TO_items_mapping_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=311 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `kakao_log`
--

DROP TABLE IF EXISTS `kakao_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kakao_log` (
  `kakao_log_no` bigint NOT NULL AUTO_INCREMENT,
  `user_no` bigint NOT NULL,
  `update_time` datetime DEFAULT NULL,
  `access_token` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`kakao_log_no`),
  KEY `user_no` (`user_no`),
  CONSTRAINT `kakao_log_ibfk_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `refresh_token_id` bigint NOT NULL AUTO_INCREMENT,
  `refresh_token` varchar(255) NOT NULL,
  `expiration_date` timestamp NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_no` bigint NOT NULL,
  PRIMARY KEY (`refresh_token_id`),
  KEY `FK_user_TO_refresh_token_1` (`user_no`),
  CONSTRAINT `FK_user_TO_refresh_token_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=223 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `signup_email_log`
--

DROP TABLE IF EXISTS `signup_email_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `signup_email_log` (
  `signup_email_log_no` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `verification_code` varchar(50) NOT NULL,
  `create_time` timestamp NOT NULL,
  `expiry_time` timestamp NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`signup_email_log_no`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `theme`
--

DROP TABLE IF EXISTS `theme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theme` (
  `theme_no` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(50) NOT NULL,
  `price` int NOT NULL DEFAULT '0',
  `icon` varchar(200) NOT NULL,
  PRIMARY KEY (`theme_no`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `theme_detail`
--

DROP TABLE IF EXISTS `theme_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theme_detail` (
  `theme_details_no` bigint NOT NULL AUTO_INCREMENT,
  `theme_no` bigint NOT NULL,
  `path` varchar(200) NOT NULL,
  `type` varchar(30) NOT NULL,
  PRIMARY KEY (`theme_details_no`),
  KEY `FK_theme_TO_theme_detail_1` (`theme_no`),
  CONSTRAINT `FK_theme_TO_theme_detail_1` FOREIGN KEY (`theme_no`) REFERENCES `theme` (`theme_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `theme_mapping`
--

DROP TABLE IF EXISTS `theme_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `theme_mapping` (
  `theme_mapping_no` bigint NOT NULL AUTO_INCREMENT,
  `user_no` bigint NOT NULL,
  `theme_no` bigint NOT NULL,
  PRIMARY KEY (`theme_mapping_no`),
  KEY `FK_user_TO_theme_mapping_1` (`user_no`),
  KEY `FK_theme_TO_theme_mapping_1` (`theme_no`),
  CONSTRAINT `FK_theme_TO_theme_mapping_1` FOREIGN KEY (`theme_no`) REFERENCES `theme` (`theme_no`),
  CONSTRAINT `FK_user_TO_theme_mapping_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=280 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timecapsule`
--

DROP TABLE IF EXISTS `timecapsule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timecapsule` (
  `timecapsule_no` bigint NOT NULL AUTO_INCREMENT,
  `open_date` timestamp NULL DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `title` varchar(45) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `remove_date` timestamp NULL DEFAULT NULL,
  `regist_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `max_file_size` int NOT NULL DEFAULT '500',
  `now_file_size` int NOT NULL DEFAULT '0',
  `max_participant` int NOT NULL DEFAULT '1',
  `now_participant` int NOT NULL DEFAULT '1',
  `invite_code` varchar(45) NOT NULL DEFAULT 'RANDOM',
  `capsule_icon_no` int NOT NULL DEFAULT '1',
  `goal_card` int DEFAULT '0',
  `timecapsule_penalty_no` bigint NOT NULL,
  `criteria_id` bigint NOT NULL,
  PRIMARY KEY (`timecapsule_no`),
  KEY `FK_timecapsule_criteria_TO_timecapsule_1` (`criteria_id`),
  KEY `FK_timecapsule_penalty_TO_timecapsule_1` (`timecapsule_penalty_no`),
  CONSTRAINT `FK_timecapsule_criteria_TO_timecapsule_1` FOREIGN KEY (`criteria_id`) REFERENCES `timecapsule_criteria` (`criteria_id`),
  CONSTRAINT `FK_timecapsule_penalty_TO_timecapsule_1` FOREIGN KEY (`timecapsule_penalty_no`) REFERENCES `timecapsule_penalty` (`timecapsule_penalty_no`)
) ENGINE=InnoDB AUTO_INCREMENT=370 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timecapsule_card`
--

DROP TABLE IF EXISTS `timecapsule_card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timecapsule_card` (
  `timecapsule_card_no` bigint NOT NULL AUTO_INCREMENT,
  `timecapsule_no` bigint NOT NULL,
  `image_path` varchar(500) NOT NULL,
  `user_no` bigint DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`timecapsule_card_no`),
  KEY `FK_timecapsule_TO_timecapsule_card_1` (`timecapsule_no`),
  KEY `user_no` (`user_no`),
  CONSTRAINT `FK_timecapsule_TO_timecapsule_card_1` FOREIGN KEY (`timecapsule_no`) REFERENCES `timecapsule` (`timecapsule_no`),
  CONSTRAINT `timecapsule_card_ibfk_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timecapsule_criteria`
--

DROP TABLE IF EXISTS `timecapsule_criteria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timecapsule_criteria` (
  `criteria_id` bigint NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL,
  `weather_status` varchar(20) DEFAULT NULL,
  `start_time` int DEFAULT NULL,
  `end_time` int DEFAULT NULL,
  `local_big` varchar(50) DEFAULT NULL,
  `local_medium` varchar(50) DEFAULT NULL,
  `time_kr` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`criteria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=373 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timecapsule_file`
--

DROP TABLE IF EXISTS `timecapsule_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timecapsule_file` (
  `timecapsule_file_no` bigint NOT NULL AUTO_INCREMENT,
  `timecapsule_no` bigint NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `create_time` timestamp NOT NULL,
  `user_no` bigint DEFAULT NULL,
  `file_size` bigint NOT NULL,
  PRIMARY KEY (`timecapsule_file_no`),
  KEY `FK_timecapsule_TO_timecapsule_file_1` (`timecapsule_no`),
  KEY `FK_timecapsule_file_user` (`user_no`),
  CONSTRAINT `FK_timecapsule_file_user` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`),
  CONSTRAINT `FK_timecapsule_TO_timecapsule_file_1` FOREIGN KEY (`timecapsule_no`) REFERENCES `timecapsule` (`timecapsule_no`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timecapsule_invite`
--

DROP TABLE IF EXISTS `timecapsule_invite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timecapsule_invite` (
  `invite_tc_no` bigint NOT NULL AUTO_INCREMENT,
  `timecapsule_no` bigint NOT NULL,
  `guest_user_no` bigint NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'NOTREAD',
  `request_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timecapsule_penalty_no` bigint DEFAULT NULL,
  `criteria_id` bigint NOT NULL,
  PRIMARY KEY (`invite_tc_no`),
  KEY `FK_timecapsule_TO_timecapsule_invite_1` (`timecapsule_no`),
  KEY `FK_timecapsule_criteria_TO_timecapsule_invite_1` (`criteria_id`),
  KEY `FK_timecapsule_penalty_TO_timecapsule_invite_1` (`timecapsule_penalty_no`),
  CONSTRAINT `FK_timecapsule_criteria_TO_timecapsule_invite_1` FOREIGN KEY (`criteria_id`) REFERENCES `timecapsule_criteria` (`criteria_id`),
  CONSTRAINT `FK_timecapsule_penalty_TO_timecapsule_invite_1` FOREIGN KEY (`timecapsule_penalty_no`) REFERENCES `timecapsule_penalty` (`timecapsule_penalty_no`),
  CONSTRAINT `FK_timecapsule_TO_timecapsule_invite_1` FOREIGN KEY (`timecapsule_no`) REFERENCES `timecapsule` (`timecapsule_no`)
) ENGINE=InnoDB AUTO_INCREMENT=186 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timecapsule_mapping`
--

DROP TABLE IF EXISTS `timecapsule_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timecapsule_mapping` (
  `timecapsule_mapping_no` bigint NOT NULL AUTO_INCREMENT,
  `timecapsule_no` bigint NOT NULL,
  `user_no` bigint NOT NULL,
  `is_save` tinyint(1) DEFAULT '0',
  `is_host` tinyint(1) DEFAULT '0',
  `delete_date` timestamp NULL DEFAULT NULL,
  `save_date` timestamp NULL DEFAULT NULL,
  `card_able` tinyint(1) DEFAULT '1',
  `file_able` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`timecapsule_mapping_no`),
  KEY `FK_timecapsule_TO_timecapsule_mapping_1` (`timecapsule_no`),
  KEY `FK_user_TO_timecapsule_mapping_1` (`user_no`),
  CONSTRAINT `FK_timecapsule_TO_timecapsule_mapping_1` FOREIGN KEY (`timecapsule_no`) REFERENCES `timecapsule` (`timecapsule_no`),
  CONSTRAINT `FK_user_TO_timecapsule_mapping_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=533 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timecapsule_penalty`
--

DROP TABLE IF EXISTS `timecapsule_penalty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timecapsule_penalty` (
  `timecapsule_penalty_no` bigint NOT NULL AUTO_INCREMENT,
  `penalty` tinyint(1) NOT NULL DEFAULT '0',
  `penalty_description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`timecapsule_penalty_no`)
) ENGINE=InnoDB AUTO_INCREMENT=370 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_no` bigint NOT NULL AUTO_INCREMENT,
  `account_type` varchar(20) NOT NULL DEFAULT 'ORIGIN',
  `email` varchar(45) NOT NULL,
  `user_pw` varchar(500) NOT NULL,
  `nickname` varchar(45) NOT NULL,
  `profile_image` varchar(500) NOT NULL DEFAULT '',
  `coin` int NOT NULL DEFAULT '0',
  `now_theme` int NOT NULL,
  `regist_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delete_date` timestamp NULL DEFAULT NULL,
  `max_capsule_count` int NOT NULL DEFAULT '5',
  `now_capsule_count` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=268 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_coin_get_log`
--

DROP TABLE IF EXISTS `user_coin_get_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_coin_get_log` (
  `user_coin_log_no` bigint NOT NULL AUTO_INCREMENT,
  `user_no` bigint NOT NULL,
  `get_date` timestamp NOT NULL,
  `get_coin` int NOT NULL,
  `type` varchar(30) NOT NULL,
  PRIMARY KEY (`user_coin_log_no`),
  KEY `FK_user_TO_user_coin_get_log_1` (`user_no`),
  CONSTRAINT `FK_user_TO_user_coin_get_log_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=570 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_coin_use_log`
--

DROP TABLE IF EXISTS `user_coin_use_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_coin_use_log` (
  `user_coin_log_no` bigint NOT NULL AUTO_INCREMENT,
  `user_no` bigint NOT NULL,
  `buying_date` timestamp NOT NULL,
  `buying_no` bigint NOT NULL,
  `price` int NOT NULL,
  `type` varchar(30) NOT NULL DEFAULT 'ALL_THEME',
  PRIMARY KEY (`user_coin_log_no`),
  KEY `FK_user_TO_user_coin_use_log_1` (`user_no`),
  CONSTRAINT `FK_user_TO_user_coin_use_log_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_event`
--

DROP TABLE IF EXISTS `user_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_event` (
  `user_event_no` bigint NOT NULL AUTO_INCREMENT,
  `user_no` bigint NOT NULL,
  `is_check` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_event_no`),
  KEY `FK_user_TO_user_event_1` (`user_no`),
  CONSTRAINT `FK_user_TO_user_event_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_friend`
--

DROP TABLE IF EXISTS `user_friend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_friend` (
  `user_friend_no` bigint NOT NULL AUTO_INCREMENT,
  `user_no` bigint NOT NULL,
  `friend_no` bigint NOT NULL,
  `is_favorite` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(30) NOT NULL DEFAULT 'NOTREAD',
  `request_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `response_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_friend_no`),
  KEY `FK_user_TO_user_friend_1` (`user_no`),
  KEY `FK_user_TO_user_friend_2` (`friend_no`),
  CONSTRAINT `FK_user_TO_user_friend_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`),
  CONSTRAINT `FK_user_TO_user_friend_2` FOREIGN KEY (`friend_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=333 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_location`
--

DROP TABLE IF EXISTS `user_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_location` (
  `user_location_no` bigint NOT NULL AUTO_INCREMENT,
  `local_big` varchar(50) DEFAULT NULL,
  `local_medium` varchar(50) DEFAULT NULL,
  `user_no` bigint NOT NULL,
  `weather_time` timestamp NULL DEFAULT NULL,
  `weather` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`user_location_no`),
  KEY `user_no` (`user_no`),
  CONSTRAINT `user_location_ibfk_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_log`
--

DROP TABLE IF EXISTS `user_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_log` (
  `user_log_no` bigint NOT NULL AUTO_INCREMENT,
  `user_no` bigint NOT NULL,
  `recent_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_log_no`),
  KEY `FK_user_TO_user_log_1` (`user_no`),
  CONSTRAINT `FK_user_TO_user_log_1` FOREIGN KEY (`user_no`) REFERENCES `user` (`user_no`)
) ENGINE=InnoDB AUTO_INCREMENT=2186 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `weather_location_info`
--

DROP TABLE IF EXISTS `weather_location_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weather_location_info` (
  `local_big` text,
  `local_medium` text,
  `local_small` text,
  `nx` int DEFAULT NULL,
  `ny` int DEFAULT NULL,
  `lan` double DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3796 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `weather_location_list`
--

DROP TABLE IF EXISTS `weather_location_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weather_location_list` (
  `local_big` text,
  `local_medium` text,
  `weather_location_list_no` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`weather_location_list_no`)
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-17 19:22:19
