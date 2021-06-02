import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:4000/api/act/';

class ActividadService {
    create(data) {
        return axios.post(API_URL + "new-actividad/", data);
    }

    getActividadByName(nombre){
        return axios.get(`get-actividad/?nombre=${nombre}`);
    }

    getActividad(id){
        return axios.get(API_URL + "get-actividad/"+id);
    }

    getActividadesList() {
        return axios.get(API_URL + 'get-actividades');
    }

    getActividadesBySearch(searchString) {
        return axios.get(API_URL + 'search-actividad/'+ searchString);
    }

    apuntarActividad(actID, userID){
        return axios.put(API_URL + "apuntar-actividad/"+actID, {"userID": userID});
    }

    desapuntarActividad(actID, userID){
        return axios.put(API_URL + "desapuntar-actividad/"+actID, {"userID": userID});
    }

    deleteActividad(id) {
        return axios.delete(API_URL + 'delete-actividad/' + id, { headers: authHeader() });
    }

    upload(file, id, onUploadProgress) {
        let formData = new FormData();

        formData.append("file", file);

        return axios.post(API_URL + 'upload-actividad-images/' + id, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress
        });
    }

    downloadFile(filename) {
        return axios.get(API_URL + 'download-file/' + filename);
    }

    deleteFile(filename, id) {
        return axios.put(API_URL + 'delete-actividad-file/' + id, {
            "filename": filename,
        });
    }

    getFiles(id) {
        return axios.get(API_URL + 'get-actividad-images/' + id);
    }

    createReseña(des, userID, actID) {
        return axios.post(API_URL + "new-resenha/", {"descripcion": des, "userID": userID, "actID": actID});
    }

    deleteReseña(id) {
        return axios.delete(API_URL + 'delete-resenha/' + id);
    }

    getReseñaList(id) {
        return axios.get(API_URL + 'get-resenhas/'+ id);
    }

    getReseña(id) {
        return axios.get(API_URL + 'get-resenha/'+ id);
    }

    updateReseñaVotos(resID, userID, vContra, vFavor){
        return axios.put(API_URL + "update-resenha-votos/"+resID, {"userID": userID, "vContra": vContra, "vFavor": vFavor});
    }

}

export default new ActividadService();