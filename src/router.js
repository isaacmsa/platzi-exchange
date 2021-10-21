import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import About from '@/views/About'
import Error from '@/views/Error'
import CoinDetail from '@/views/CoinDetail'

Vue.use(Router) // Vue.use nos permite utlilizar plugins o librerias de Vuejs

export default new Router({
  // configuracion de vue-router. Vue router permite tener varias vistas en 1 solo componente
  mode: 'history',
  // configuracion de una ruta
  routes: [
    // aqui estaran todas las rutas
    {
      path: '/', // path de la ruta
      name: 'home', // nombre de la ruta
      component: Home, // el componente
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/coin/:id',
      name: 'coin-detail',
      component: CoinDetail,
    },
    {
      path: '*',
      name: 'Error',
      component: Error,
    },
  ],
})
