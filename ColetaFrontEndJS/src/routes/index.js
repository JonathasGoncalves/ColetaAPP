import React, { useEffect, useState } from 'react';
import IDAPP from './identificarRoutes';
import ColetaStack from './coletaRouter';
import { connect } from 'react-redux';
import * as actionsIMEI from '../store/actions/imeiActions';
import * as actionsColeta from '../store/actions/coletaActions';
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage';
import { ActivityIndicator } from 'react-native';
import getRealm from '../services/realm';
import api from '../services/api';
import axios from 'axios';

function Routes({ save_linhaID, save_linhas, identificado, saveVeiculo, save_linha, save_coleta, adicionar_horaF, adicionar_horaI, transmitir_coleta, save_tanque, adicionar_data }) {
  const [verificar, setVerificar] = useState(true);

  useEffect(() => {

    async function verificarImei() {
      /*await AsyncStorage.clear();
      const realm = await getRealm();
      Realm.deleteFile({
        path: realm.path
      })*/

      const veiculo = await AsyncStorage.getItem('@veiculo');

      if (veiculo) {
        const emAbertoStorage = await AsyncStorage.getItem('@emAberto');
        if (emAbertoStorage == 'true') {
          const coletaStoragetemp = await AsyncStorage.getItem('@coleta');
          const coletaStorage = JSON.parse(coletaStoragetemp);
          const tanqueAtualS = await AsyncStorage.getItem('@tanqueAtual');
          const tanqueAtualStorage = JSON.parse(tanqueAtualS);
          const linha = await AsyncStorage.getItem('@linha');
          const idlinhaTemp = await AsyncStorage.getItem('@idlinha');
          const idlinha = JSON.parse(idlinhaTemp);
          const horaI = await AsyncStorage.getItem('@horaI');
          const horaF = await AsyncStorage.getItem('@horaF');
          const data = await AsyncStorage.getItem('@data');
          const linhasTemp = await AsyncStorage.getItem('@linhas');
          const linhas = JSON.parse(linhasTemp);
          save_tanque(tanqueAtualStorage);
          adicionar_horaI(horaI);
          adicionar_horaF(horaF);
          adicionar_data(data);
          save_linha(linha);
          save_linhas(linhas);
          save_linhaID(idlinha);
          if (coletaStorage != null) {
            save_coleta(coletaStorage);
          } else {
            save_coleta([]);
          }
        }
        const placaStorage = await AsyncStorage.getItem('@placa');
        const veiculoTemp = JSON.parse(veiculo);
        await saveVeiculo(veiculoTemp);
      }
      setVerificar(false);
    }
    verificarImei();
  })

  if (verificar) {
    return <ActivityIndicator />
  } else if (identificado) {
    return <ColetaStack />
  } else {
    return <IDAPP />;
  }
};

const mapStateToProps = state => ({
  identificado: state.Identificacao.identificado
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...actionsIMEI, ...actionsColeta }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Routes);


