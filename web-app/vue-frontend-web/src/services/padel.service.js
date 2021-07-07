import axios from 'axios';

const API_URL = 'https://gbapp.ddns.net:4000/api/padel/';

class PadelService {

    getPadelData() {
        return axios.get(API_URL + 'get-padel-data/');
    }

    createBooking(date, hora, userID) {
        return axios.post(API_URL + "new-padel-booking/", {date, hora, userID});
    }

    cancelBooking(id, userID, date, hora) {
        return axios.put(API_URL + "cancel-padel-booking/", {id, userID, date, hora});
    }

    getAllBookingsInThisDay(date){
        var fecha = date.split("/");
        fecha = fecha[0] + ":" + fecha[1] + ":" +fecha[2];
        return axios.get(API_URL + 'get-padel-bookings/'+ fecha);
    }

    getAllUserBookings(userID){
        return axios.get(API_URL + 'get-user-padel-bookings/'+ userID);
    }

    checkUserHasHourBookedNow(userID, date, hour){
        return axios.post(API_URL + 'check-user-has-padel-hour-now/', {userID, date, hour});
    }
}

export default new PadelService();
