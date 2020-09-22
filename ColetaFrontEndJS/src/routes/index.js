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
import calcularTotalColetado from '../functions/totalColeta';
import { time } from '../functions/tempo';

function Routes({
  salvar_total_coletado,
  salvar_total_coletadoOff,
  save_linhaID,
  save_linhas,
  identificado,
  saveVeiculo,
  save_linha,
  save_coleta,
  adicionar_horaF,
  adicionar_horaI,
  transmitir_coleta,
  save_tanque,
  adicionar_data
}) {
  const [verificar, setVerificar] = useState(true);

  useEffect(() => {

    async function verificarImei() {

      /*await AsyncStorage.clear();
      const realm = await getRealm();
      Realm.deleteFile({
        path: realm.path
      })*/

      /* armazerar credenciais do client laravel 
      ClientProtheus
      Client ID: 3
      Client secret: vIxglRP4x3MuD08Gy02SzFjQTWp1aDuxOGeHhZkf
      */

      const clientIDVerificar = await AsyncStorage.getItem('@Client');

      if (!clientIDVerificar) {
        await AsyncStorage.setItem('@Client', '3');
        await AsyncStorage.setItem('@Secret', 'snu85ywkg1WhoTn5enQ9jLBvCHWeRq8IOBt087o7');
      }
      const clientID = await AsyncStorage.getItem('@Client');
      const clientSecret = await AsyncStorage.getItem('@Secret');
      const access_token = await AsyncStorage.getItem('@access_token');

      if (!access_token) {
        const responseToken = await api.post('oauth/token', {
          grant_type: 'client_credentials',
          client_id: clientID,
          client_secret: clientSecret
        })
        await AsyncStorage.setItem('@access_token', responseToken.data.access_token);
        await AsyncStorage.setItem('@expires_in', String(responseToken.data.expires_in));
      } else {
        async function changeTimezone(date, ianatz) {
          const expires_in_tmp = await AsyncStorage.getItem('@expires_in');
          const expires_in = parseInt(expires_in_tmp);
          var invdate = new Date(date.toLocaleString('pt-BR', {
            timeZone: ianatz
          }));
          var diff = new Date(invdate.getTime() + expires_in * 1000);
          return new Date(diff);
        }
        var agora = new Date();
        var expirar = await changeTimezone(agora, 'America/Sao_Paulo');
        if (expirar.getTime() < agora.getTime()) {
          const responseToken = await api.post('oauth/token', {
            grant_type: 'client_credentials',
            client_id: clientID,
            client_secret: clientSecret
          })

          await AsyncStorage.setItem('@access_token', responseToken.data.access_token);
          await AsyncStorage.setItem('@expires_in', String(responseToken.data.expires_in));
        }
      }
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
            const total = calcularTotalColetado(coletaStorage);
            salvar_total_coletado(total.total);
            salvar_total_coletadoOff(total.totalOff);
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


