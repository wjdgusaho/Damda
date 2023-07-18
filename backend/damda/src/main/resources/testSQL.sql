CREATE DATABASE damda;

USE damda;

CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL UNIQUE,
  `password` varchar(45) NOT NULL,
  `nickname` varchar(45) NOT NULL UNIQUE,
  `create_date` timestamp NULL,
  `update_date` timestamp NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SELECT * FROM user;