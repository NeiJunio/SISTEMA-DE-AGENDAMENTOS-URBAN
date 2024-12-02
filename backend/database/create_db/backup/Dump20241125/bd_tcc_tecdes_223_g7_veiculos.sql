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
-- Table structure for table `veiculos`
--

DROP TABLE IF EXISTS `veiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `veiculos` (
  `veic_id` int(11) NOT NULL AUTO_INCREMENT,
  `mod_id` int(11) NOT NULL,
  `veic_placa` varchar(10) NOT NULL,
  `veic_ano` varchar(4) NOT NULL,
  `veic_cor` varchar(15) NOT NULL,
  `veic_combustivel` varchar(20) NOT NULL,
  `veic_observ` varchar(200) NOT NULL,
  `veic_situacao` bit(1) NOT NULL,
  PRIMARY KEY (`veic_id`),
  KEY `veiculos_fk1` (`mod_id`),
  CONSTRAINT `veiculos_fk1` FOREIGN KEY (`mod_id`) REFERENCES `modelos` (`mod_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veiculos`
--

LOCK TABLES `veiculos` WRITE;
/*!40000 ALTER TABLE `veiculos` DISABLE KEYS */;
INSERT INTO `veiculos` VALUES (1,1,'ABC1234','2020','Azul','Diesel','Observacoes sobre o veiculo ABC1234 - caminhao.',_binary ''),(2,2,'DEF5678','2018','Preto','Diesel','Observacoes sobre o veiculo DEF5678 - caminhao',_binary ''),(3,3,'GHI9012','2022','Branco','Diesel','Observacoes sobre o veiculo GHI9012 - caminhao',_binary ''),(4,481,'JKL3456','2019','Vermelho','Flex','Observacoes sobre o veiculo JKL3456 - carro',_binary ''),(5,934,'MNO7890','2021','Azul','Flex','Observacoes sobre o veiculo MNO7890 - carro',_binary ''),(6,504,'PQR1234','2017','Prata','Flex','Observacoes sobre o veiculo PQR1234 - carro',_binary ''),(7,1582,'STU5678','2013','Preto','Gasolina','Observacoes sobre o veiculo STU5678 - moto',_binary ''),(8,1586,'VWX9012','2023','Laranja','Flex','Observacoes sobre o veiculo VWX9012 - moto',_binary '\0'),(9,524,'DFJ-7768','2012','Branco','Alcool','Astra',_binary ''),(10,2177,'ACB-1233','2024','Vinho','gasolina','',_binary ''),(11,617,'ABC-1233','2024','Marrom','diesel','',_binary ''),(12,49,'ABC-1235','1980','Preto','diesel','',_binary ''),(13,1205,'MNO-7890','2011','Rosa','Gasolina','',_binary ''),(14,343,'RPG-2924','2019','Cinza','Alcool','Observacoes',_binary ''),(15,2024,'OKD-7890','2011','Preto','Flex','Observacoes',_binary ''),(16,605,'AOI-8451','2018','Laranja','Gasolina','',_binary ''),(17,383,'KOF-8492','2017','Bege','Alcool','',_binary ''),(18,606,'CHA-2390','2015','Bege','Alcool','',_binary ''),(19,381,'SAF-5484','2028','Laranja','Alcool','',_binary ''),(20,1998,'BUA-2390','2028','Prata','Flex','',_binary ''),(21,642,'POU-5489','2028','Branco','Flex','',_binary ''),(22,1258,'IFJ-1293','2024','Dourado','Diesel','',_binary ''),(23,1996,'UIJ-2139','2030','Laranja','Gasolina','',_binary ''),(24,1491,'PQW-3589','2024','Preto','Diesel','',_binary ''),(25,1493,'ZXC-5113','2021','Cinza','Alcool','',_binary ''),(26,1614,'ASC-1233','1999','Prata','Alcool','',_binary ''),(27,343,'PCS-2312','2020','Marrom','GNV','',_binary ''),(28,343,'XCV-5311','2024','Rosa','Diesel','',_binary ''),(29,1527,'XCO-9032','2022','Azul','Alcool','',_binary ''),(30,1656,'OSD-4312','2022','Laranja','Diesel','',_binary ''),(31,645,'FJU-4023','2024','Dourado','Alcool','',_binary ''),(32,2027,'KOD-2398','2024','Roxo','Alcool','',_binary ''),(33,256,'SIL-2983','2020','Cinza','GNV','',_binary ''),(34,2027,'KUZ-4030','2020','Vermelho','Alcool','',_binary ''),(35,1912,'NUN-0212','2017','Preto','Alcool','',_binary ''),(36,1656,'MAZ-2091','2013','Verde','Alcool','',_binary ''),(37,1214,'OXM-1239','1999','Dourado','Diesel','',_binary ''),(38,1608,'CUI-1092','2023','Rosa','Alcool','',_binary ''),(39,1554,'COZ-2010','2012','Vinho','Alcool','Receba',_binary ''),(40,733,'COC-2310','2020','Verde','Flex','teste2',_binary ''),(41,2272,'BOA-3029','2020','Branco','Alcool','teste',_binary '\0'),(42,1286,'ABC-1234','1980','Preto','Gasolina','Cheve',_binary ''),(43,448,'NEW-5343','2010','Dourado','Gasolina','',_binary ''),(44,1134,'IJR-1342','2020','Branco','Alcool','teste',_binary '');
/*!40000 ALTER TABLE `veiculos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-25 21:04:56
