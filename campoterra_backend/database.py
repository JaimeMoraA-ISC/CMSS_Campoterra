from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configuración de conexión a MySQL

SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:123456@localhost:3306/campoterra_cmms"

# Creamos el motor de conexión
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Configuramos la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base de la que heredarán los modelos de las tablas
Base = declarative_base()

# Dependencia para inyectar la conexión de la BD en cada petición a la API
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()