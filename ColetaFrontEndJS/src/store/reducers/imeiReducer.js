
const INITIAL_STATE = {
  imei: '',
  placa: '',
  identificado: false
}


export default function Identificacao(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SAVE_IMEI':
      return {
        ...state,
        imei: action.imei,
        identificado: action.identificado,
        placa: action.placa
      }
    case 'SAVE_PLACA':
      return {
        placa: action.placa,
      }
    default:
      return state;
  }
}