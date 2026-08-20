# Backend Python

## Panel interno de casos

El panel para el Comité de Ética, auditores y administradores está disponible en `/admin`. No se crea ningún usuario por defecto.

Si la base ya existe, ejecute una vez `sql/002_agregar_acceso_administrativo.sql` en SQL Server. A continuación agregue un secreto aleatorio de al menos 32 caracteres a `backend/.env`:

```env
ADMIN_SESSION_SECRET=un-secreto-largo-aleatorio-que-no-debe-compartirse
```

Con el entorno virtual activado y desde `backend`, cree el primer administrador:

```powershell
python scripts/crear_usuario_admin.py
```

El script solicita nombre completo, nombre de usuario y contraseña, y le asigna el rol `ADMINISTRADOR`. La columna se llama `Contrasena`, pero su valor se guarda como hash bcrypt; nunca se almacena la contraseña legible. Reinicie Uvicorn tras cambiar `backend/.env`.

API FastAPI que conecta la vista React con SQL Server. La estructura separa:

- `models/`: mapeo SQLAlchemy de cada tabla del script SQL.
- `schemas/`: contratos y validaciones de las solicitudes/respuestas HTTP.
- `controllers/`: casos de uso de denuncias, usuarios y auditoría.
- `routers/`: endpoints HTTP; no contiene reglas de negocio.

## Ejecución

1. Ejecute primero `sql/001_initial_schema.sql` en SQL Server.
2. Cree `backend/.env` a partir de `.env.example` y configure `DATABASE_URL`.
3. Instale dependencias: `pip install -r requirements.txt`.
4. Desde `backend`, ejecute: `uvicorn app.main:app --reload`.

La aplicación web usa `http://localhost:8000/api` de forma predeterminada. Si la API se despliega en otra URL, establezca `VITE_API_URL` en el frontend.
