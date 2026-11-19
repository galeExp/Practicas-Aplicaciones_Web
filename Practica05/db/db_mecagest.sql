-- Comandos para crear la base de datos 
-- Para mecagest y su interaccion
-- 1. Crear la base de datos 
-- CREATE DATABASE db_mecagest;
-- 2. USAR/ACTIVAR LA BASE DE DATOS
USE db_mecagest;
-- 3. CREAR TABLA DE SUARIOS 
CREATE TABLE usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
emal VARCHAR (100) NOT NULL,
password VARCHAR (255) NOT NULL,
create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP,
status TINYINT DEFAULT 1 
);
-- Visaulizar la estructura de la tabla 
DESCRIBE usuarios;
-- seleccionar los registrps de la tabla 
SELECT * FROM usuarios;
-- Ejemplo de insercion de un nuevo usuario
INSERT INTO usuarios VALUES (DEFAULT, "Gael Uriel","250954@utxicotepec.edu.mx",
md5("g$$$###xxxaS"),now(),null,1);
-- Insercion Multiple de otros usuarios 
INSERT INTO usuarios (nombre,email,password) values
("Juan Prez ","jLeiva@gmail.com",md5("123eedfs")),
("Mariana Lopez ", "LopMari@gmail.com",md5("123ffahsfrD"));

