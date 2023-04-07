DROP DATABASE IF EXISTS chess;
CREATE DATABASE chess;

USE chess;

CREATE TABLE users
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password CHAR(60)     NOT NULL
);

CREATE TABLE games
(
    id             INT PRIMARY KEY AUTO_INCREMENT,
    player1_userid INT NOT NULL,
    player2_userid INT,
    start_time     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active      BOOLEAN   DEFAULT TRUE,
    lobby_name     VARCHAR(255) NOT NULL,
    FOREIGN KEY (player1_userid) REFERENCES users (id),
    FOREIGN KEY (player2_userid) REFERENCES users (id)
);



