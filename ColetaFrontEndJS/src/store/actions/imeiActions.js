export function saveVeiculo(veiculo) {
  return {
    type: 'SAVE_VEICULO',
    veiculo,
    identificado: true
  };
}


export function removerID() {
  return {
    type: 'REMOVER_ID',
    identificado: false
  };
}


