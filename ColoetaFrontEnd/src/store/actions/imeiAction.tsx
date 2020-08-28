import
modelIMEI,
{
  GET_IMEI,
  SAVE_IMEI,
  IMEI_ACTION_TYPES
} from '../types/imeiType';


export function saveIMEI(newImei: modelIMEI): IMEI_ACTION_TYPES {
  return {
    type: SAVE_IMEI,
    playload: newImei
  }
}

export function getIMEI(newImei: modelIMEI): IMEI_ACTION_TYPES {
  return {
    type: GET_IMEI,
    playload: newImei
  }
}