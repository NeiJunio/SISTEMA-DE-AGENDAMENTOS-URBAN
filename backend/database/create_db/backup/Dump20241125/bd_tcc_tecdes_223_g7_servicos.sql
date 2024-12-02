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
-- Table structure for table `servicos`
--

DROP TABLE IF EXISTS `servicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicos` (
  `serv_id` int(11) NOT NULL AUTO_INCREMENT,
  `cat_serv_id` int(11) DEFAULT NULL,
  `serv_nome` varchar(60) NOT NULL,
  `serv_duracao` time NOT NULL,
  `serv_preco` decimal(7,2) NOT NULL,
  `serv_descricao` varchar(200) NOT NULL,
  `serv_situacao` bit(1) NOT NULL,
  PRIMARY KEY (`serv_id`),
  KEY `FK_cat_serv_id` (`cat_serv_id`),
  CONSTRAINT `FK_cat_serv_id` FOREIGN KEY (`cat_serv_id`) REFERENCES `categorias_servicos` (`cat_serv_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicos`
--

LOCK TABLES `servicos` WRITE;
/*!40000 ALTER TABLE `servicos` DISABLE KEYS */;
INSERT INTO `servicos` VALUES (1,1,'Lavagem externa (tradicional)','00:30:00',30.00,'Lavagem externa convencional do veiculo',_binary ''),(2,1,'Lavagem externa (a seco)','00:40:00',40.00,'Lavagem externa do veiculo sem uso de agua.',_binary ''),(3,1,'Lavagem interna completa','01:00:00',60.00,'Limpeza completa do interior do veiculo.',_binary ''),(4,1,'Limpeza de estofados','02:00:00',120.00,'Limpeza profunda de estofados.',_binary ''),(5,1,'Limpeza de carpetes','01:30:00',70.00,'Limpeza detalhada dos carpetes do veiculo.',_binary ''),(6,1,'Higienizacao de ar-condicionado','01:00:00',80.00,'Higienizacao do sistema de ar-condicionado.',_binary ''),(7,1,'Descontaminacao de pintura','01:30:00',100.00,'Remocao de contaminantes da pintura.',_binary ''),(8,2,'Polimento de pintura','03:00:00',200.00,'Polimento completo da pintura do veiculo.',_binary ''),(9,2,'Espelhamento','04:00:00',250.00,'Espelhamento da pintura para brilho intenso.',_binary ''),(10,2,'Vitrificacao','05:00:00',300.00,'Aplicacao de revestimento vitrificado.',_binary ''),(11,2,'Enceramento','01:30:00',80.00,'Aplicacao de cera para protecao da pintura.',_binary ''),(12,2,'Selagem de pintura','02:00:00',150.00,'Selagem da pintura para protecao prolongada.',_binary ''),(13,2,'Aplicacao de pelicula de protecao de pintura (PPF)','06:00:00',500.00,'Aplicacao de pelicula protetora de pintura.',_binary ''),(14,3,'Polimento de farois','01:00:00',60.00,'Polimento para clarear farois.',_binary ''),(15,3,'Restauracao de farois','02:00:00',120.00,'Restauracao completa de farois.',_binary ''),(16,3,'Aplicacao de repelente de agua (cristalizacao de vidros)','00:45:00',50.00,'Aplicacao de repelente de agua nos vidros.',_binary ''),(17,3,'Aplicacao de insulfilm','02:30:00',200.00,'Aplicacao de pelicula insulfilm.',_binary ''),(18,4,'Limpeza de rodas e calotas','00:45:00',40.00,'Limpeza detalhada de rodas e calotas.',_binary ''),(19,4,'Polimento de rodas','01:30:00',100.00,'Polimento para brilho intenso das rodas.',_binary ''),(20,4,'Aplicacao de protetores de pneu','00:30:00',30.00,'Aplicacao de produto protetor nos pneus.',_binary ''),(21,4,'Pintura e restauracao de rodas','03:00:00',250.00,'Pintura e restauracao de rodas.',_binary ''),(22,5,'Limpeza detalhada do painel e console','01:00:00',60.00,'Limpeza detalhada do painel e console.',_binary ''),(23,5,'Limpeza e hidratacao de bancos de couro','02:00:00',150.00,'Limpeza e hidratacao de bancos de couro.',_binary ''),(24,5,'Limpeza e hidratacao de plasticos internos','01:30:00',80.00,'Limpeza e hidratacao de plasticos internos.',_binary ''),(25,5,'Limpeza de portas e macanetas','01:00:00',50.00,'Limpeza detalhada de portas e macanetas.',_binary ''),(26,5,'Detalhamento de dutos de ventilacao','01:00:00',70.00,'Limpeza detalhada dos dutos de ventilacao.',_binary ''),(27,6,'Tratamento com ozonio','01:30:00',150.00,'Remocao de odores com tratamento de ozonio.',_binary ''),(28,6,'Neutralizacao de odores','01:00:00',100.00,'Neutralizacao de odores no veiculo.',_binary ''),(29,7,'Retoque de pintura','03:00:00',200.00,'Retoque de pintura para corrigir imperfeicoes.',_binary ''),(30,7,'Pintura parcial','04:00:00',300.00,'Pintura parcial para correcao estetica.',_binary ''),(31,8,'Envelopamento automotivo (vinil)','06:00:00',800.00,'Envelopamento completo do veiculo com vinil.',_binary ''),(32,8,'Pintura de pincas de freio','02:00:00',150.00,'Pintura personalizada das pincas de freio.',_binary ''),(33,8,'Aplicacao de adesivos decorativos','01:00:00',50.00,'Aplicacao de adesivos decorativos no veiculo.',_binary ''),(34,8,'Instalacao de spoilers e acessorios externos','03:00:00',300.00,'Instalacao de spoilers e acessorios externos.',_binary ''),(35,9,'Remocao de riscos e arranhoes','02:00:00',200.00,'Remocao de riscos e arranhoes superficiais.',_binary ''),(36,9,'Reparo de amassados sem pintura (martelinho de ouro)','03:00:00',300.00,'Reparo de amassados sem necessidade de pintura.',_binary ''),(37,9,'Remocao de manchas','01:30:00',100.00,'Remocao de manchas da superficie do veiculo.',_binary ''),(38,10,'Lavagem de motor','01:00:00',80.00,'Lavagem detalhada do motor do veiculo.',_binary ''),(39,10,'Polimento de escapamento','01:00:00',50.00,'Polimento do sistema de escapamento.',_binary ''),(40,10,'Revitalizacao de teto solar','02:00:00',150.00,'Revitalizacao e limpeza do teto solar.',_binary '');
/*!40000 ALTER TABLE `servicos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-25 21:04:55
