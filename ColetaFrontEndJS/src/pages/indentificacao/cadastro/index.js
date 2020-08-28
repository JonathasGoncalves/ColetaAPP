import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './style';
import { Button } from 'native-base';
import api from '../../../services/api';
import * as actionsIMEI from '../../../store/actions/imeiActions';
import { getUniqueId } from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import linha from '../../linha';
import getRealm from '../../../services/realm';
import Realm from 'realm';
import * as actionsColeta from '../../../store/actions/coletaActions';

const Cadastro = ({ saveImei, save_placa, save_coleta, save_linhas }) => {
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);

  async function salvarPlaca() {
    setLoading(true);

    const imeiLocal = getUniqueId();
    try {
      try {
        const response = await api.post('api/transportadora/verificarPlaca', {
          placa: placa
        })

        await AsyncStorage.setItem('@placa', placa);

        try {
          const responseCad = await api.post('api/transportadora/cadastrarIMEI', {
            transportadora: response.data.motorista.COD_TRANSPORTADORA,
            IMEI: imeiLocal
          })

          await AsyncStorage.setItem('@imei', imeiLocal);
          const responseLinhas = await api.post('api/linha/linhasPorIMEI', {
            IMEI: imeiLocal
          })
          linhas = [];
          for (linhaItem of responseLinhas.data.linhas) {
            linhas.push(linhaItem.linha);
          }
          const responseTanques = await api.post('api/tanque/TanquesInLinhas', {
            linhas: linhas
          })

          save_linhas(linhas);
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
          saveImei(imeiLocal, placa);

        } catch (error) {
          Alert.alert(
            'Erro',
            JSON.stringify(error),
            [
              { text: 'ok' },
            ]
          );
        }

      } catch (error) {
        Alert.alert(
          'Erro',
          JSON.stringify(error),
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

  return (


    <View style={{ backgroundColor: 'white' }}>

      <Image style={{ alignSelf: 'center' }} source={require('../../../imagens/iconeCaminhao.jpg')} />
      <Text allowFontScaling={false} style={styles.textDescPlaca}>
        Este é seu primeiro acesso no nosso aplicativo de coleta de leite!
        O primeiro passo antes de poder utilizar o APP é inserir a placa do veículo.
        Por favor digite a placa do seu veiculo no campo abaixo
      </Text>
      <TextInput
        editable={!loading}
        style={styles.inputPlaca}
        value={placa}
        onChangeText={text => setPlaca(text)}
      />
      <Button
        block
        style={loading || placa.length <= 0 ? styles.buttonContinuarPress : styles.buttonContinuar}
        rounded={true}
        onPress={salvarPlaca}
        disabled={loading || placa.length <= 0}
      >
        <Text allowFontScaling={false} style={styles.textButtonContinuar}>Continuar</Text>
      </Button>

      {loading && <ActivityIndicator size='large' color='green' style={{ marginTop: 20 }} />}

    </View>
  );
}

const mapStateToProps = state => ({
  imei: state.Identificacao.imei
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...actionsIMEI, ...actionsColeta }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Cadastro);
