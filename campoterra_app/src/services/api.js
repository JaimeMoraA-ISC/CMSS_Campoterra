// src/services/api.js

// IMPORTANTE: En Expo/React Native, 'localhost' o '127.0.0.1' no siempre funciona 
// src/services/api.js
const BASE_URL = 'http://192.168.1.124:8000'; // Usa tu IP local

export const startShift = async (tecnico, turno) => {
  try {
    const response = await fetch(`${BASE_URL}/api/shift/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tecnico: tecnico,
        turno: turno
      })
    });


    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Error al registrar el turno en el servidor');
    }

    return data; 
  } catch (error) {
    console.error('Error en startShift:', error);
    throw error;
  }
};
// Agrega esto debajo de tu función startShift existente

export const getShiftOptions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/shift/options`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Error al cargar las opciones');
    }
    
    return data;
  } catch (error) {
    console.error('Error en getShiftOptions:', error);
    throw error;
  }
};

// Agrega esto debajo de tus otras funciones

export const submitNewReport = async (reportData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/reports/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Error al guardar el reporte en el servidor');
    }

    return data;
  } catch (error) {
    console.error('Error en submitNewReport:', error);
    throw error;
  }
};

export const submitUrgentAlert = async (alertData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/reports/urgent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || 'Error al enviar la alerta urgente');
    }

    return data;
  } catch (error) {
    console.error('Error en submitUrgentAlert:', error);
    throw error;
  }
};

export const getEquipos = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/equipos/`);
    const data = await response.json();
    if (!response.ok) throw new Error('Error al cargar equipos');
    return data;
  } catch (error) {
    console.error('Error en getEquipos:', error);
    throw error;
  }
};