<template>
  <div class="flex-col">
    <bounce-loader
      :loading="isLoading"
      :color="'#68d391'"
      :size="100"
    ></bounce-loader>
    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
            class="w-20 h-20 mr-5"
            :alt="asset.name"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ asset.priceUsd | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ min | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ max | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ avg | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ asset.changePercent24Hr | percent }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="toggleConverter()"
            class="
              bg-green-500
              hover:bg-green-700
              text-white
              font-bold
              py-2
              px-4
              rounded
            "
          >
            {{ frontUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                v-model="convertValue"
                id="convertValue"
                type="number"
                class="
                  text-center
                  bg-white
                  focus:outline-none focus:shadow-outline
                  border border-gray-300
                  rounded-lg
                  py-2
                  px-4
                  block
                  w-full
                  appearance-none
                  leading-normal
                "
                :placeholder="`Valor en ${frontUsd ? 'USD' : asset.symbol}`"
              />
            </label>
          </div>

          <span class="text-xl"
            >{{ convertResult }} {{ frontUsd ? asset.symbol : 'USD' }}</span
          >
        </div>
      </div>

      <line-chart
        class="my-10"
        :colors="['orange']"
        :min="min"
        :max="max"
        :data="history.map((h) => [h.date, parseFloat(h.priceUsd).toFixed(2)])"
      ></line-chart>

      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table>
        <tr
          v-for="m in markets"
          :key="`${m.exchangeId}-${m.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>{{ m.priceUsd | dollar }}</td>
          <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
          <td>
            <px-button
              :isLoading="m.isLoading || false"
              v-if="!m.url"
              @custom-click="getWebsite(m)"
            >
              <slot>Obtener Link</slot>
            </px-button>
            <a v-else class="hover:underline text-green-600" target="_blanck">{{
              m.url
            }}</a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import PxButton from '@/components/PxButton'
import api from '@/api'

export default {
  name: 'CoinDetail',

  components: { PxButton },

  data() {
    return {
      isLoading: false,
      asset: {},
      history: [],
      markets: [],
      frontUsd: true,
      convertValue: null,
    }
  },

  computed: {
    convertResult() {
      if (!this.convertValue) {
        return 0
      }

      const result = this.frontUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd

      return result.toFixed(4)
    },

    min() {
      return Math.min(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      )
    },

    max() {
      return Math.max(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      )
    },

    avg() {
      return (
        this.history.reduce((a, b) => a + parseFloat(b.priceUsd), 0) /
        this.history.length
      )
    },
  },

  watch: {
    $route() {
      this.getCoin()
    },
  },

  created() {
    this.getCoin()
  },

  methods: {
    toggleConverter() {
      this.frontUsd = !this.frontUsd
    },
    getWebsite(exchange) {
      this.$set(exchange, 'isLoading', true)

      return api
        .getExchange(exchange.exchangeId)
        .then((res) => {
          this.$set(exchange, 'url', res.exchangeUrl) // funcion de vue para evitar los problemas de reactividad, esto solo ocurre con arrays y objetos. Pasa cuando se quieren añadir cosas que no existieron desde el principio o no fueron definidas en data o que no se establecieron cuando el objeto fue creado (no se trackearon por vue)
          // la funcion set recibe el objeto que se le va a agregar una nueva propiedad, el segundo parametro es el nombre de la propiedad a agregar y por ultimo es el valor de esta nueva propiedad
        })
        .finally(() => {
          this.$set(exchange, 'isLoading', true)
        })
    },
    getCoin() {
      const id =
        this.$route.params
          .id /* es una propiedad que se agrega a cada uno de los componentes de vue cuando se trabaja con vue-router, $route representa a la ruta y toda la informacion disponible de la ruta */

      this.isLoading = true
      /* diferentes promises simultaneamente a traves de un array */
      Promise.all([
        api.getAsset(id),
        api.getAssetHistory(id),
        api.getMarkets(id),
      ])
        .then(([asset, history, markets]) => {
          this.asset = asset
          this.history = history
          this.markets = markets
        }) // en este then se obtienen todos los resultados del promise.all
        .finally(() => (this.isLoading = false))
    },
  },
}
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
