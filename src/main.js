import Vue from 'vue'
import App from './App.vue'
import '@/assets/css/tailwind.css' // el @ es un pequeño truco de webpack y vue para que haga referencia a un archivo dentro de la carpeta src del proyectoç
import Chart from 'chart.js'
import Chartick from 'vue-chartkick'
import { VueSpinners } from '@saeris/vue-spinners'

import router from '@/router'
import { dollarFilter, percentFilter } from '@/filters.js'

Vue.use(VueSpinners)
Vue.use(Chartick.use(Chart))
Vue.filter('dollar', dollarFilter) // la funcion filter recibe el nombre que se le asigna que en este caso se le asigno dollar y la funcion que viene del archivo filters
Vue.filter('percent', percentFilter)
Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
