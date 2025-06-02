import axios from 'axios';

const ApiService = axios.create({
    baseURL: 'http://localhost:8081/', // Asegúrate de que la URL sea la correcta para tu backend
});

// Obtener parentescos
export const fetchParentescos = () => {
    return ApiService.get('parentesco');
};

// Crear usuario
export const registerUser = (data: any) => {
    return ApiService.post('users', data);
};

// Método de login
export const loginUser = (email, password) => {
    return ApiService.post('users/login', { email, password });
};

export default ApiService;
