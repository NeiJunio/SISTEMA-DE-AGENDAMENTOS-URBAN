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
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `usu_id` int(11) NOT NULL AUTO_INCREMENT,
  `usu_nome` varchar(60) NOT NULL,
  `usu_cpf` char(14) NOT NULL,
  `usu_data_nasc` date NOT NULL,
  `usu_sexo` tinyint(4) NOT NULL,
  `usu_telefone` varchar(20) NOT NULL,
  `usu_email` varchar(80) NOT NULL,
  `usu_observ` varchar(255) DEFAULT NULL,
  `usu_acesso` tinyint(1) NOT NULL,
  `usu_senha` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `usu_situacao` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`usu_id`),
  UNIQUE KEY `usu_id` (`usu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'José Oliveira','569.931.860-71','1995-10-20',1,'(11) 99684-4521','jose123@example.com','Observações sobre Jose Oliveira.',0,'jose789',1),(2,'João da Silva','111.892.570-09','1988-03-10',1,'(11) 99654-8120','joao@example.com','Observações sobre João da Silva.',0,'joao123',1),(3,'Maria Oliveira','555.666.777-88','1992-08-25',0,'(11) 4444-5555','maria@example.com','Observações sobre Maria Oliveira.',0,'maria456',1),(4,'Pedro Santos','454.694.900-68','1980-12-05',1,'(11) 99978-7151','pedro@example.com','Observações sobre Pedro Santos.',0,'pedro789',1),(5,'Ana Souza','711.749.370-41','1990-06-15',0,'(11) 99128-1000','ana@example.com','Observações sobre Ana Souza.',0,'ana123',1),(6,'Fernando Lima','555.379.710-11','1985-09-30',1,'(11) 99221-0518','fernando@example.com','Observações sobre Fernando Lima.',0,'fernando456',1),(7,'Mariana Silva','111.222.333-55','1998-12-12',0,'(11) 7777-5555','mariana@example.com','Observações sobre Mariana Silva.',0,'mariana789',1),(8,'Carlos Oliveira','688.355.400-97','1987-04-25',1,'(11) 99191-8100','carlos37qv45@example.com','Observações sobre Carlos Oliveira.',0,'carlos789af35A@@',1),(9,'Patrícia Ferreira','888.777.666-99','1991-08-10',0,'(11) 2222-8888','patricia@example.com','Observações sobre Patrícia Ferreira.',0,'patricia123',1),(10,'Lucas Santos','667.100.770-55','1993-11-15',1,'(11) 99329-2805','lucas@example.com','Observações sobre Lucas Santos.',0,'lucas456',1),(11,'Amanda Lima','333.222.111-44','1989-07-20',0,'(11) 4444-7777','amanda@example.com','Observações sobre Amanda Lima.',0,'amanda789',1),(12,'Rafael Almeida','237.330.570-40','1995-02-28',1,'(11) 99128-1045','rafael@example.com','Observações sobre Rafael Almeida.',0,'rafael123',1),(13,'Laura Souza','999.888.777-22','1986-06-05',0,'(11) 7777-1111','laura@example.com','Observações sobre Laura Souza.',0,'laura456',1),(14,'Guilherme Oliveira','362.952.530-08','1990-09-12',1,'(11) 99988-1050','guilherme@example.com','Observações sobre Guilherme Oliveira.',0,'guilherme789',1),(15,'Juliana Silva','777.888.999-33','1984-03-30',0,'(11) 5555-2222','juliana@example.com','Observações sobre Juliana Silva.',0,'juliana123',1),(16,'Rodrigo Santos','765.601.090-46','1983-11-05',1,'(11) 99548-1810','rodrigo@example.com','Observações sobre Rodrigo Santos.',0,'rodrigo456',1),(17,'Bianca Ferreira','222.333.444-11','1994-12-18',0,'(11) 3333-8888','bianca@example.com','Observações sobre Bianca Ferreira.',0,'bianca789',1),(18,'Fernanda Oliveira','347.288.500-99','1997-05-08',2,'(11) 99923-1443','fernanda@example.com','Observações sobre Fernanda Oliveira.',0,'fernanda123',1),(19,'Marcos Souza','970.209.860-21','1982-09-17',1,'(11) 99291-8000','marcos@example.com','Observações sobre Marcos Souza.',0,'marcos456',1),(20,'Carla Lima','802.517.590-16','1996-11-30',2,'(11) 99128-1020','carla@example.com','Observações sobre Carla Lima.',0,'carla789',1),(23,'Wesley Silva','679.132.430-90','1998-10-15',1,'(12) 99818-1871','wesley@example.com','Observações sobre Wesley.',0,'wesley1234',1),(24,'José Oliveira Pop','822.752.760-41','1995-10-20',1,'(11) 99205-0187','jose@example.com','Observações sobre Jose Oliveira.',0,'joliveira',1),(25,'Admin','779.553.740-53','1995-10-20',1,'(11) 99115-8741','admin@admin.com',NULL,1,'admin',1),(26,'User','026.796.330-08','1995-10-20',1,'(11) 99080-7031','user@user.com',NULL,0,'user',1),(27,'User2','069.269.300-90','1995-10-20',1,'(11) 99818-1000','user2@user2.com','User2',0,'user2',1),(28,'Ronaldo Lewandowski','649.622.590-75','2000-01-20',2,'(16) 93290-9203','ronaldo@ronaldo.com',NULL,1,'ronaldo',0),(29,'Gilberto ','970.198.670-90','2004-02-14',1,'(21) 99926-1851','gilberto@gmail.com',NULL,1,'gilberto',0),(30,'Gilberto Gonçalves','597.029.610-41','2004-02-14',1,'(21) 99281-0515','gilberto@gil.com',NULL,1,'gilberto',0),(31,'Kleber Souza','283.985.304-92','2004-02-14',0,'(21)21093-0868','kleber@gil.com','',1,'kleber',0),(32,'Kleber Souza Junior','283.985.304-92','2004-02-14',0,'(21)21093-0868','kleber@gil.com','',1,'kleber',0),(33,'Wesley','219.070.210-00','2000-01-20',1,'(20) 92658-4126','wesley@wesley.com',NULL,0,'wesley',0),(34,'Gabriel Roberto','340.794.260-54','2000-02-20',1,'(16) 99182-8418','gabs@gmail.com',NULL,0,'gabriel',1),(35,'Cleiton','576.636.110-63','2000-05-20',1,'(21) 99291-8400','cleiclei@clei.com',NULL,0,'cleiton',1),(36,'Ronaldo Lewandowski','312.156.230-46','2000-02-02',1,'(15) 91808-8998','ronaldo@lewa.com',NULL,0,'ronaldo',1),(37,'Ronaldo Lewandowski','517.468.820-77','2000-04-30',2,'(21) 99085-1811','ronaldo@gmail.com',NULL,0,'ronaldao',1),(38,'Neymar','757.621.730-89','2000-04-30',2,'(83) 99918-8174','neyma@gmail.com',NULL,0,'neyma',1),(39,'Yeferson','550.271.910-30','2001-09-12',1,'(42) 99218-5035','yeye@gmail.com',NULL,0,'yeferson',1),(40,'Vinicius','353.109.750-47','2001-11-11',1,'(87) 99515-4448','vinicius@gmail.com',NULL,0,'vinicius',1),(41,'Rossi','281.876.330-42','2000-02-10',1,'(27) 99191-1819','rossi@gmail.com',NULL,0,'rossi',1),(42,'Lopes','098.744.690-80','2000-02-12',2,'(24) 99210-0215','lopes@gmail.com',NULL,0,'lopes',1),(43,'Jonathan','793.962.400-87','2000-11-12',1,'(13) 98126-8510','jo@gmail.com',NULL,0,'jonathan',1),(44,'Arlindo','381.391.330-94','2002-11-25',1,'(21) 99412-8100','arlindo@gmail.com',NULL,0,'arlindo',1),(45,'Murilo','843.281.840-24','1923-04-04',1,'(12) 99994-1854','murijo@gmail.com',NULL,0,'murilo',1),(46,'Leandro','425.079.310-94','1999-04-04',1,'(21) 99948-1000','leadnro@gmail.com',NULL,0,'leandro',1),(47,'Fernando','667.516.020-65','2004-11-25',1,'(12) 99606-6545','fernando@gmail.com',NULL,0,'fernando',1),(48,'Memphis Depay','073.857.380-95','2003-12-12',2,'(12) 93484-1196','memphis@gmail.com','Depay O',0,'depay',0),(49,'Juarez','254.733.750-90','2001-01-01',1,'(12) 32143-4121','juarez@gmail.com',NULL,0,'juarez',1),(50,'Japonego Costas','782.351.590-31','2000-02-14',1,'(94) 99219-2375','japonego@gmail.com',NULL,0,'japonego',1),(51,'Jonas Vasquez','511.350.540-45','2000-12-12',1,'(55) 99321-0231','jonasso@gmail.com','Jonas',0,'oii',1),(52,'Gabriel','794.440.940-30','2000-12-31',1,'(89) 93282-8992','gabriell@gmail.com','Gabriel',0,'gabriel',1),(53,'Allan Jesus','957.086.200-99','2000-02-22',1,'(12) 99931-7263','allan@gmail.com','Allan',1,'allan',1),(54,'Gabriel','794.440.940-30','2000-12-12',1,'(13) 99489-3172','gabriell@gmail.com','Gabriel',0,'123',0),(55,'Katsube','992.341.930-40','2000-02-22',1,'(12) 99437-3219','japoncio@gmail.com','Japokoko',0,'japoncio',1),(56,'Gei Junio Nog Gomi','984.226.020-83','1989-09-20',2,'(92) 99283-9289','geijun@gmail.com',NULL,0,'geijunio',1),(57,'Lonas','935.069.370-49','2000-11-11',1,'(10) 99934-2032','gei@gmail.com',NULL,0,'gei',1),(58,'Zola','470.577.060-90','1997-07-07',1,'(68) 99319-2228','zolalu@gmail.com','',0,'zola',1),(59,'Finlandia','277.138.480-96','1992-02-09',1,'(18) 99232-4782','finlandin@gmail.com','',0,'finlandia',1),(60,'Wagner Wasconcelos','289.782.650-90','1991-09-27',1,'(12) 99213-0121','waguinwasco@gmail.com','Wesco',0,'wasco',1),(61,'Junio','273.096.120-86','2001-10-03',1,'(73) 99312-3123','junio@gmail.com','',0,'junio',1),(62,'Luiza Alice Lima','604.787.868-75','2003-11-25',0,'(15) 16545-6465','luiza.alice.lima@vegacon.com.br','Luiza',0,'luiza',1),(63,'Japo do Ôncio','279.570.920-12','2001-09-11',1,'(76) 99432-1903','japodooncio@gmail.com','',0,'japono',1),(64,'Hugo','299.418.710-86','1998-07-07',1,'(92) 89992-3192','hugdalo@gmail.com','',0,'hugo0033',1),(65,'Eminem da Silva','700.421.640-36','2004-04-20',1,'(19) 99541-2012','eminem@gmail.com','',0,'eminemsilva',1),(66,'Lonzo Ball','066.668.690-44','2000-05-09',1,'(12) 99932-1321','lolol@gmail.com','',0,'lonzo',1),(67,'Baxeta','759.523.650-94','2001-02-11',2,'(12) 99321-3126','baxeta@gmail.com',NULL,0,'baxeta',1),(68,'Dimbi','330.845.100-08','2001-06-06',1,'(89) 32199-9391','diumbi@gmail.com','',0,'dimbi',1),(69,'Kuta','084.570.290-45','2000-05-09',0,'(15) 99184-1223','kukuta@gmail.com',NULL,0,'kuta',1),(70,'Osvaldo','089.333.440-55','1992-05-09',1,'(87) 48748-7487','osvaldex@gmail.com','',0,'osvaldo777',1),(71,'Marcos','221.031.040-72','2000-08-20',1,'(54) 99854-5162','marcos@gmail.com','',0,'marcos',1),(72,'Cleber','869.125.590-00','2001-12-12',1,'(15) 99965-3126','cleberdoze@gmail.com','',0,'cleber21',1),(73,'Lilio','936.332.250-56','1999-12-14',1,'(90) 99321-0321','llioli@gmail.com',NULL,0,'lilio',1),(74,'Thiago','958.363.460-38','2000-12-12',1,'(91) 94283-2193','thiago40@usuario.com',NULL,0,'teste',1),(75,'Vasconcelos Cardoso','626.287.520-42','1999-12-20',1,'(10) 96546-5418','vasco@gmail.com','',0,'vasnconloes',1),(76,'Jacaré','803.384.010-24','2003-02-19',1,'(13) 99958-5424','jacape@gmail.com','',0,'jacare',1),(77,'Pedro Gasquez Gimenez','383.194.370-24','1997-12-17',1,'(32) 99484-8712','pedrogagi@gmail.com',NULL,0,'lingi',1),(78,'ricardo','729.773.420-95','2001-03-12',1,'(13) 23646-4998','ricardo@teste.com','',0,'asdfasadfsdasdfA1@',1),(79,'Allan Luz','360.756.648-82','1989-06-03',1,'(14) 99792-5043','allan.luz@etec.sp.gov.br',NULL,0,'Abc1234!',1),(80,'Ronaldo','507.306.484-43','1956-01-01',1,'(14) 98798-8798','ronaldo@email.com.br','TESTE',0,'Abc1234!',1),(81,'Junior','254.995.830-64','2002-11-25',1,'(38) 99832-7638','hjuanioom@gmail.com','',0,'junE492KMaw22@@',1),(82,'Ewerton','443.053.740-21','2002-11-25',1,'(64) 99948-3437','ewerton@gmail.com','',0,'ewerTOON22@',1),(83,'Anderson','132.824.910-77','2003-11-25',1,'(48) 99034-3248','beregneu@gmail.com','',0,'anders239!!!F',1),(84,'Caio','280.944.660-14','2000-02-06',1,'(12) 94838-7287','caioaoi@gmail.com','',0,'CAIO@xam$4',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
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
