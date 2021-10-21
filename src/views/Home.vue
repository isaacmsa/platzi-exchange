<template>
  <div>
    <bounce-loader
      :loading="isLoading"
      :color="'#68d391'"
      :size="100"
    ></bounce-loader>
    <px-assets-table v-if="isLoading == false" :assets="assets" />
    <!--  v-bind puede ser directamente reemplazado por los dos puntos, esto significa lo mismo -->
  </div>
</template>

<script>
import api from '@/api'
import PxAssetsTable from '@/components/PxAssetsTable'

export default {
  name: 'Home',
  components: { PxAssetsTable },

  data() {
    return {
      isLoading: false,
      assets: [],
    }
  },

  created() {
    this.isLoading = true
    // funcion hook que se ejecuta cuando se crea el componente, en este caso para hacer interaccion con la api apenas inicie la app
    api
      .getAssets()
      .then((assets) => (this.assets = assets))
      .finally(() => (this.isLoading = false))
  },
}
</script>
