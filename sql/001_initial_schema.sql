/*
  INPPARES SafeReport - esquema inicial para Microsoft SQL Server

  Ejecute este archivo manualmente en una instancia de SQL Server donde tenga
  permisos para crear la base de datos. Crea INPPARES_SafeReport e inserta
  los roles iniciales, pero no crea usuarios administrativos.

  Principios del modelo:
  - Denuncia: datos principales y respuestas variables en JSON.
  - Tablas relacionadas: personas, tipos, adjuntos, mensajes y cambios de estado.
  - Los adjuntos se guardan fuera de SQL Server (almacenamiento privado); aqui solo se
    registra su metadato y su identificador de almacenamiento.
  - La contrasena de seguimiento se guarda exclusivamente como hash generado por el backend.
*/

CREATE DATABASE INPPARES_SafeReport;
GO

USE INPPARES_SafeReport;
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET XACT_ABORT ON;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE dbo.Rol (
    RolId               tinyint IDENTITY(1,1) NOT NULL,
    Nombre              nvarchar(50) NOT NULL,
    Descripcion         nvarchar(250) NULL,
    CONSTRAINT PK_Rol PRIMARY KEY (RolId),
    CONSTRAINT UQ_Rol_Nombre UNIQUE (Nombre)
);
GO

CREATE TABLE dbo.Usuario (
    UsuarioId           uniqueidentifier NOT NULL CONSTRAINT DF_Usuario_UsuarioId DEFAULT NEWSEQUENTIALID(),
    NombreCompleto      nvarchar(200) NOT NULL,
    NombreUsuario       nvarchar(80) NOT NULL,
    Contrasena          varchar(255) NOT NULL,
    Activo              bit NOT NULL CONSTRAINT DF_Usuario_Activo DEFAULT (1),
    CreadoEn            datetimeoffset(0) NOT NULL CONSTRAINT DF_Usuario_CreadoEn DEFAULT SYSUTCDATETIME(),
    DesactivadoEn       datetimeoffset(0) NULL,
    CONSTRAINT PK_Usuario PRIMARY KEY (UsuarioId),
    CONSTRAINT UQ_Usuario_NombreUsuario UNIQUE (NombreUsuario)
);
GO

CREATE TABLE dbo.UsuarioRol (
    UsuarioId           uniqueidentifier NOT NULL,
    RolId               tinyint NOT NULL,
    AsignadoEn          datetimeoffset(0) NOT NULL CONSTRAINT DF_UsuarioRol_AsignadoEn DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_UsuarioRol PRIMARY KEY (UsuarioId, RolId),
    CONSTRAINT FK_UsuarioRol_Usuario FOREIGN KEY (UsuarioId) REFERENCES dbo.Usuario(UsuarioId),
    CONSTRAINT FK_UsuarioRol_Rol FOREIGN KEY (RolId) REFERENCES dbo.Rol(RolId)
);
GO

CREATE TABLE dbo.Denuncia (
    DenunciaId              uniqueidentifier NOT NULL CONSTRAINT DF_Denuncia_DenunciaId DEFAULT NEWSEQUENTIALID(),
    ClaveSeguimiento        varchar(40) NOT NULL,
    Contrasena          varchar(255) NOT NULL,
    EsAnonima               bit NOT NULL,
    EstadoActual            varchar(30) NOT NULL CONSTRAINT DF_Denuncia_EstadoActual DEFAULT ('RECIBIDA'),
    /* nvarchar(n) admite hasta 4.000 caracteres; MAX permite conservar el limite funcional de 5.000. */
    Resumen                 nvarchar(max) NOT NULL,
    DatosFormulario         nvarchar(max) NOT NULL CONSTRAINT DF_Denuncia_DatosFormulario DEFAULT (N'{}'),
    CreadaEn                datetimeoffset(0) NOT NULL CONSTRAINT DF_Denuncia_CreadaEn DEFAULT SYSUTCDATETIME(),
    ActualizadaEn           datetimeoffset(0) NOT NULL CONSTRAINT DF_Denuncia_ActualizadaEn DEFAULT SYSUTCDATETIME(),
    CerradaEn               datetimeoffset(0) NULL,
    Version                 rowversion NOT NULL,
    CONSTRAINT PK_Denuncia PRIMARY KEY (DenunciaId),
    CONSTRAINT UQ_Denuncia_ClaveSeguimiento UNIQUE (ClaveSeguimiento),
    CONSTRAINT CK_Denuncia_EstadoActual CHECK (EstadoActual IN ('RECIBIDA', 'EVALUACION', 'INVESTIGACION', 'CERRADA')),
    CONSTRAINT CK_Denuncia_Resumen CHECK (LEN(LTRIM(RTRIM(Resumen))) BETWEEN 1 AND 5000),
    CONSTRAINT CK_Denuncia_DatosFormularioJson CHECK (ISJSON(DatosFormulario) = 1)
);
GO

