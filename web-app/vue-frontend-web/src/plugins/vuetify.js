import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi'
      },
    theme: {
        themes: {
          light: {
            primary: '#3f51b5',
            secondary: '#d4c119',
            accent: '#8c9eff',
            error: '#b71c1c',
          },
        },
      },
});
