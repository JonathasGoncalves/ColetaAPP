import { imeiReducer } from './reducers/imeiReducers';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  imei: imeiReducer
})

export type RootState = ReturnType<typeof rootReducer>
export { rootReducer };

/*
function reducer() {
  return {
    imei: 'Não identificado!'
  }
}
const store = createStore(reducer);
export default store;
*/