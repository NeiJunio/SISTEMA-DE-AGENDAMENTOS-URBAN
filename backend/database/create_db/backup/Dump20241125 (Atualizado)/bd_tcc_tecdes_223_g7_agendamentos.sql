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
-- Table structure for table `agendamentos`
--

DROP TABLE IF EXISTS `agendamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agendamentos` (
  `agend_id` int(11) NOT NULL AUTO_INCREMENT,
  `veic_usu_id` int(11) NOT NULL,
  `agend_data` date NOT NULL,
  `agend_horario` time NOT NULL,
  `agend_situacao` int(11) NOT NULL,
  `agend_observ` varchar(200) NOT NULL,
  `serv_id` int(11) DEFAULT NULL,
  `agend_serv_situ_id` int(11) DEFAULT '1',
  PRIMARY KEY (`agend_id`),
  UNIQUE KEY `agend_id` (`agend_id`),
  KEY `agendamentos_fk1` (`veic_usu_id`),
  KEY `fk_agendamentos_servicos` (`serv_id`),
  KEY `fk_agendamentos_agenda_servicos_situacao` (`agend_serv_situ_id`),
  CONSTRAINT `agendamentos_fk1` FOREIGN KEY (`veic_usu_id`) REFERENCES `veiculo_usuario` (`veic_usu_id`),
  CONSTRAINT `fk_agendamentos_agenda_servicos_situacao` FOREIGN KEY (`agend_serv_situ_id`) REFERENCES `agenda_servicos_situacao` (`agend_serv_situ_id`),
  CONSTRAINT `fk_agendamentos_servicos` FOREIGN KEY (`serv_id`) REFERENCES `servicos` (`serv_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agendamentos`
--

LOCK TABLES `agendamentos` WRITE;
/*!40000 ALTER TABLE `agendamentos` DISABLE KEYS */;
INSERT INTO `agendamentos` VALUES (1,1,'2024-07-01','09:00:00',0,'Primeiro agendamento para o veículo 1 do usuário',30,4),(2,2,'2024-07-02','10:00:00',0,'Primeiro agendamento para o veículo 2 do usuário 2',9,4),(3,3,'2024-07-03','11:00:00',1,'Primeiro agendamento para o veículo 3 do usuário 3',37,1),(4,4,'2024-07-04','08:00:00',1,'Primeiro agendamento para o veículo 4 do usuário 4',37,1),(5,5,'2024-07-05','09:30:00',1,'Primeiro agendamento para o veículo 5 do usuário 5',34,1),(6,6,'2024-07-06','10:30:00',1,'Primeiro agendamento para o veículo 6 do usuário 6',19,1),(7,7,'2024-07-07','11:30:00',1,'Primeiro agendamento para o veículo 7 do usuário 7',34,1),(8,8,'2024-07-08','12:00:00',1,'Primeiro agendamento para o veículo 8 do usuário 8',29,1),(9,9,'2024-07-09','13:00:00',1,'Primeiro agendamento para o veículo 1 do usuário 9',5,1),(10,10,'2024-07-10','14:00:00',1,'Primeiro agendamento para o veículo 2 do usuário 10',18,1),(11,11,'2024-07-11','15:00:00',1,'Primeiro agendamento para o veículo 3 do usuário 11',32,1),(12,12,'2024-07-12','16:00:00',1,'Primeiro agendamento para o veículo 4 do usuário 12',26,1),(13,13,'2024-07-13','17:00:00',1,'Primeiro agendamento para o veículo 5 do usuário 13',35,1),(14,14,'2024-07-14','09:15:00',1,'Primeiro agendamento para o veículo 6 do usuário 14',14,1),(15,15,'2024-07-15','10:15:00',1,'Primeiro agendamento para o veículo 7 do usuário 15',6,1),(16,16,'2024-07-16','11:15:00',1,'Primeiro agendamento para o veículo 8 do usuário 16',28,1),(17,17,'2024-07-17','12:15:00',1,'Primeiro agendamento para o veículo 1 do usuário 17',2,1),(18,18,'2024-07-18','13:15:00',1,'Primeiro agendamento para o veículo 2 do usuário 18',6,1),(19,19,'2024-07-19','14:15:00',1,'Primeiro agendamento para o veículo 3 do usuário 19',23,1),(20,20,'2024-07-20','15:15:00',1,'Primeiro agendamento para o veículo 4 do usuário 20',17,1),(21,1,'2024-07-21','16:15:00',1,'Segundo agendamento para o veículo 1 do usuário 1',13,1),(22,2,'2024-07-22','09:45:00',1,'Segundo agendamento para o veículo 2 do usuário 2',15,1),(23,3,'2024-07-23','10:45:00',1,'Segundo agendamento para o veículo 3 do usuário 3',36,1),(24,4,'2024-07-24','11:45:00',1,'Segundo agendamento para o veículo 4 do usuário 4',15,1),(25,5,'2024-07-25','12:45:00',1,'Segundo agendamento para o veículo 5 do usuário 5',7,1),(26,6,'2024-07-26','13:45:00',1,'Segundo agendamento para o veículo 6 do usuário 6',29,1),(27,7,'2024-07-27','14:45:00',1,'Segundo agendamento para o veículo 7 do usuário 7',4,1),(28,8,'2024-07-28','15:45:00',1,'Segundo agendamento para o veículo 8 do usuário 8',12,1),(29,9,'2024-07-29','16:45:00',1,'Segundo agendamento para o veículo 1 do usuário 9',6,1),(30,10,'2024-07-30','08:45:00',1,'Segundo agendamento para o veículo 2 do usuário 10',32,1),(31,41,'2024-10-29','11:00:00',1,'agendamento de serviço',14,1),(32,41,'2024-10-29','08:00:00',1,'agendamento de serviço',28,4),(33,36,'2024-11-02','12:00:00',1,'agendamento de serviço',19,4),(34,36,'2024-11-06','09:00:00',1,'agendamento de serviço',25,3),(35,36,'2024-11-13','08:00:00',1,'agendamento de serviço',29,1),(36,37,'2024-11-10','11:00:00',1,'agendamento de serviço',27,2),(37,36,'2024-11-30','07:00:00',1,'agendamento de serviço',17,4),(38,41,'2023-12-20','14:00:00',1,'agendamento de serviço',25,1),(39,38,'2024-11-06','09:00:00',1,'agendamento de serviço',1,3),(40,38,'2024-11-06','10:00:00',1,'agendamento de serviço',8,1),(41,38,'2024-11-06','11:30:00',1,'agendamento de serviço',15,1),(42,41,'2024-11-07','03:00:00',1,'agendamento de serviço',25,1),(43,36,'2024-11-07','13:00:00',1,'agendamento de serviço',28,1),(44,41,'2024-11-07','17:00:00',1,'agendamento de serviço',27,1),(45,41,'2024-11-08','15:30:00',1,'agendamento de serviço',31,1),(46,36,'2024-11-08','08:00:00',1,'agendamento de serviço',29,1),(47,41,'2024-11-08','09:00:00',1,'agendamento de serviço',19,1),(48,37,'2024-11-08','09:00:00',1,'agendamento de serviço',25,3),(49,36,'2024-11-05','12:00:00',1,'agendamento de serviço',10,3),(50,37,'2024-11-08','12:00:00',1,'agendamento de serviço',23,1),(51,36,'2024-11-09','10:30:00',1,'agendamento de serviço',5,1),(52,37,'2024-11-09','12:00:00',1,'agendamento de serviço',10,1),(53,41,'2024-11-12','14:00:00',1,'agendamento de serviço',1,2),(54,22,'2024-11-14','08:00:00',1,'agendamento de serviço',6,4),(55,3,'2024-11-20','14:00:00',1,'agendamento de serviço',1,3),(56,3,'2024-11-14','17:00:00',1,'agendamento de serviço',8,4),(57,38,'2024-11-14','09:30:00',1,'agendamento de serviço',2,1),(58,38,'2024-11-14','09:00:00',1,'agendamento de serviço',26,2),(59,41,'2024-11-12','15:00:00',1,'agendamento de serviço',13,3),(60,36,'2024-11-12','13:00:00',1,'agendamento de serviço',28,1),(61,36,'2024-11-12','16:00:00',1,'agendamento de serviço',13,4),(62,41,'2024-11-10','10:00:00',1,'agendamento de serviço',13,4),(63,41,'2024-11-22','08:30:00',1,'agendamento de serviço',8,3),(64,36,'2024-11-25','13:00:00',0,'agendamento de serviço',1,4),(65,38,'2024-11-25','13:00:00',0,'agendamento de serviço',8,4),(66,38,'2024-11-25','13:00:00',1,'agendamento de serviço',1,2),(67,41,'2024-11-10','16:00:00',1,'agendamento de serviço',1,1),(68,41,'2024-11-20','08:00:00',1,'agendamento de serviço',19,2),(69,38,'2024-11-18','09:00:00',1,'agendamento de serviço',9,4),(70,38,'2024-11-14','17:00:00',1,'agendamento de serviço',1,1);
/*!40000 ALTER TABLE `agendamentos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-25 21:56:36
