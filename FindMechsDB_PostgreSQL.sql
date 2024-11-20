CREATE TABLE IF NOT EXISTS users(
    id SMALLSERIAL PRIMARY KEY,
    nombre VARCHAR(64) NOT NULL,
    celular VARCHAR(16) NOT NULL,
    correo VARCHAR(64) NOT NULL,
    clave VARCHAR(64) NOT NULL,
    rol BIT(2) NOT NULL DEFAULT b'00',
    verificado TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);
COMMENT ON COLUMN users.rol IS '11=admin, 10=mech_verified, 01=mech_unverified, 00=user';
CREATE TABLE IF NOT EXISTS cars(
    id SMALLSERIAL PRIMARY KEY,
    id_usuario SMALLINT NOT NULL REFERENCES users(id),
    patente VARCHAR(10) UNIQUE NOT NULL,
    vin VARCHAR(17) UNIQUE NOT NULL,
    marca VARCHAR(16) NOT NULL,
    modelo VARCHAR(32) NOT NULL,
    cita BOOLEAN NOT NULL DEFAULT FALSE,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS workshops(
    id SMALLSERIAL PRIMARY KEY,
    id_usuario SMALLINT NOT NULL REFERENCES users(id),
    ciudad VARCHAR(64) NOT NULL,
    direccion VARCHAR(64) NOT NULL,
    detalles VARCHAR(128),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS workshopmechs(
    id SMALLSERIAL PRIMARY KEY,
    id_mech SMALLINT NOT NULL REFERENCES users(id),
    id_workshop SMALLINT NOT NULL REFERENCES workshops(id)
);
CREATE TABLE IF NOT EXISTS appointments(
    id SERIAL PRIMARY KEY,
    id_usuario SMALLINT NOT NULL REFERENCES users(id),
    fecha TIMESTAMP NOT NULL,
    ciudad VARCHAR(32) NOT NULL,
    direccion VARCHAR(64) NOT NULL,
    id_auto SMALLINT NOT NULL REFERENCES cars(id),
    detalles VARCHAR(128),
    id_mech SMALLINT REFERENCES users(id),
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
