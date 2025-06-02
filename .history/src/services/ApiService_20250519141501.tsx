import axios, { AxiosResponse } from 'axios';

const ApiService = axios.create({
    baseURL: 'http://localhost:8081/', // Asegúrate de que la URL sea la correcta para tu backend
});

// Obtener parentescos
export const fetchParentescos = (): Promise<AxiosResponse> => {
    return ApiService.get('parentesco');
};

// Crear usuario
export const registerUser = (data: any): Promise<AxiosResponse> => {
    return ApiService.post('users', data);
};

// Método de login
export const loginUser = (email: string, password: string): Promise<AxiosResponse> => {
    return ApiService.post('users/login', { email, password });
};

// Obtener todas las actividades
export const fetchAllActivities = (): Promise<AxiosResponse> => {
  return ApiService.get('/activities');
};

// Eliminar una actividad
export const deleteActivity = (id: number): Promise<AxiosResponse> => {
  return ApiService.delete(`/activities/${id}`);
};


export default ApiService;
