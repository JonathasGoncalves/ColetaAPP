export function save_linha(cod_linha) {
  return {
    type: 'SAVE_LINHA',
    cod_linha,
    emAberto: true
  };
}

export function save_linhaID(id_linha) {
  return {
    type: 'SAVE_LINHAID',
    id_linha
  };
}

export function save_coleta(coleta) {
  return {
    type: 'SAVE_COLETA',
    coleta,
  };
}

export function save_tanque(tanqueAtual) {
  return {
    type: 'SAVE_TANQUE',
    tanqueAtual,
  };
}

export function save_linhas(linhas) {
  return {
    type: 'SAVE_LINHAS',
    linhas,
  };
}

export function finalizar_coleta() {
  return {
    type: 'FINALIZAR_COLETA',
    emAberto: false
  };
}

export function save_id() {
  return {
    type: 'SAVE_ID',
    id_coleta: false
  };
}

export function transmitir_coleta(transmitir) {
  return {
    type: 'TRANSMITIR_COLETA',
    transmitir: transmitir
  };
}

export function adicionar_horaI(horaI) {
  return {
    type: 'ADICIONAR_HORAI',
    horaI: horaI
  };
}

export function adicionar_horaF(horaF) {
  return {
    type: 'ADICIONAR_HORAF',
    horaF: horaF
  };
}

export function adicionar_data(data) {
  return {
    type: 'ADICIONAR_DATA',
    data: data
  };
}

export function salvar_total_coletado(totalColetado) {
  return {
    type: 'SAVE_TOTAL_COLETADO',
    totalColetado: totalColetado
  };
}









