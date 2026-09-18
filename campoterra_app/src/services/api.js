// src/services/api.js

// IMPORTANTE: En Expo/React Native, 'localhost' o '127.0.0.1' no siempre funciona 
// src/services/api.js
const BASE_URL = 'http://192.168.1.125:8000'; // Usa tu IP local
let mobileAccessToken = null;

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || `Error del servidor (${response.status})`);
  }
  return data;
};

const authenticatedFetch = (url, options = {}) => {
  if (!mobileAccessToken) {
    throw new Error('La sesión móvil no está disponible. Inicia la jornada nuevamente.');
  }
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${mobileAccessToken}`,
  };
  return fetch(url, { ...options, headers });
};

export const clearMobileSession = () => {
  mobileAccessToken = null;
};

export const startShift = async (tecnico, turno) => {
  try {
    const response = await fetch(`${BASE_URL}/api/shift/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tecnico_id: tecnico.id_tecnico,
        turno_id: turno.id_turno,
      })
    });


    const data = await parseResponse(response);
    if (!data.access_token) {
      throw new Error('El servidor no devolvió un token de sesión para la jornada.');
    }
    mobileAccessToken = data.access_token;
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
    return await parseResponse(response);
  } catch (error) {
    console.error('Error en getShiftOptions:', error);
    throw error;
  }
};

// Agrega esto debajo de tus otras funciones

export const submitNewReport = async (reportData) => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/api/reports/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData)
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('Error en submitNewReport:', error);
    throw error;
  }
};

export const submitUrgentAlert = async (alertData) => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/api/reports/urgent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alertData)
    });

    return await parseResponse(response);
  } catch (error) {
    console.error('Error en submitUrgentAlert:', error);
    throw error;
  }
};

export const getEquipos = async () => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/api/equipos/`);
    return await parseResponse(response);
  } catch (error) {
    console.error('Error en getEquipos:', error);
    throw error;
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/api/dashboard/stats`);
    return await parseResponse(response);
  } catch (error) {
    console.error('Error en getDashboardStats:', error);
    throw error;
  }
};

export const getPiezas = async () => {
  try {
    const response = await authenticatedFetch(`${BASE_URL}/api/piezas/`);
    return await parseResponse(response);
  } catch (error) {
    console.error("Error obteniendo piezas:", error);
    throw error;
  }
};