/* Datos identificatorios opcionales; aislarlos permite restringir su acceso por rol. */
CREATE TABLE dbo.DenunciaContacto (
    DenunciaId              uniqueidentifier NOT NULL,
    Nombres                 nvarchar(250) NULL,
    Telefono                nvarchar(50) NULL,
    Correo                  nvarchar(320) NULL,
    CreadoEn                datetimeoffset(0) NOT NULL CONSTRAINT DF_DenunciaContacto_CreadoEn DEFAULT SYSUTCDATETIME(),
    ActualizadoEn           datetimeoffset(0) NOT NULL CONSTRAINT DF_DenunciaContacto_ActualizadoEn DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_DenunciaContacto PRIMARY KEY (DenunciaId),
    CONSTRAINT FK_DenunciaContacto_Denuncia FOREIGN KEY (DenunciaId) REFERENCES dbo.Denuncia(DenunciaId),
    CONSTRAINT CK_DenunciaContacto_Contenido CHECK (Nombres IS NOT NULL OR Telefono IS NOT NULL OR Correo IS NOT NULL)
);
GO

/* Incluye denunciantes adicionales e involucrados. No almacene mas datos de los necesarios. */
CREATE TABLE dbo.DenunciaPersona (
    DenunciaPersonaId       uniqueidentifier NOT NULL CONSTRAINT DF_DenunciaPersona_Id DEFAULT NEWSEQUENTIALID(),
    DenunciaId              uniqueidentifier NOT NULL,
    Rol                     varchar(20) NOT NULL,
    Nombre                  nvarchar(250) NULL,
    DocumentoIdentidad      nvarchar(50) NULL,
    Cargo                   nvarchar(200) NULL,
    Correo                  nvarchar(320) NULL,
    Telefono                nvarchar(50) NULL,
    CreadoEn                datetimeoffset(0) NOT NULL CONSTRAINT DF_DenunciaPersona_CreadoEn DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_DenunciaPersona PRIMARY KEY (DenunciaPersonaId),
    CONSTRAINT FK_DenunciaPersona_Denuncia FOREIGN KEY (DenunciaId) REFERENCES dbo.Denuncia(DenunciaId),
    CONSTRAINT CK_DenunciaPersona_Rol CHECK (Rol IN ('DENUNCIANTE', 'INVOLUCRADO'))
);
GO

CREATE TABLE dbo.DenunciaTipo (
    DenunciaId              uniqueidentifier NOT NULL,
    Tipo                    nvarchar(150) NOT NULL,
    EsOtro                  bit NOT NULL CONSTRAINT DF_DenunciaTipo_EsOtro DEFAULT (0),
    DetalleOtro             nvarchar(500) NULL,
    CONSTRAINT PK_DenunciaTipo PRIMARY KEY (DenunciaId, Tipo),
    CONSTRAINT FK_DenunciaTipo_Denuncia FOREIGN KEY (DenunciaId) REFERENCES dbo.Denuncia(DenunciaId),
    CONSTRAINT CK_DenunciaTipo_Otro CHECK ((EsOtro = 0 AND DetalleOtro IS NULL) OR (EsOtro = 1 AND DetalleOtro IS NOT NULL))
);
GO

CREATE TABLE dbo.DenunciaAdjunto (
    AdjuntoId               uniqueidentifier NOT NULL CONSTRAINT DF_DenunciaAdjunto_Id DEFAULT NEWSEQUENTIALID(),
    DenunciaId              uniqueidentifier NOT NULL,
    NombreOriginal          nvarchar(260) NOT NULL,
    TipoContenido           varchar(150) NOT NULL,
    TamanoBytes             bigint NOT NULL,
    ReferenciaAlmacenamiento nvarchar(500) NOT NULL,
    HashSha256              char(64) NULL,
    CargadoEn               datetimeoffset(0) NOT NULL CONSTRAINT DF_DenunciaAdjunto_CargadoEn DEFAULT SYSUTCDATETIME(),
    EliminadoEn             datetimeoffset(0) NULL,
    CONSTRAINT PK_DenunciaAdjunto PRIMARY KEY (AdjuntoId),
    CONSTRAINT FK_DenunciaAdjunto_Denuncia FOREIGN KEY (DenunciaId) REFERENCES dbo.Denuncia(DenunciaId),
    CONSTRAINT UQ_DenunciaAdjunto_Referencia UNIQUE (ReferenciaAlmacenamiento),
    CONSTRAINT CK_DenunciaAdjunto_Tamano CHECK (TamanoBytes > 0 AND TamanoBytes <= 20971520)
);
GO

