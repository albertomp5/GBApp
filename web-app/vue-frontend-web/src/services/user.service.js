import axios from 'axios';
import authHeader from './auth-header';


const API_URL = 'http://gbapp.ddns.net:4000/api/test/';

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all');
    }

    getUserBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }

    getUserData(userID) {
        return axios.get(API_URL + 'user-data/' + userID, { headers: authHeader() });
    }

    getUser(userID) {
        return axios.get(API_URL + 'get-user/' + userID, { headers: authHeader() });
    }

    updateUserData(userID, userData) {
        return axios
            .put(API_URL + 'update-user-data/' + userID, {
                headers: authHeader(),  
                body: {
                    "peso": userData.peso,
                    "altura": userData.altura,
                    "imc": userData.imc,
                }
            })
            .then(response => {
                return response.data;
            });
    }
    upload(file, userID, onUploadProgress) {
        let formData = new FormData();

        formData.append("file", file);

        return axios.post(API_URL + 'upload-user-images/' + userID, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress
        });
    }

    downloadFile(filename) {
        return axios.get(API_URL + 'download-file/' + filename);
    }

    deleteFile(filename, userID) {
        return axios.put(API_URL + 'delete-user-file/' + userID, {
            "filename": filename,
        });
    }

    getFiles(userID) {
        return axios.get(API_URL + 'get-user-images/' + userID);
    }

    getUsersList() {
        return axios.get(API_URL + 'get-users', { headers: authHeader() });
    }

    getUsersBySearch(searchString) {
        return axios.get(API_URL + 'search-user/' + searchString, { headers: authHeader() });
    }

    getAdminBoard() {
        return axios.get(API_URL + 'admin', { headers: authHeader() });
    }

    deleteUser(userID) {
        return axios.delete(API_URL + 'delete-user/' + userID, { headers: authHeader() });
    }

    getMatricula(userID) {
        return axios.get(API_URL + 'get-user-matricula/' + userID, { headers: authHeader() });
    }

    pagarMatricula(userID, data) {
        return axios.post(API_URL + 'pagar-matricula/' + userID, data, { headers: authHeader() });
    }

    matriculaPaid(userID) {
        return axios.get(API_URL + 'mpaid/' + userID, { headers: authHeader() });
    }
    hacerAdmin(userID) {
        return axios.put(API_URL + 'hacer-admin/' + userID,"" ,{ headers: authHeader() });
    }
}

export default new UserService();
