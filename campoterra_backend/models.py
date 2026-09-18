from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text, TIMESTAMP
from sqlalchemy.orm import relationship
from database import Base
import datetime

# Modelo para la tabla de Equipos
class Equipo(Base):
    __tablename__ = "equipos"

    id_equipo = Column(Integer, primary_key=True, index=True)
    codigo_interno = Column(String(50), unique=True)
    nombre = Column(String(100))
    area_ubicacion = Column(String(100))
    estado = Column(String(50), default="Operativo")
    notas_adicionales = Column(String(255))

    bitacoras = relationship("Bitacora", back_populates="equipo")

# Modelo para la tabla de Técnicos
class Tecnico(Base):
    __tablename__ = "tecnicos"

    id_tecnico = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    estado = Column(String(50), default="Activo")

    bitacoras = relationship("Bitacora", back_populates="tecnico")

# Modelo para la tabla de Turnos
class Turno(Base):
    __tablename__ = "turnos"

    id_turno = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String(50))
    hora_inicio = Column(String(10))
    hora_fin = Column(String(10))

    bitacoras = relationship("Bitacora", back_populates="turno")

# Modelo para la tabla transaccional de Bitácoras
class Bitacora(Base):
    __tablename__ = "bitacoras"

    id_bitacora = Column(Integer, primary_key=True, index=True)
    id_equipo = Column(Integer, ForeignKey("equipos.id_equipo"))
    id_tecnico = Column(Integer, ForeignKey("tecnicos.id_tecnico"))
    id_turno = Column(Integer, ForeignKey("turnos.id_turno")) # <--- Solo agregamos el ForeignKey aquí
    tipo_mantenimiento = Column(String(50))
    descripcion = Column(Text)
    detalles_repuestos = Column(Text)
    fecha_registro = Column(TIMESTAMP)

    equipo = relationship("Equipo", back_populates="bitacoras")
    tecnico = relationship("Tecnico", back_populates="bitacoras")
    turno = relationship("Turno", back_populates="bitacoras")

# Modelo para la tabla de Usuarios (Login para el Dashboard de Jefatura)
class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True) # Ej: jrios
    password = Column(String(255))  # Aquí guardaremos la contraseña
    rol = Column(String(50), default="Administrador")  # Para control interno
    activo = Column(Boolean, default=True) # Por si algún día cambian de encargado

    from sqlalchemy import Column, Integer, String

class Pieza(Base):
    __tablename__ = "piezas"
    
    id_pieza = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    codigo = Column(String(50), unique=True, nullable=False)
    stock = Column(Integer, default=0)
    categoria = Column(String(50), default="General")
    icon = Column(String(50), default="cog-outline") # Para el ícono en la app

class MovimientoPieza(Base):
    __tablename__ = "movimientos_piezas"

    id_movimiento = Column(Integer, primary_key=True, index=True)
    id_pieza = Column(Integer, ForeignKey("piezas.id_pieza"), nullable=False)
    tipo = Column(String(20), nullable=False)  # Entrada o Salida
    cantidad = Column(Integer, nullable=False)
    motivo = Column(String(255), nullable=False)
    fecha_movimiento = Column(TIMESTAMP, nullable=False)

    pieza = relationship("Pieza")


class Notificacion(Base):
    __tablename__ = "notificaciones"

    id_notificacion = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(50), nullable=False, default="informativa")
    titulo = Column(String(150), nullable=False)
    mensaje = Column(Text, nullable=False)
    fecha = Column(TIMESTAMP, nullable=False)
    leida = Column(Boolean, nullable=False, default=False, index=True)
    enlace = Column(String(255), nullable=True)
    referencia_id = Column(Integer, nullable=True)