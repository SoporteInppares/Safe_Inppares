/* Ejecute una sola vez si la base INPPARES_SafeReport ya fue creada con 001_initial_schema.sql. */
USE INPPARES_SafeReport;
GO

/* Migra los nombres anteriores Correo/ContrasenaHash si ya existen. */
IF COL_LENGTH('dbo.Usuario', 'NombreUsuario') IS NULL
BEGIN
    IF COL_LENGTH('dbo.Usuario', 'Correo') IS NOT NULL
        EXEC sp_rename 'dbo.Usuario.Correo', 'NombreUsuario', 'COLUMN';
    ELSE
        ALTER TABLE dbo.Usuario ADD NombreUsuario nvarchar(80) NULL;
END
GO

IF COL_LENGTH('dbo.Usuario', 'Contrasena') IS NULL
BEGIN
    IF COL_LENGTH('dbo.Usuario', 'ContrasenaHash') IS NOT NULL
        EXEC sp_rename 'dbo.Usuario.ContrasenaHash', 'Contrasena', 'COLUMN';
    ELSE
        ALTER TABLE dbo.Usuario ADD Contrasena varchar(255) NULL;
END
GO
