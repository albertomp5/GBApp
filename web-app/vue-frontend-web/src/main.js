import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Vuelidate from 'vuelidate';
import * as VueGoogleMaps from "vue2-google-maps";
import FunctionalCalendar from 'vue-functional-calendar';
import VueSocialSharing from 'vue-social-sharing'

//nuevo
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

//menu nav
import Info from './components/Info.vue';
import Ubicacion from './components/Ubicacion.vue';
import Matriculas from './components/Matriculas.vue';

//log
import Register from './components/Register.vue';
import LogIn from './components/LogIn.vue';
import Forgot from './components/Forgot.vue';
import Reset from './components/Reset.vue';

//ya logged
import Profile from './components/Profile.vue';
import Gym from './components/Gym.vue';
import GymDay from './components/GymDay.vue';
import UserGymBookings from './components/UserGymBookings.vue';
import Padel from './components/Padel.vue';
import PadelDay from './components/PadelDay.vue';
import UserPadelBookings from './components/UserPadelBookings.vue';
import BoardUser from './components/BoardUser.vue';
import BoardAdmin from './components/BoardAdmin.vue';
import SearchUser from './components/SearchUser.vue';
import RedirectUser from './components/RedirectUser.vue';
import UserData from './components/UserData.vue';
import Actividades from './components/Actividades.vue';
import Search from './components/Search.vue';
import Redirect from './components/Redirect.vue';
import CrearActividad from './components/CrearActividad.vue';
import Actividad from './components/Actividad.vue';

//error
import ErrorComponent from './components/ErrorComponent.vue';

import vuetify from './plugins/vuetify';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

Vue.config.productionTip = false;

Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueRouter);
Vue.use(Vuelidate);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDp3Ud3SixagW8bJOwtosy5bBMB5JRNS_k",
  },
});
Vue.use(FunctionalCalendar, {
  dayNames: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
});
Vue.use(VueSocialSharing);

const routes = [
  { path: '/home', component: LogIn, meta: { isPublic: true }},
  { path: '/sobre-nosotros', component: Info, meta: { isPublic: true }},
  { path: '/ubicacion', component: Ubicacion, meta: { isPublic: true }},
  { path: '/matriculas', component: Matriculas, meta: { isPublic: true }},
  { path: '/register', component: Register, meta: { isPublic: true }},
  { path: '/log-in', component: LogIn, meta: { isPublic: true }},
  { path: '/forgot-password', component: Forgot, meta: { isPublic: true } },
  { path: '/reset-password/token=:token&id=:id', name: 'reset', component: Reset, props: true, meta: { isPublic: true } },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/gym', name: 'gym', component: Gym },
  { path: '/gym-day/:day', name: 'gym-day', component: GymDay, props: true },
  { path: '/user-gym-bookings', name: 'user-gym-bookings', component: UserGymBookings },
  { path: '/padel', name: 'padel', component: Padel },
  { path: '/padel-day/:day', name: 'padel-day', component: PadelDay, props: true },
  { path: '/user-padel-bookings', name: 'user-padel-bookings', component: UserPadelBookings },
  { path: '/user', name: 'user', component: BoardUser },
  { path: '/user/:id', name: 'user-data', component: UserData, props: true }, //admin
  { path: '/admin', name: 'admin', component: BoardAdmin},  //admin
  { path: '/buscador-usuarios/:searchString', name: 'buscador-usuarios', component: SearchUser }, //admin
  { path: '/redirect-user/:searchString', name: 'redirect-user', component: RedirectUser }, //admin
  { path: '/actividades', name: 'actividades', component: Actividades },
  { path: '/buscador-actividades/:searchString', name: 'buscador-actividades', component: Search },
  { path: '/redirect/:searchString', name: 'redirect', component: Redirect },
  { path: '/new-actividad', name: 'crear-actividad', component: CrearActividad }, //admin
  { path: '/actividad/:id', name: 'actividad', component: Actividad, props: true },
  { path: '/', component: LogIn, meta: { isPublic: true } },
  { path: '*', component: ErrorComponent, meta: { isPublic: true } }

];

const router = new VueRouter({
  routes,
  mode: 'hash'
});


router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user');

  // trying to access a restricted page + not logged in 
  // redirect to login page
  if (!to.matched.some(record => record.meta.isPublic) && !loggedIn) { 
    next('/log-in');
   }
  else {
    next();
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
