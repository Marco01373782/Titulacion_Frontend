import axios, { AxiosResponse } from 'axios';

const ApiService = axios.create({
  baseURL: 'http://localhost:8081/',
});

// Obtener todas las actividades
export const fetchAllActivities = (): Promise<AxiosResponse> => {
  return ApiService.get('/activities');
};

// Obtener una actividad por id
export const fetchActivityById = (id: number): Promise<AxiosResponse> => {
  return ApiService.get(`/activities/${id}`);
};

// Actualizar actividad
export const updateActivity = (id: number, data: any): Promise<AxiosResponse> => {
  return ApiService.put(`/activities/${id}`, data);
};

// Eliminar actividad
export const deleteActivity = (id: number): Promise<AxiosResponse> => {
  return ApiService.delete(`/activities/${id}`);
};

// Obtener dificultades
export const fetchDifficulties = (): Promise<AxiosResponse> => {
  return ApiService.get('/difficulties');
};

// Obtener tipos de actividad
export const fetchActivityTypes = (): Promise<AxiosResponse> => {
  return ApiService.get('/activity-types');
};

// Otros endpoints...

export default ApiService;
