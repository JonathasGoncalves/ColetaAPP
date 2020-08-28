import { combineReducers } from 'redux';

import Identificacao from './imeiReducer';
import Coleta from './coletaReducer';

export default combineReducers({
  Identificacao,
  Coleta,
});