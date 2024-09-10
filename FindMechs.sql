--CREATE DATABASE FindMechs;
--USE FindMechs;
--From shell mysql -u root -p FindMechs < FindMechs.sql

CREATE TABLE users(
    id SMALLINT unsigned NOT NULL AUTO_INCREMENT,
    usuario VARCHAR(64) NOT NULL,
    correo VARCHAR(64) NOT NULL,
    clave VARCHAR(64) NOT NULL,
    PRIMARY KEY(id)
) ENGINE = InnoDB CHARACTER SET = utf8;
CREATE TABLE appointments(
    id INT unsigned NOT NULL AUTO_INCREMENT,
    usuario SMALLINT NOT NULL,
    fecha DATETIME NOT NULL,
    ciudad VARCHAR(64) NOT NULL,
    direccion VARCHAR(64) NOT NULL,
    auto_marca VARCHAR(16) NOT NULL,
    auto_modelo VARCHAR(32) NOT NULL,
    detalles VARCHAR(128) NULL,
    servicio BOOLEAN NULL,
    id_taller SMALLINT NULL,
    mech SMALLINT NOT NULL,
    confirmado DATETIME NULL,
    cancelado DATETIME NULL,
    auto_tomado DATETIME NULL,
    auto_devuelto DATETIME NULL,
    completado_tiempo DATETIME NULL,
    usuario_comentario VARCHAR(128) NULL,
    usuario_comentario_tiempo DATETIME NULL,
    mech_comentario VARCHAR(128) NULL,
    mech_comentario_tiempo DATETIME NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(usuario) REFERENCES users(id),
    FOREIGN KEY(mech) REFERENCES users(id)
) ENGINE = InnoDB CHARACTER SET = utf8;
