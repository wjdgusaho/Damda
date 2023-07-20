CREATE DATABASE damda;

USE damda;

CREATE TABLE `user` (
                        `id` bigint NOT NULL AUTO_INCREMENT,
                        `email` varchar(45) NOT NULL UNIQUE,
                        `password` varchar(500) NOT NULL,
                        `nickname` varchar(45) NOT NULL UNIQUE,
                        `create_date` timestamp NULL,
                        `update_date` timestamp NULL,
                        PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `refresh_token` (
                                 `refresh_token_id` bigint NOT NULL AUTO_INCREMENT,
                                 `id` bigint NOT NULL,
                                 `refresh_token` varchar(255) DEFAULT '',
                                 `expiration_date` timestamp NOT NULL,
                                 `create_date` timestamp NOT NULL,
                                 PRIMARY KEY (`refresh_token_id`),
                                 KEY `refresh_token_to_user_id_fk_idx` (`id`),
                                 CONSTRAINT `refresh_token_to_user_id_fk` FOREIGN KEY (`id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


SELECT * FROM user;
SELECT * FROM refresh_token;