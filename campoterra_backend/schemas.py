from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# 1. Esquema Base (Los datos comunes que siempre se usan)
class EquipoBase(BaseModel):
    codigo_interno: str
    nombre: str
    area_ubicacion: str
    estado: str = "Operativo"
    notas_adicionales: Optional[str] = None

# 2. Esquema para Crear (Cuando enviamos datos desde un formulario)
class EquipoCreate(EquipoBase):
    pass # Hereda todo lo de EquipoBase sin cambios

# 3. Esquema de Respuesta (Lo que la API le devuelve al Dashboard Web)
class Equipo(EquipoBase):
    id_equipo: int

    class Config:
        from_attributes = True


# ==========================================
# ESQUEMAS PARA CONTROL DE PERSONAL (TÉCNICOS)
# ==========================================
class TecnicoBase(BaseModel):
    nombre: str
    estado: str = "Activo"

class TecnicoCreate(TecnicoBase):
    pass

class Tecnico(TecnicoBase):
    id_tecnico: int
    
    class Config:
        from_attributes = True


# ==========================================
# ESQUEMAS PARA HISTORIAL DE BITÁCORAS
# ==========================================
class BitacoraResponse(BaseModel):
    id_bitacora: int
    fecha_registro: datetime
    nombre_equipo: str
    nombre_tecnico: str
    tipo_mantenimiento: str
    descripcion: str
    detalles_repuestos: str | None = None

    class Config:
        from_attributes = True