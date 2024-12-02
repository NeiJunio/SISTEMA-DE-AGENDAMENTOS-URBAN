CREATE DATABASE  IF NOT EXISTS `bd_tcc_tecdes_223_g7` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `bd_tcc_tecdes_223_g7`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 10.67.22.216    Database: bd_tcc_tecdes_223_g7
-- ------------------------------------------------------
-- Server version	5.7.21-log

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
-- Table structure for table `agenda_servicos`
--

DROP TABLE IF EXISTS `agenda_servicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agenda_servicos` (
  `agend_serv_id` int(11) NOT NULL AUTO_INCREMENT,
  `agend_id` int(11) NOT NULL,
  `serv_id` int(11) NOT NULL,
  `agend_serv_situ_id` int(11) NOT NULL,
  PRIMARY KEY (`agend_serv_id`),
  UNIQUE KEY `agend_serv_id` (`agend_serv_id`),
  KEY `agend_serv_situ_id` (`agend_serv_situ_id`),
  KEY `fk_agenda_servicos_servicos` (`serv_id`),
  KEY `fk_agenda_servicos_agendamentos` (`agend_id`),
  CONSTRAINT `agenda_servicos_ibfk_1` FOREIGN KEY (`agend_serv_situ_id`) REFERENCES `agenda_servicos_situacao` (`agend_serv_situ_id`),
  CONSTRAINT `fk_agenda_servicos_agendamentos` FOREIGN KEY (`agend_id`) REFERENCES `agendamentos` (`agend_id`),
  CONSTRAINT `fk_agenda_servicos_servicos` FOREIGN KEY (`serv_id`) REFERENCES `servicos` (`serv_id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agenda_servicos`
--

LOCK TABLES `agenda_servicos` WRITE;
/*!40000 ALTER TABLE `agenda_servicos` DISABLE KEYS */;
INSERT INTO `agenda_servicos` VALUES (1,1,1,1),(2,1,3,1),(3,2,2,1),(4,2,4,1),(5,3,5,1),(6,3,6,1),(7,4,7,1),(8,4,8,1),(9,5,9,1),(10,5,10,1),(11,6,11,1),(12,6,12,1),(13,7,13,1),(14,7,14,1),(15,8,15,1),(16,8,16,1),(17,9,17,1),(18,9,18,1),(19,10,19,1),(20,10,20,1),(21,11,21,1),(22,11,22,1),(23,12,23,1),(24,12,24,1),(25,13,25,1),(26,13,26,1),(27,14,27,1),(28,14,28,1),(29,15,29,1),(30,15,30,1),(31,16,31,1),(32,16,32,1),(33,17,33,1),(34,17,34,1),(35,18,35,1),(36,18,36,1),(37,19,37,1),(38,19,38,1),(39,20,39,1),(40,20,40,1),(41,21,1,1),(42,21,3,1),(43,22,2,1),(44,22,4,1),(45,23,5,1),(46,23,6,1),(47,24,7,1),(48,24,8,1),(49,25,9,1),(50,25,10,1),(51,26,11,1),(52,26,12,1),(53,27,13,1),(54,27,14,1),(55,28,15,1),(56,28,16,1),(57,29,17,1),(58,29,18,1),(59,30,19,1),(60,30,20,1);
/*!40000 ALTER TABLE `agenda_servicos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-25 21:56:37
