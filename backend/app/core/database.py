from sqlalchemy import URL, create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Puede usarse DATABASE_URL para despliegues, o las variables DB_* para desarrollo local.
    database_url: str | None = None
    db_host: str = "SERVIDOR_SQL"
    db_port: int = 1433
    db_name: str = "INPPARES_SafeReport"
    db_user: str | None = None
    db_password: str | None = None
    db_driver: str = "ODBC Driver 18 for SQL Server"
    db_encrypt: bool = True
    db_trust_server_certificate: bool = True
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    admin_session_secret: str | None = None
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    def connection_url(self) -> str | URL:
        if self.database_url:
            return self.database_url
        if not self.db_user or not self.db_password:
            raise ValueError("Configure DB_USER y DB_PASSWORD, o DATABASE_URL, en backend/.env.")
        return URL.create(
            "mssql+pyodbc",
            username=self.db_user,
            password=self.db_password,
            host=self.db_host,
            port=self.db_port,
            database=self.db_name,
            query={
                "driver": self.db_driver,
                "Encrypt": "yes" if self.db_encrypt else "no",
                "TrustServerCertificate": "yes" if self.db_trust_server_certificate else "no",
            },
        )


settings = Settings()
engine = create_engine(settings.connection_url(), pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
