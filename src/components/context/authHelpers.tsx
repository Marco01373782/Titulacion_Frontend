// src/utils/authHelpers.ts
import { NavigateFunction } from 'react-router-dom';

interface OAuthResponse {
    token: string;
    id: number;
    email: string;
    roles: string[];
}

export const handleOAuthLogin = async (
    provider: 'google' | 'facebook',
    mode: 'login' | 'register',
    navigate: NavigateFunction
) => {
    try {
        // Simulamos que obtienes la info desde tu backend
        const backendUrl = `https://tu-api.com/oauth/${provider}?mode=${mode}`;

        // Simulación de login con redirección real:
        window.location.href = backendUrl;

        // O si haces popup OAuth + token:
        // const response: OAuthResponse = await tuLógicaOAuth(provider);
        // localStorage.setItem('token', response.token);
        // localStorage.setItem('userId', response.id.toString());
        // localStorage.setItem('userRole', response.roles[0]);
        // localStorage.setItem('user', JSON.stringify(response));
        // navigate según rol

    } catch (error) {
        console.error('Error en login con', provider, error);
    }
};
