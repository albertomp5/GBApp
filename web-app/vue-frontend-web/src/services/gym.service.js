import axios from 'axios';

const API_URL = 'https://gbapp.ddns.net/api/gym/';

class GymService {

    getGymData() {
        return axios.get(API_URL + 'get-gym-data/');
    }

    create(data) {
        return axios.post(API_URL + "new-maquina/", {"nombre": data});
    }

    getMaquina(maqID){
        return axios.get(API_URL + 'get-maquina/' + maqID);
    }

    getMaquinasList() {
        return axios.get(API_URL + 'get-maquinas/');
    }

    getMaquinasLibresList() {
        return axios.get(API_URL + 'get-maquinas-libres/');
    }

    getMaquinasOcupadasList() {
        return axios.get(API_URL + 'get-maquinas-ocupadas/');
    }

    deleteMaquina(maqID) {
        return axios.delete(API_URL + 'delete-maquina/' + maqID);
    }

    createBooking(date, hora, userID) {
        return axios.post(API_URL + "new-booking/", {date, hora, userID});
    }

    cancelBooking(id, userID, date, hora) {
        return axios.put(API_URL + "cancel-booking/", {id, userID, date, hora});
    }

    getAllBookingsInThisDay(date){
        var fecha = date.split("/");
        fecha = fecha[0] + ":" + fecha[1] + ":" +fecha[2];
        return axios.get(API_URL + 'get-bookings/'+ fecha);
    }

    getAllUserBookings(userID){
        return axios.get(API_URL + 'get-user-bookings/'+ userID);
    }

    checkUserHasHourBookedNow(userID, date, hour){
        return axios.post(API_URL + 'check-user-has-gym-hour-now/', {userID, date, hour});
    }
}

export default new GymService();
