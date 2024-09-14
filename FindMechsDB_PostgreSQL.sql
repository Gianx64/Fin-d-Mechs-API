CREATE TABLE IF NOT EXISTS users(
    id SMALLSERIAL PRIMARY KEY,
    usuario VARCHAR(64) NOT NULL,
    correo VARCHAR(64) NOT NULL,
    clave VARCHAR(64) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS workshops(
    id SMALLSERIAL PRIMARY KEY,
    usuario SMALLINT NOT NULL REFERENCES users(id),
    ciudad VARCHAR(64) NOT NULL,
    direccion VARCHAR(64) NOT NULL,
    detalles VARCHAR(128),
    mechs VARCHAR(64),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS appointments(
    id SERIAL PRIMARY KEY,
    usuario SMALLINT NOT NULL REFERENCES users(id),
    fecha TIMESTAMP NOT NULL,
    ciudad VARCHAR(64) NOT NULL,
    direccion VARCHAR(64) NOT NULL,
    auto_marca VARCHAR(16) NOT NULL,
    auto_modelo VARCHAR(32) NOT NULL,
    detalles VARCHAR(128),
    mech SMALLINT NOT NULL REFERENCES users(id),
    servicio BIT(2) NOT NULL,
    id_taller SMALLINT REFERENCES workshops(id),
    ingresado TIMESTAMP DEFAULT NOW(),
    actualizado TIMESTAMP,
    confirmado TIMESTAMP,
    cancelado TIMESTAMP,
    auto_tomado TIMESTAMP,
    auto_devuelto TIMESTAMP,
    completado_tiempo TIMESTAMP,
    usuario_comentario VARCHAR(128),
    usuario_comentario_tiempo TIMESTAMP,
    mech_comentario VARCHAR(128),
    mech_comentario_tiempo TIMESTAMP
);
