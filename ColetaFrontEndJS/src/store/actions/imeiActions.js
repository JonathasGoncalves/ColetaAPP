export function saveImei(imei, placa) {
  return {
    type: 'SAVE_IMEI',
    imei,
    identificado: true,
    placa
  };
}

export function save_placa(placa) {
  return {
    type: 'SAVE_PLACA',
    placa,
  };
}

