from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import engine, get_db
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="API Campoterra CMMS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite que cualquier frontend se conecte (ideal para desarrollo local)
    allow_credentials=True,
    allow_methods=["*"],  # Permite GET, POST, PUT, DELETE, y OPTIONS
    allow_headers=["*"],  # Permite el envío de cualquier dato
)
# Ruta de prueba básica
@app.get("/")
def ruta_raiz():
    return {"mensaje": "¡El servidor de Campoterra está en línea!"}

# Endpoint para obtener todos los equipos
@app.get("/equipos/", response_model=list[schemas.Equipo])
def obtener_equipos(db: Session = Depends(get_db)):
    # Le pedimos a SQLAlchemy que traiga todos los registros de la tabla Equipos
    equipos = db.query(models.Equipo).all()
    return equipos


class BitacoraCreate(BaseModel):
    id_equipo: int
    id_tecnico: int
    id_turno: int
    tipo_mantenimiento: str  # Aquí el técnico pondrá 'Preventivo' o 'Correctivo'
    descripcion: str
    detalles_repuestos: Optional[str] = None  # Puede ir vacío si no usaron piezas

@app.post("/api/bitacoras/", tags=["App Móvil Técnicos"])
def crear_bitacora(bitacora: BitacoraCreate, db: Session = Depends(get_db)):
    """
    Recibe la información de la tablet y la inserta en MySQL.
    """
    # Enlazamos los datos recibidos con el modelo de SQLAlchemy
    nueva_bitacora = models.Bitacora(
        id_equipo=bitacora.id_equipo,
        id_tecnico=bitacora.id_tecnico,
        id_turno=bitacora.id_turno,
        tipo_mantenimiento=bitacora.tipo_mantenimiento,
        descripcion=bitacora.descripcion,
        detalles_repuestos=bitacora.detalles_repuestos
        # id_bitacora y fecha_registro se generan solos en MySQL
    )
    
    # Guardamos en la base de datos
    db.add(nueva_bitacora)
    db.commit()
    db.refresh(nueva_bitacora) # Obtenemos el folio autoincrementable generado
    
    return {
        "mensaje": "¡Bitácora registrada con éxito!", 
        "folio_bitacora": nueva_bitacora.id_bitacora
    }

# 1. El molde para recibir los datos del nuevo usuario
class UsuarioCreate(BaseModel):
    username: str
    password: str
    rol: Optional[str] = "Administrador"

