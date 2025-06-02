 
    import axios from 'axios';

    const ApiService = axios.create({
    baseURL: 'http://localhost:8081', 
    });

    // Obtener parentescos
    export const fetchParentescos = () => {
    return api.get('/parentescos');
    };

    // Crear usuario
    export const registerUser = (data: any) => {
    return ApiService.post('/users', data);
    };

    export default ApiService;
