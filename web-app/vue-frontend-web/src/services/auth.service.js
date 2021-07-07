import axios from 'axios';

const API_URL = 'https://gbapp.ddns.net:4000/api/auth/';

class AuthService {
    login(user) {
        return axios
            .post(API_URL + 'signin', {
                email: user.email,
                contraseña: user.contraseña
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(user) {
        return axios.post(API_URL + 'signup', {
            nombre: user.nombre,
            apellidos: user.apellidos,
            email: user.email,
            contraseña: user.contraseña
        });
    }

    requestPasswordReset(email){
        return axios.post(API_URL + "request-reset-password/",{email});
    }

    resetPassword(userId, token, password){
        return axios.post(API_URL + "reset-password/",{userId, token, password });
    }
}

export default new AuthService();
