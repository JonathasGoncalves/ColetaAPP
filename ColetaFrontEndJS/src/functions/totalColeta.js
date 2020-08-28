export default function calcularTotalColetado(coleta) {
  total = 0;
  coleta.map((coleta) => {
    coleta.coleta.map((ItemColeta) => {
      if (ItemColeta.cod_ocorrencia == '') {
        total += ItemColeta.volume;
      }
    })
  })

  return total;
}