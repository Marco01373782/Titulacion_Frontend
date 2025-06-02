 
    import axios from 'axios';

    const api = axios.create({
    baseURL: 'http://localhost:8081', 
    });

    // Obtener parentescos
    export const fetchParentescos = () => {
    return api.get('/parentescos');
    };

    // Crear usuario
    export const registerUser = (data: any) => {
    return api.post('/users', data);
    };

    export default ApiService;
