
const INITIAL_STATE = {
  veiculo: {},
  identificado: false
}


export default function Identificacao(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SAVE_VEICULO':
      return {
        ...state,
        veiculo: action.veiculo,
        identificado: action.identificado
      }
    case 'REMOVER_ID':
      return {
        ...state,
        identificado: action.identificado
      }
    default:
      return state;
  }
}