CREATE TABLE dbo.DenunciaMensaje (
    MensajeId               uniqueidentifier NOT NULL CONSTRAINT DF_DenunciaMensaje_Id DEFAULT NEWSEQUENTIALID(),
    DenunciaId              uniqueidentifier NOT NULL,
    AutorTipo               varchar(20) NOT NULL,
    UsuarioId               uniqueidentifier NULL,
    Texto                   nvarchar(4000) NOT NULL,
    CreadoEn                datetimeoffset(0) NOT NULL CONSTRAINT DF_DenunciaMensaje_CreadoEn DEFAULT SYSUTCDATETIME(),
    LeidoPorDenuncianteEn   datetimeoffset(0) NULL,
    CONSTRAINT PK_DenunciaMensaje PRIMARY KEY (MensajeId),
    CONSTRAINT FK_DenunciaMensaje_Denuncia FOREIGN KEY (DenunciaId) REFERENCES dbo.Denuncia(DenunciaId),
    CONSTRAINT FK_DenunciaMensaje_Usuario FOREIGN KEY (UsuarioId) REFERENCES dbo.Usuario(UsuarioId),
    CONSTRAINT CK_DenunciaMensaje_Autor CHECK (AutorTipo IN ('DENUNCIANTE', 'COMITE')),
    CONSTRAINT CK_DenunciaMensaje_AutorUsuario CHECK ((AutorTipo = 'DENUNCIANTE' AND UsuarioId IS NULL) OR (AutorTipo = 'COMITE' AND UsuarioId IS NOT NULL)),
    CONSTRAINT CK_DenunciaMensaje_Texto CHECK (LEN(LTRIM(RTRIM(Texto))) > 0)
);
GO

CREATE TABLE dbo.DenunciaHistorialEstado (
    HistorialEstadoId        bigint IDENTITY(1,1) NOT NULL,
    DenunciaId               uniqueidentifier NOT NULL,
    EstadoAnterior           varchar(30) NULL,
    EstadoNuevo              varchar(30) NOT NULL,
    Comentario               nvarchar(1000) NULL,
    CambiadoPorUsuarioId     uniqueidentifier NULL,
    CreadoEn                 datetimeoffset(0) NOT NULL CONSTRAINT DF_DenunciaHistorial_CreadoEn DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_DenunciaHistorialEstado PRIMARY KEY (HistorialEstadoId),
    CONSTRAINT FK_DenunciaHistorial_Denuncia FOREIGN KEY (DenunciaId) REFERENCES dbo.Denuncia(DenunciaId),
    CONSTRAINT FK_DenunciaHistorial_Usuario FOREIGN KEY (CambiadoPorUsuarioId) REFERENCES dbo.Usuario(UsuarioId),
    CONSTRAINT CK_DenunciaHistorial_EstadoAnterior CHECK (EstadoAnterior IS NULL OR EstadoAnterior IN ('RECIBIDA', 'EVALUACION', 'INVESTIGACION', 'CERRADA')),
    CONSTRAINT CK_DenunciaHistorial_EstadoNuevo CHECK (EstadoNuevo IN ('RECIBIDA', 'EVALUACION', 'INVESTIGACION', 'CERRADA'))
);
GO

/* Registro de accesos y operaciones; no guarda el contenido sensible de la denuncia. */
CREATE TABLE dbo.AuditoriaAcceso (
    AuditoriaAccesoId        bigint IDENTITY(1,1) NOT NULL,
    DenunciaId               uniqueidentifier NULL,
    UsuarioId                uniqueidentifier NULL,
    Accion                   varchar(50) NOT NULL,
    Exitoso                  bit NOT NULL,
    DireccionIp              varchar(45) NULL,
    Detalle                  nvarchar(1000) NULL,
    CreadoEn                 datetimeoffset(0) NOT NULL CONSTRAINT DF_AuditoriaAcceso_CreadoEn DEFAULT SYSUTCDATETIME(),
    CONSTRAINT PK_AuditoriaAcceso PRIMARY KEY (AuditoriaAccesoId),
    CONSTRAINT FK_AuditoriaAcceso_Denuncia FOREIGN KEY (DenunciaId) REFERENCES dbo.Denuncia(DenunciaId),
    CONSTRAINT FK_AuditoriaAcceso_Usuario FOREIGN KEY (UsuarioId) REFERENCES dbo.Usuario(UsuarioId)
);
GO

CREATE INDEX IX_Denuncia_EstadoActual_CreadaEn ON dbo.Denuncia (EstadoActual, CreadaEn DESC);
CREATE INDEX IX_DenunciaPersona_DenunciaId_Rol ON dbo.DenunciaPersona (DenunciaId, Rol);
CREATE INDEX IX_DenunciaAdjunto_DenunciaId ON dbo.DenunciaAdjunto (DenunciaId) WHERE EliminadoEn IS NULL;
CREATE INDEX IX_DenunciaMensaje_DenunciaId_CreadoEn ON dbo.DenunciaMensaje (DenunciaId, CreadoEn);
CREATE INDEX IX_DenunciaHistorial_DenunciaId_CreadoEn ON dbo.DenunciaHistorialEstado (DenunciaId, CreadoEn);
CREATE INDEX IX_AuditoriaAcceso_DenunciaId_CreadoEn ON dbo.AuditoriaAcceso (DenunciaId, CreadoEn DESC);
GO

INSERT INTO dbo.Rol (Nombre, Descripcion)
VALUES
    (N'ADMINISTRADOR', N'Administra usuarios y configuracion del sistema.'),
    (N'COMITE_ETICA', N'Consulta, investiga y responde denuncias asignadas.'),
    (N'AUDITOR', N'Consulta trazabilidad sin modificar denuncias.');
GO

COMMIT TRANSACTION;
GO
