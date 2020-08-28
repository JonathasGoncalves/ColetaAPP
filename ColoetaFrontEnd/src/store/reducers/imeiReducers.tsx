import
modelIMEI,
{
  GET_IMEI,
  SAVE_IMEI,
  IMEI_ACTION_TYPES
} from '../types/imeiType';

const INITIAL_STATE: modelIMEI = { imei: '' };

export function imeiReducer(
  state = INITIAL_STATE,
  action: IMEI_ACTION_TYPES
): modelIMEI {
  switch (action.type) {
    case "GET_IMEI":
      return {
        ...state,
        imei: action.playload.imei
      }
    case "SAVE_IMEI":
      return {
        imei: action.playload.imei
      }
    default:
      return state
  }
}