# 2. La ruta POST para registrar usuarios en la base de datos
@app.post("/api/usuarios/", tags=["Seguridad y Accesos"])
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario en el sistema. 
    (Nota para la memoria técnica: En una fase de producción final, 
    la contraseña deberá ser encriptada mediante librerías como Passlib).
    """
    nuevo_usuario = models.Usuario(
        username=usuario.username,
        password=usuario.password, 
        rol=usuario.rol
    )
    
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    
    return {
        "mensaje": "¡Usuario creado con éxito!", 
        "id_usuario": nuevo_usuario.id_usuario,
        "username": nuevo_usuario.username
    }

# 1. El molde para recibir las credenciales de la pantalla de Login
class UsuarioLogin(BaseModel):
    username: str
    password: str

# 2. La ruta para validar el acceso
@app.post("/api/login/", tags=["Seguridad y Accesos"])
def iniciar_sesion(credenciales: UsuarioLogin, db: Session = Depends(get_db)):
    """
    Verifica las credenciales ingresadas. Si son correctas, autoriza la entrada.
    """
    # Buscamos al usuario en la base de datos
    usuario_db = db.query(models.Usuario).filter(models.Usuario.username == credenciales.username).first()
    
    # Si el usuario no existe o la contraseña no coincide, bloqueamos el paso
    if not usuario_db or usuario_db.password != credenciales.password:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    
    # Por seguridad, revisamos que el usuario siga activo en la empresa
    if not usuario_db.activo:
        raise HTTPException(status_code=403, detail="Esta cuenta ha sido dada de baja")
    
    # Si pasa todos los filtros, le damos acceso
    return {
        "mensaje": f"¡Bienvenido al CMMS, {usuario_db.rol}!",
        "username": usuario_db.username,
        "rol": usuario_db.rol
    }

# ESQUEMAS (MOLDES) PARA LOS CATÁLOGOS


class EquipoCreate(BaseModel):
    codigo_interno: str
    nombre: str
    area_ubicacion: str
    estado: Optional[str] = "Operativo"  # Por defecto entra funcionando
    notas_adicionales: Optional[str] = None

class TecnicoCreate(BaseModel):
    nombre: str
    estado: Optional[str] = "Activo"  # Por defecto entra activo


# RUTAS PARA REGISTRAR EQUIPOS Y TÉCNICOS

@app.post("/api/equipos/", tags=["Catálogos del Sistema"])
def registrar_equipo(equipo: EquipoCreate, db: Session = Depends(get_db)):
    """
    Da de alta una nueva máquina o equipo en la planta.
    """
    nuevo_equipo = models.Equipo(
        codigo_interno=equipo.codigo_interno,
        nombre=equipo.nombre,
        area_ubicacion=equipo.area_ubicacion,
        estado=equipo.estado,
        notas_adicionales=equipo.notas_adicionales
    )
    
    db.add(nuevo_equipo)
    db.commit()
    db.refresh(nuevo_equipo)
    
    return {
        "mensaje": "¡Equipo registrado exitosamente!", 
        "id_equipo": nuevo_equipo.id_equipo
    }

@app.post("/api/tecnicos/", tags=["Catálogos del Sistema"])
def registrar_tecnico(tecnico: TecnicoCreate, db: Session = Depends(get_db)):
    """
    Registra a un nuevo técnico de mantenimiento.
    """
    nuevo_tecnico = models.Tecnico(
        nombre=tecnico.nombre,
        estado=tecnico.estado
    )
    
    db.add(nuevo_tecnico)
    db.commit()
    db.refresh(nuevo_tecnico)
    
    return {
        "mensaje": "¡Técnico registrado exitosamente!", 
        "id_tecnico": nuevo_tecnico.id_tecnico
    }

@app.get("/api/equipos/", tags=["Catálogos del Sistema"])
def obtener_todos_los_equipos(db: Session = Depends(get_db)):
    """
    Devuelve la lista completa de equipos registrados. 
    Ideal para llenar menús desplegables (dropdowns) en la app.
    """
    lista_equipos = db.query(models.Equipo).all()
    return lista_equipos

@app.get("/api/tecnicos/", tags=["Catálogos del Sistema"])
def obtener_todos_los_tecnicos(db: Session = Depends(get_db)):
    """
    Devuelve la lista completa de técnicos activos en la planta.
    """
    lista_tecnicos = db.query(models.Tecnico).all()
    return lista_tecnicos

@app.post("/api/equipos/", tags=["Catálogo de Maquinaria"])
def registrar_equipo(equipo: schemas.EquipoCreate, db: Session = Depends(get_db)):
    # Desempaquetamos los datos validados por Pydantic hacia el modelo de la BD
    nuevo_equipo = models.Equipo(
        codigo_interno=equipo.codigo_interno,
        nombre=equipo.nombre,
        area_ubicacion=equipo.area_ubicacion,
        estado=equipo.estado,
        notas_adicionales=equipo.notas_adicionales
    )
    
    db.add(nuevo_equipo)
    db.commit()
    db.refresh(nuevo_equipo)
    
    return nuevo_equipo

@app.delete("/api/equipos/{equipo_id}", tags=["Catálogo de Maquinaria"])
def eliminar_equipo(equipo_id: int, db: Session = Depends(get_db)):
    # Buscamos el equipo por su ID
    equipo = db.query(models.Equipo).filter(models.Equipo.id_equipo == equipo_id).first()
    
    if equipo:
        db.delete(equipo)
        db.commit()
        return {"mensaje": "Equipo eliminado correctamente"}
    return {"error": "Equipo no encontrado"}

@app.put("/api/equipos/{equipo_id}", tags=["Catálogo de Maquinaria"])
def actualizar_equipo(equipo_id: int, equipo_actualizado: schemas.EquipoCreate, db: Session = Depends(get_db)):
    equipo = db.query(models.Equipo).filter(models.Equipo.id_equipo == equipo_id).first()
    
    if equipo:
        equipo.codigo_interno = equipo_actualizado.codigo_interno
        equipo.nombre = equipo_actualizado.nombre
        equipo.area_ubicacion = equipo_actualizado.area_ubicacion
        equipo.estado = equipo_actualizado.estado # <--- AÑADIMOS ESTA LÍNEA
        
        db.commit()
        db.refresh(equipo)
        return equipo
        
    return {"error": "Equipo no encontrado"}

@app.put("/api/tecnicos/{tecnico_id}", tags=["Control de Personal"])
def actualizar_tecnico(tecnico_id: int, tecnico_actualizado: schemas.TecnicoBase, db: Session = Depends(get_db)):
    tecnico = db.query(models.Tecnico).filter(models.Tecnico.id_tecnico == tecnico_id).first()
    
    if tecnico:
        tecnico.nombre = tecnico_actualizado.nombre
        tecnico.estado = tecnico_actualizado.estado
        
        db.commit()
        db.refresh(tecnico)
        return tecnico
        
    return {"error": "Técnico no encontrado"}

@app.delete("/api/tecnicos/{tecnico_id}", tags=["Control de Personal"])
def eliminar_tecnico(tecnico_id: int, db: Session = Depends(get_db)):
    # 1. Buscamos al técnico por su ID
    tecnico = db.query(models.Tecnico).filter(models.Tecnico.id_tecnico == tecnico_id).first()
    
    # 2. Si lo encuentra, lo borramos de la base de datos
    if tecnico:
        db.delete(tecnico)
        db.commit()
        return {"mensaje": "Técnico eliminado correctamente"}
        
    return {"error": "Técnico no encontrado"}

@app.get("/api/bitacoras/", response_model=list[schemas.BitacoraResponse], tags=["Historial de Bitácoras"])
def obtener_bitacoras(db: Session = Depends(get_db)):
    # 1. Hacemos la consulta con los JOIN
    resultados = db.query(
        models.Bitacora.id_bitacora,
        models.Bitacora.fecha_registro,
        models.Bitacora.tipo_mantenimiento,
        models.Bitacora.descripcion,
        models.Bitacora.detalles_repuestos,
        models.Equipo.nombre.label("nombre_equipo"),
        models.Tecnico.nombre.label("nombre_tecnico")
    ).join(models.Equipo, models.Bitacora.id_equipo == models.Equipo.id_equipo)\
     .join(models.Tecnico, models.Bitacora.id_tecnico == models.Tecnico.id_tecnico).all()

    # 2. Convertimos estrictamente cada fila (Row) en un diccionario
    bitacoras_formateadas = []
    for r in resultados:
        bitacoras_formateadas.append({
            "id_bitacora": r.id_bitacora,
            "fecha_registro": r.fecha_registro,
            "nombre_equipo": r.nombre_equipo,
            "nombre_tecnico": r.nombre_tecnico,
            "tipo_mantenimiento": r.tipo_mantenimiento,
            "descripcion": r.descripcion,
            "detalles_repuestos": r.detalles_repuestos
        })
        
    return bitacoras_formateadas