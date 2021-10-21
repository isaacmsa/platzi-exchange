/* los filter son funciones que van a recibir un valor que van a formatear y devolver un nuevo valor */
import numeral from 'numeral' // libreria de js para formatear los numeros y mostrarlos en monedas, binarios, etc

const dollarFilter = function (value) {
  if (!value) {
    return '$ 0'
  }

  return numeral(value).format('($ 0.00a)') // aqui estamos retonando el simbolo de la moneda y un valor mas reducido
}

const percentFilter = function (value) {
  if (!value) {
    return '0%'
  }

  return `${Number(value).toFixed(2)}%`
}

export { dollarFilter, percentFilter }
