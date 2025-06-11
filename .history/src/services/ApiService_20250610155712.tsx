import axios, { AxiosResponse } from 'axios';

const ApiService = axios.create({
  baseURL: 'http://localhost:8081/',
});

// Actividades
export const fetchAllActivities = (): Promise<AxiosResponse> => {
  return ApiService.get('/activities');
};

export const fetchActivityById = (id: number): Promise<AxiosResponse> => {
  return ApiService.get(`/activities/${id}`);
};

export const createActivity = (data: any): Promise<AxiosResponse> => {
  return ApiService.post('/activities', data);
};

export const updateActivity = (id: number, data: any): Promise<AxiosResponse> => {
  return ApiService.put(`/activities/${id}`, data);
};

export const deleteActivity = (id: number): Promise<AxiosResponse> => {
  return ApiService.delete(`/activities/${id}`);
};

// Enums — SOLO desde /enums
export const fetchDifficulties = (): Promise<AxiosResponse<string[]>> => {
  return ApiService.get('/enums/difficulties');
};

export const fetchActivityTypes = (): Promise<AxiosResponse<string[]>> => {
  return ApiService.get('/enums/activity-types');
};

// --- Enums ---
export const fetchParentescos = (): Promise<AxiosResponse<string[]>> => {
  return ApiService.get('/enums/parentesco');
};
export const fetchGender = (): Promise<AxiosResponse<string[]>> => {
  return ApiService.get('/enums/gender');
};

// Ya no existe fetchGenders ni fetchParentescos porque no existen en backend como recursos separados

// Usuarios
export const registerUser = (data: any): Promise<AxiosResponse> => {
  return ApiService.post('/users', data);
};

export const loginUser = (email: string, password: string): Promise<AxiosResponse> => {
  return ApiService.post('/users/login', { email, password });
};

// Sesiones
export const fetchAllSessions = (): Promise<AxiosResponse> => {
  return ApiService.get('/sesions');
};

export const fetchSessionById = (id: number): Promise<AxiosResponse> => {
  return ApiService.get(`/sesions/${id}`);
};

export const createSession = (data: any): Promise<AxiosResponse> => {
  return ApiService.post('/sesions', data);
};

export const updateSessionBasic = (id: number, data: { title: string; description: string }): Promise<AxiosResponse> => {
  return ApiService.put(`/sesions/${id}`, data);
};

export const deleteSession = (id: number): Promise<AxiosResponse> => {
  return ApiService.delete(`/sesions/${id}`);
};

// Asignación de actividades a sesiones
export const assignActivitiesAuto = (sessionId: number): Promise<AxiosResponse> => {
  return ApiService.post(`/session-activities/assign/${sessionId}`);
};

export const assignActivitiesManual = (sessionId: number, activityIds: number[]): Promise<AxiosResponse> => {
  return ApiService.post(`/session-activities/assign-manual/${sessionId}`, {
    activityIds
  });
};

// Obtener actividades asignadas a una sesión
export const fetchActivitiesBySession = async (sessionId: number) => {
  try {
    console.log("📦 [fetchActivitiesBySession] Solicitando actividades para sesión ID:", sessionId);
    const response = await ApiService.get(`/session-activities/by-session/${sessionId}`);
    console.log("✅ [fetchActivitiesBySession] Actividades obtenidas:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [fetchActivitiesBySession] Error al obtener actividades:", error);
    throw error;
  }
};

// Obtener sesiones asignadas a un usuario (modo individual)
export const fetchSessionsByUser = (userId: number): Promise<AxiosResponse> => {
  return ApiService.get(`/sessions/by-user/${userId}`);
};

// Resultados de actividades completadas
export const postSessionActivityResult = (data: any): Promise<AxiosResponse> => {
  return ApiService.post('/session-activity-results', data);
};

export const fetchSessionActivityResult = (sessionId: number, userId: number): Promise<AxiosResponse> => {
  return ApiService.get(`/session-activity-results/by-session-user?sessionId=${sessionId}&userId=${userId}`);
};

export const saveSessionActivityResult = (data: any): Promise<AxiosResponse> => {
  return ApiService.post('/session-activity-results', data);
};

export const createPatient = (data: any): Promise<AxiosResponse> => {
  return ApiService.post('/patients', data);
};

export const getSesionUsuarioBySesionAndUser = async (sesionId: number, userId: number) => {
  const res = await axios.get(`/sesion-usuario/sesion/${sesionId}/user/${userId}`);
  return res.data;
};

export const saveSesionUsuarioUpdate = async (sesionUsuarioId: number, payload: any) => {
  const res = await axios.put(`/sesion-usuario/${sesionUsuarioId}`, payload);
  return res.data;
};
          export async function updateSesionUsuario(id: number, data: any) {
    const response = await axios.put(`/sesion-usuario/${id}`, data);
    return response.data;
}

export const fetchSesionesUsuarioByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`/'/sesion-usuario/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener sesiones del usuario:', error);
    throw error;
  }
};
export const fetchSesionUsuarioBySesionAndUser = async (sesionId: number, userId: number) => {
  return await api.get(`/sesion-usuario/sesion/${sesionId}/user/${userId}`);
};


export default ApiService;
