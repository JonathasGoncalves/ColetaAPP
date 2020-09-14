const INITIAL_STATE = {
  cod_linha: '',
  coleta: [], //array de array (cada posição representa os tanques da linha)
  tanqueAtual: {},
  lataoAtual: {},
  emAberto: false, //false não começou a coleta (Não escolheu a linha), true ecolheu a linha 
  transmitir: '0', //0 tela de linha, 1 tela de coleta, 2 tela de finalizar, 3 tela de transmitir
  id_coleta: 0,
  horaI: '',
  horaF: '',
  data: '',
  linhas: [],
  id_linha: 0,
  totalColetado: 0,
  totalColetadoOff: 0
}
export default function Coleta(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SAVE_LINHA':
      return {
        ...state,
        cod_linha: action.cod_linha,
        emAberto: action.emAberto
      }
    case 'SAVE_TOTAL_COLETADO':
      return {
        ...state,
        totalColetado: action.totalColetado,
      }
    case 'SAVE_LINHAID':
      return {
        ...state,
        id_linha: action.id_linha,
      }
    case 'SAVE_COLETA':
      return {
        ...state,
        coleta: action.coleta,
      }

    case 'SAVE_TANQUE':
      return {
        ...state,
        tanqueAtual: action.tanqueAtual
      }
    case 'SAVE_LATAO':
      return {
        ...state,
        lataoAtual: action.lataoAtual
      }

    case 'SAVE_LINHAS':
      return {
        ...state,
        linhas: action.linhas
      }
    case 'FINALIZAR_COLETA':
      return {
        ...state,
        emAberto: action.emAberto
      }
    case 'SAVE_ID':
      return {
        ...state,
        id_coleta: action.id_coleta
      }
    case 'TRANSMITIR_COLETA':
      return {
        ...state,
        transmitir: action.transmitir,
      }
    case 'ADICIONAR_HORAI':
      return {
        ...state,
        horaI: action.horaI
      }
    case 'ADICIONAR_HORAF':
      return {
        ...state,
        horaF: action.horaF,
      }
    case 'ADICIONAR_DATA':
      return {
        ...state,
        data: action.data,
      }
    case 'SAVE_TOTAL_COLETADO_OFF':
      return {
        ...state,
        totalColetadoOff: action.totalColetadoOff,
      }
    default:
      return state;
  }
}