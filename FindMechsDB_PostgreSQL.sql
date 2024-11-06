CREATE TABLE IF NOT EXISTS users(
    id SMALLSERIAL PRIMARY KEY,
    usuario VARCHAR(64) NOT NULL,
    celular VARCHAR(16) NOT NULL,
    correo VARCHAR(64) UNIQUE NOT NULL,
    clave VARCHAR(64) NOT NULL,
    rol BIT(2) NOT NULL DEFAULT b'00',
    activo BOOLEAN NOT NULL DEFAULT TRUE
);
COMMENT ON COLUMN users.rol IS '11=admin, 10=mech_verified, 01=mech_unverified, 00=user';
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
    mech SMALLINT REFERENCES users(id),
    servicio BIT(2) NOT NULL,
    id_taller SMALLINT REFERENCES workshops(id),
    ingresado TIMESTAMP DEFAULT NOW(),
    actualizado TIMESTAMP,
    confirmado TIMESTAMP,
    cancelado TIMESTAMP,
    canceladopor BOOLEAN,
    auto_tomado TIMESTAMP,
    auto_devuelto TIMESTAMP,
    completado TIMESTAMP,
    usuario_comentario VARCHAR(128),
    usuario_comentario_tiempo TIMESTAMP,
    mech_comentario VARCHAR(128),
    mech_comentario_tiempo TIMESTAMP
);
COMMENT ON COLUMN appointments.servicio IS '11=Otro, 10=Mecánico lleva a taller, 01=Cliente lleva a taller, 00=Servicio a domicilio';
COMMENT ON COLUMN appointments.canceladopor IS 'false=user, true=mech';
