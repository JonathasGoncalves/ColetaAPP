export default interface modelIMEI {
  imei: string
}

export const SAVE_IMEI = 'SAVE_IMEI';
export const GET_IMEI = 'GET_IMEI';

interface SAVE_IMEI_ACTION {
  type: typeof SAVE_IMEI,
  playload: modelIMEI
}

interface GET_IMEI_ACTION {
  type: typeof GET_IMEI,
  playload: modelIMEI
}

export type IMEI_ACTION_TYPES = SAVE_IMEI_ACTION | GET_IMEI_ACTION;