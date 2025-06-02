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
    
    export const createActivity = (data: any): Promise<AxiosResponse> => {
    return ApiService.post('/activities', data);
};
    // Actualizar actividad
    export const updateActivity = (id: number, data: any): Promise<AxiosResponse> => {
    return ApiService.put(`/activities/${id}`, data);
    };
    // Eliminar una actividad
    export const deleteActivity = (id: number): Promise<AxiosResponse> => {
    return ApiService.delete(`/activities/${id}`);
    };

    // Obtener todas las dificultades
    export const fetchDifficulties = (): Promise<AxiosResponse> => {
    return ApiService.get('/difficulties');
    };

    // Obtener todos los tipos de actividad
    export const fetchActivityTypes = (): Promise<AxiosResponse> => {
    return ApiService.get('/activity-types');
    };

    // Otros endpoints...
    export const fetchParentescos = (): Promise<AxiosResponse> => {
    return ApiService.get('parentesco');
    };

    export const registerUser = (data: any): Promise<AxiosResponse> => {
    return ApiService.post('users', data);
    };

    export const loginUser = (email: string, password: string): Promise<AxiosResponse> => {
    return ApiService.post('users/login', { email, password });
    };

    // Obtener todas las sesiones
export const fetchAllSessions = (): Promise<AxiosResponse> => {
  return ApiService.get('/sesiones');
};

// Obtener una sesión por ID
export const fetchSessionById = (id: number): Promise<AxiosResponse> => {
  return ApiService.get(`/sesiones/${id}`);
};

// Crear nueva sesión
export const createSession = (data: any): Promise<AxiosResponse> => {
  return ApiService.post('/sesiones', data);
};

// Actualizar una sesión existente
export const updateSession = (id: number, data: any): Promise<AxiosResponse> => {
  return ApiService.put(`/sesiones/${id}`, data);
};

// Eliminar una sesión
export const deleteSession = (id: number): Promise<AxiosResponse> => {
  return ApiService.delete(`/sesiones/${id}`);
};

    export default ApiService;
