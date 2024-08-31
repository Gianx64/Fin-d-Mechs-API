CREATE DATABASE FindMechs;

USE FindMechs;

CREATE TABLE users(
    id INT NOT NULL,
    usuario VARCHAR(64) NOT NULL,
    correo VARCHAR(64) NOT NULL,
    clave VARCHAR(100) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE appointments(
    id INT NOT NULL,
    usuario VARCHAR(64) NOT NULL,
    fecha DATETIME NOT NULL,
    ciudad VARCHAR(64) NOT NULL,
    direccion VARCHAR(64) NOT NULL,
    auto_marca VARCHAR(16) NOT NULL,
    auto_modelo VARCHAR(32) NOT NULL,
    detalles VARCHAR(128) NULL,
    servicio BOOLEAN NULL,
    id_taller INT NULL,
    mech VARCHAR(64) NOT NULL,
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
    FOREIGN KEY(usuario) REFERENCES users(correo),
);
