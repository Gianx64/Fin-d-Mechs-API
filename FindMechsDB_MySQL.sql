CREATE DATABASE IF NOT EXISTS FindMechsDB;
USE FindMechsDB;
CREATE TABLE IF NOT EXISTS users(
    id SMALLINT unsigned NOT NULL AUTO_INCREMENT,
    usuario VARCHAR(64) NOT NULL,
    celular VARCHAR(16) NOT NULL,
    correo VARCHAR(64) UNIQUE NOT NULL,
    clave VARCHAR(64) NOT NULL,
    rol BIT(2) NOT NULL COMMENT '11=admin, 10=mech_verified, 01=mech_unverified, 00=user',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY(id)
) ENGINE = InnoDB CHARACTER SET = utf8;
CREATE TABLE IF NOT EXISTS workshops(
    id SMALLINT unsigned NOT NULL AUTO_INCREMENT,
    usuario SMALLINT unsigned NOT NULL,
    ciudad VARCHAR(64) NOT NULL,
    direccion VARCHAR(64) NOT NULL,
    detalles VARCHAR(128) NULL,
    mechs VARCHAR(64) NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY(id),
    FOREIGN KEY(usuario) REFERENCES users(id)
) ENGINE = InnoDB CHARACTER SET = utf8;
CREATE TABLE IF NOT EXISTS appointments(
    id INT unsigned NOT NULL AUTO_INCREMENT,
    usuario SMALLINT unsigned NOT NULL,
    fecha DATETIME NOT NULL,
    ciudad VARCHAR(64) NOT NULL,
    direccion VARCHAR(64) NOT NULL,
    auto_marca VARCHAR(16) NOT NULL,
    auto_modelo VARCHAR(32) NOT NULL,
    detalles VARCHAR(128) NULL,
    mech SMALLINT unsigned NOT NULL,
    servicio BIT(2) NOT NULL,
    id_taller SMALLINT unsigned NULL,
    ingresado DATETIME DEFAULT NOW(),
    actualizado DATETIME ON UPDATE NOW(),
    confirmado DATETIME NULL,
    cancelado DATETIME NULL,
    canceladopor BOOLEAN NULL COMMENT 'false=user, true=mech',
    auto_tomado DATETIME NULL,
    auto_devuelto DATETIME NULL,
    completado DATETIME NULL,
    usuario_comentario VARCHAR(128) NULL,
    usuario_comentario_tiempo DATETIME NULL,
    mech_comentario VARCHAR(128) NULL,
    mech_comentario_tiempo DATETIME NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(usuario) REFERENCES users(id),
    FOREIGN KEY(mech) REFERENCES users(id),
    FOREIGN KEY(id_taller) REFERENCES workshops(id)
) ENGINE = InnoDB CHARACTER SET = utf8;
