import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Image, Alert,
  ActivityIndicator, KeyboardAvoidingView,
  TouchableWithoutFeedback, Keyboard,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './style';
import { Button, Container } from 'native-base';
import api from '../../../services/api';
import * as actionsIMEI from '../../../store/actions/imeiActions';
import { getUniqueId } from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import linha from '../../linha';
import getRealm from '../../../services/realm';
import Realm from 'realm';
import * as actionsColeta from '../../../store/actions/coletaActions';
import { time, date } from '../../../functions/tempo';

const Cadastro = ({ save_coleta, adicionar_horaI, adicionar_data, saveVeiculo, save_linhas }) => {
  const [placa, setPlaca] = useState('');
  const [odometro, setOdometro] = useState('');
  const [loading, setLoading] = useState(false);

  async function salvarPlaca() {

    setLoading(true);

    const imeiLocal = getUniqueId();
    try {
      try {
        const response = await api.post('api/transportadora/verificarPlaca', {
          placa: placa
        })

        try {

          await AsyncStorage.setItem('@veiculo', JSON.stringify(response.data.motorista));

          const tempVeiculo = await AsyncStorage.getItem('@veiculo');

          const responseLinhas = await api.post('api/linha/linhasPorVeiculo', {
            veiculo: response.data.motorista.VEICULO
          })
          console.log(responseLinhas);
          linhas = [];
          for (linhaItem of responseLinhas.data.linhas) {
            linhas.push(linhaItem.linha);
          }
          const responseTanques = await api.post('api/tanque/TanquesInLinhas', {
            linhas: linhas
          });
          save_linhas(linhas);
          await AsyncStorage.setItem('@OdometroI', odometro);
          await AsyncStorage.setItem('@linhas', JSON.stringify(linhas));
          //gerando array de array para as possiveis coletas de cada linha
          //o indice do array é o codigo da linha

          const realm = await getRealm();
          temp = [];

          let allTanque = realm.objects('Tanque');
          realm.write(() => {
            realm.delete(allTanque)
          })

          for (tanqueItem of responseTanques.data.tanques) {
            tanqueUnidade = {
              id: tanqueItem.id,
              codigo: tanqueItem.codigo,
              codigo_cacal: tanqueItem.codigo_cacal,
              tanque: tanqueItem.tanque,
              latao: tanqueItem.latao,
              LINHA: tanqueItem.linha,
              descricao: tanqueItem.descricao,
              ATUALIZAR_COORDENADA: tanqueItem.ATUALIZAR_COORDENADA,
              lataoQuant: tanqueItem.lataoQuant
            };
            temp.push(tanqueUnidade);
            realm.write(() => {
              realm.create('Tanque', tanqueUnidade);
            });
          }

          const hora = time();
          const data = date();

          adicionar_horaI(hora);
          adicionar_data(data);
          await AsyncStorage.setItem('@horaI', hora);
          await AsyncStorage.setItem('@data', data);
          await AsyncStorage.setItem('@emAberto', 'true');
          save_coleta([]);
          saveVeiculo(response.data.motorista);

        } catch (error) {
          console.log(error);
          Alert.alert(
            'Erro',
            'Não foi possivel carregar as informações!',
            [
              { text: 'ok' },
            ]
          );
        }

      } catch (error) {
        console.log(error);
        Alert.alert(
          'Erro',
          'Placa inválida!',
          [
            { text: 'ok' },
          ]
        );
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  function setOdometroAction(text) {
    newText = text.replace(/[^0-9]/g, '');
    setOdometro(newText);
  }

  return (
    <Container style={{ backgroundColor: 'white', flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{
            padding: 24,
            flex: 1,
            justifyContent: "space-around"
          }}>
            <View >
              <View>
                <Image style={{ alignSelf: 'center' }} source={require('../../coleta/imagens/iconeCaminhao.jpg')} />
                <Text allowFontScaling={false} style={styles.textDescPlaca}>
                  Por favor digite a placa do seu veiculo no campo abaixo
              </Text>
                <TextInput
                  editable={!loading}
                  style={styles.inputPlaca}
                  value={placa}
                  onChangeText={text => setPlaca(text)}
                />
              </View>

              <View>
                <Text allowFontScaling={false} style={styles.textDescPlaca}>
                  Odômetro Inicial
              </Text>
                <TextInput
                  keyboardType='numeric'
                  editable={!loading}
                  style={styles.inputPlaca}
                  value={odometro}
                  onChangeText={text => setOdometroAction(text)}
                />
                <Button
                  block
                  style={loading || placa.length <= 0 || odometro.length <= 0 ? styles.buttonContinuarPress : styles.buttonContinuar}
                  rounded={true}
                  onPress={salvarPlaca}
                  disabled={loading || placa.length <= 0 || odometro.length <= 0}
                >
                  <Text allowFontScaling={false} style={styles.textButtonContinuar}>Continuar</Text>
                </Button>
              </View>
            </View>

            {loading && <ActivityIndicator size='large' color='green' style={{ marginTop: 20 }} />}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Container >
  );
}

const mapStateToProps = state => ({
  imei: state.Identificacao.imei
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...actionsIMEI, ...actionsColeta }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Cadastro);
