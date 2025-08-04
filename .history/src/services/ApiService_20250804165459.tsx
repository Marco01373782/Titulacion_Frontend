import axios, { AxiosResponse } from 'axios';
import { Patient } from '../data/types';

const ApiService = axios.create({
  //baseURL: 'https://neurox-backend.onrender.com',
  //baseURL: 'http://localhost:8081',
});

// ─── PREGUNTAS ────────────────────────────────────────────────
//

export const createQuestion = (activityId: number, data: {
  questionText: string;
  answers: { answerText: string; isCorrect: boolean }[];
}): Promise<AxiosResponse> => {
  return ApiService.post(`/api/questions/${activityId}`, data);
};

export const getQuestionsByActivity = (activityId: number): Promise<AxiosResponse> => {
  return ApiService.get(`/api/questions/activity/${activityId}`);
};
// EDITAR pregunta
export const updateQuestion = (questionId: number, data: {
  questionText: string;
  answers: { answerText: string; isCorrect: boolean }[];
}): Promise<AxiosResponse> => {
  return ApiService.put(`/api/questions/${questionId}`, data);
};





// ─── ACTIVIDADES ────────────────────────────────────────────────
//
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

//
// ─── ENUMS ──────────────────────────────────────────────────────
//
export const fetchDifficulties = (): Promise<AxiosResponse<string[]>> => {
  return ApiService.get('/enums/difficulties');
};

export const fetchActivityTypes = (): Promise<AxiosResponse<string[]>> => {
  return ApiService.get('/enums/activity-types');
};

export const fetchParentescos = (): Promise<AxiosResponse<string[]>> => {
  return ApiService.get('/enums/parentesco');
};

export const fetchGender = (): Promise<AxiosResponse<string[]>> => {
  return ApiService.get('/enums/gender');
};

//
// ─── USUARIOS ──────────────────────────────────────────────────
//
export const registerUser = (data: any): Promise<AxiosResponse> => {
  return ApiService.post('/users', data);
};

export const loginUser = (email: string, password: string): Promise<AxiosResponse> => {
  return ApiService.post('/users/login', { email, password });
};

export const getUserById = (id: number): Promise<AxiosResponse> => {
  return ApiService.get(`/users/${id}`);
};


export const fetchAllUsers = (): Promise<AxiosResponse> => {
  return ApiService.get('/users');
};

export const createUserByAdmin = (userData: {
  email: string;
  password: string;
  roles: string[]; // ["admin"] o ["user"]
}): Promise<AxiosResponse> => {
  return ApiService.post('/users', userData);
};
export const deleteUserById = (id: number): Promise<AxiosResponse> => {
  return ApiService.delete(`/users/delete/${id}`);
};

//
// ─── PACIENTES ─────────────────────────────────────────────────
//
export const createPatient = (data: any): Promise<AxiosResponse> => {
  return ApiService.post('/patients', data);
};

export async function updatePatient(id: number, data: any) {
  return await ApiService.put(`/patients/${id}`, data);
}

export async function getPacientePorUsuario(userId: string) {
  return await ApiService.get(`/patients/by-user/${userId}`);
}

export const getFullPatientByUserId = (userId: number): Promise<AxiosResponse<Patient>> => {
  return ApiService.get(`/patients/by-user-full/${userId}`);
};

//
// ─── SESIONES ──────────────────────────────────────────────────
//
export const fetchAllSessions = (): Promise<AxiosResponse> => {
  return ApiService.get('/sesions');
};

export const fetchSessionById = (id: number): Promise<AxiosResponse> => {
  return ApiService.get(`/sesions/${id}`);
};

export const createSession = (data: any): Promise<AxiosResponse> => {
  return ApiService.post('/sesions', data);
};

export const updateSessionBasic = (
  id: number,
  data: { title: string; description: string }
): Promise<AxiosResponse> => {
  return ApiService.put(`/sesions/${id}`, data);
};

export const deleteSession = (id: number): Promise<AxiosResponse> => {
  return ApiService.delete(`/sesions/${id}`);
};

export const fetchStatusSesion = async (): Promise<string[]> => {
  const response = await ApiService.get('/status-sesion');
  return response.data;
};

//
// ─── SESIONES USUARIO ──────────────────────────────────────────
//
export const fetchSessionsByUser = async (userId: number) => {
  const res = await ApiService.get(`/sesion-usuario/user/${userId}`);
  return res.data;
};

export const getSesionesUsuario = (userId: number | string): Promise<AxiosResponse> => {
  return ApiService.get(`/sesion-usuario/user/${userId}`);
};

export const getSesionUsuarioBySesionAndUser = async (sesionId: number, userId: number) => {
  const res = await ApiService.get(`/sesion-usuario/sesion/${sesionId}/user/${userId}`);
  return res.data;
};

export const updateSesionUsuario = async (id: number, data: any) => {
  const response = await ApiService.put(`/sesion-usuario/${id}`, data);
  return response.data;
};

export const getSesionUsuarioById = async (id: number) => {
  const response = await ApiService.get(`/sesion-usuario/${id}`);
  return response.data;
};

//
// ─── ASIGNACIÓN DE ACTIVIDADES A SESIONES ──────────────────────
//
export const assignActivitiesAuto = (sessionId: number): Promise<AxiosResponse> => {
  return ApiService.post(`/session-activities/assign/${sessionId}`);
};

export const assignActivitiesManual = (sessionId: number, activityIds: number[]): Promise<AxiosResponse> => {
  return ApiService.post(`/session-activities/assign-manual/${sessionId}`, { activityIds });
};

export const fetchActivitiesBySession = async (sessionId: number) => {
  try {
    const response = await ApiService.get(`/session-activities/by-session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("❌ [fetchActivitiesBySession] Error:", error);
    throw error;
  }
};

//
// ─── RESULTADOS DE ACTIVIDADES ─────────────────────────────────
//
export const saveSessionActivityResult = (data: any): Promise<AxiosResponse> => {
  return ApiService.post('/session-activity-results', data);
};
export const postSessionActivityResult = (data: any): Promise<AxiosResponse> => {
  return ApiService.post('/session-activity-results', data);
};

export const fetchSessionActivityResult = (
  sessionId: number,
  userId: number
): Promise<AxiosResponse> => {
  return ApiService.get(`/session-activity-results/by-session-user?sessionId=${sessionId}&userId=${userId}`);
};

export const getResultadosActividadPorSesionYUsuario = (
  sessionId: number,
  userId: number | string
): Promise<AxiosResponse> => {
  return ApiService.get('/session-activity-results/by-session-user', {
    params: {
      sessionId: Number(sessionId),
      userId: Number(userId),
    },
  });
};

export const getAverageForSessionAndUser = (sessionId: number, userId: number) =>
  ApiService.get(`/session-activity-results/average?sessionId=${sessionId}&userId=${userId}`);

export default ApiService;
