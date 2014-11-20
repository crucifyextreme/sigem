CREATE DATABASE  IF NOT EXISTS `project_people` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `project_people`;
-- MySQL dump 10.13  Distrib 5.6.17, for osx10.6 (i386)
--
-- Host: localhost    Database: project_people
-- ------------------------------------------------------
-- Server version	5.6.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `prestadores`
--

DROP TABLE IF EXISTS `prestadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prestadores` (
  `ID_PRESTADOR` int(11) NOT NULL AUTO_INCREMENT,
  `PRESTADOR` varchar(150) NOT NULL,
  `RESPONSAVEL` varchar(150) NOT NULL,
  `TIPO_PRESTACAO` varchar(150) NOT NULL,
  `TIPO_CLIENTE` varchar(45) NOT NULL,
  `CPF` varchar(150) DEFAULT NULL,
  `CNPJ` varchar(100) DEFAULT NULL,
  `EMAIL` varchar(150) DEFAULT NULL,
  `TELEFONE1` varchar(100) NOT NULL,
  `TELEFONE2` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_PRESTADOR`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prestadores`
--

LOCK TABLES `prestadores` WRITE;
/*!40000 ALTER TABLE `prestadores` DISABLE KEYS */;
INSERT INTO `prestadores` VALUES (1,'G.O.S','Giltomar Nunes De Oliveira','Serviços Eletricos E Hidraulicos.','fisica','041.157.006-45','','gmferreir@hotmail.com','(38)3216-4932','(38)9873-0537'),(2,'Mega','Bruno Cossich Bandeira','Serviços Cerca Eletrica, Interfone.','fisica','088.568.676-48','','','(38)9105-0995','(38)9894-7468'),(3,'Salomão','Salomão','Serviços Diversos.','fisica','050.618.886-85','','','(38)8823-9114',''),(4,'Reparos Casa Nova','Ivailton','Serviços Diversos.','fisica','823.380.786-91','','','(38)9145-4891','(38)3015-8450'),(5,'Chaveiro Ajato','Silvano','Chaves','juridica','','02.161.528/0001-78','','(38)3222-5439','(38)9963-1527'),(6,'Welton De Jesus Silva  ','Welsin','Bombeiro Hidraulico','fisica','083.269.586-62','','','(38)9155-3344','(38)9155-3344'),(7,'Lucio Gonçalves Gomes ','Lucio','Marcenaria ','fisica','028.341.736-64','','','(38)9112-7488','(38)9112-7488'),(8,'Clima Certo','Maxsuel/ Samuel','Manutenção De Ar Condicionado','juridica','','19.517.664/0001-50','','(38)3082-7100','(38)9129-6226');
/*!40000 ALTER TABLE `prestadores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-11-10 22:31:11
