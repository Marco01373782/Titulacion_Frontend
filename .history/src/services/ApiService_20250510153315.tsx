 
    import axios from 'axios';

    const api = axios.create({
    baseURL: 'http://localhost:8081', 
    });

    export const fetchParentescos = () => {
    return api.get('/parentescos');
    };

    export const registerUser = (data: any) => {
    return api.post('/users', data);
    };

    export default api;
