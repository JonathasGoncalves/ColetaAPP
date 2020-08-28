import React from 'react';
import { View, Text, Button } from 'react-native';
import { Props } from '../../routes/types';
import { imeiReducer } from '../../store/reducers/imeiReducers';
import { useDispatch } from 'react-redux'
import thunk from 'redux-thunk';
import { saveIMEI } from '../../store/actions/imeiAction';


function Imei({ route, navigation }: Props) {
  const dispatch = useDispatch()
  function identificarImei() {
    dispatch(saveIMEI({ imei: '111111111' }));
    navigation.navigate("Linha");
  }
  return (
    <View>
      <Text>IMEI indentificado?</Text>
      <Button title="Indentificar" onPress={() => identificarImei()} />
    </View>
  );
}

export default Imei;


//() => navigation.navigate("Linha")