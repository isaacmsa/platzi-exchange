/* Utilizando fetch para conectarse a api rest */

const url = 'https://api.coincap.io/v2' // url principal de la api

function getAssets() {
  return fetch(`${url}/assets?limit=20`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => error)
}

function getAsset(coin) {
  return fetch(`${url}/assets/${coin}`)
    .then((res) => res.json())
    .then((res) => res.data)
    .catch((error) => error)
}

function getAssetHistory(coin) {
  const now = new Date()
  const end = now.getTime() /* valor de ahora */
  now.setDate(now.getDate() - 1) /* fecha de ayer */
  const start = now.getTime() /* valor de ahora menos 1 dia */

  return fetch(
    `${url}/assets/${coin}/history?interval=h1&start=${start}&end=${end}`
  )
    .then((res) => res.json())
    .then((res) => res.data)
}

function getMarkets(coin) {
  return fetch(`${url}/assets/${coin}/markets?limit=5`)
    .then((res) => res.json())
    .then((res) => res.data)
}

function getExchange(id) {
  return fetch(`${url}/exchanges/${id}`)
    .then((res) => res.json())
    .then((res) => res.data)
}

export default {
  getAssets,
  getAsset,
  getAssetHistory,
  getMarkets,
  getExchange,
}
