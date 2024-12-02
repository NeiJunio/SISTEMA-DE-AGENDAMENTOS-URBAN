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
-- Table structure for table `categorias_servicos`
--

DROP TABLE IF EXISTS `categorias_servicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias_servicos` (
  `cat_serv_id` int(11) NOT NULL AUTO_INCREMENT,
  `cat_serv_nome` varchar(60) NOT NULL,
  `cat_serv_visibilidade` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`cat_serv_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias_servicos`
--

LOCK TABLES `categorias_servicos` WRITE;
/*!40000 ALTER TABLE `categorias_servicos` DISABLE KEYS */;
INSERT INTO `categorias_servicos` VALUES (1,'Lavagem e Higienizacao',1),(2,'Polimento e Protecao da Pintura',1),(3,'Cuidados com Vidros e Farois',1),(4,'Cuidados com Rodas e Pneus',1),(5,'Detalhamento Interno (tailing)',1),(6,'Remocao de Odores',1),(7,'Correcao de Pintura',1),(8,'Customizacao',1),(9,'Reparos Esteticos',1),(10,'Servicos Adicionais',1);
/*!40000 ALTER TABLE `categorias_servicos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-25 21:56:38
