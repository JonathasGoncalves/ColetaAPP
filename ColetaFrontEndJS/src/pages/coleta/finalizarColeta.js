import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, Alert, TextInput,
  KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard,
  FlatList
}
  from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsColeta from '../../store/actions/coletaActions';
import styles from './styles';
import { Button, Container } from 'native-base';
import getRealm from '../../services/realm';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import { time } from '../../functions/tempo';
import { CommonActions } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import * as actionsIMEI from '../../store/actions/imeiActions';

const Finalizar = ({ removerID, id_coleta, linhas, coleta, data, horaI, horaF, navigation, save_coleta, cod_linha, placa, transmitir_coleta, adicionar_horaF, imei }) => {

  const [loading, setLoading] = useState(false);
  const [odometro, setOdometro] = useState('');
  const [transmitindo, setTransmitindo] = useState(false);
  const [tanques, setTanques] = useState(0);
  const [volume, setVolume] = useState(0);
  const [tanquesOc, setTanquesOc] = useState(0);
  const [volumeOc, setVolumeOc] = useState(0);
  const [grid, setGrid] = useState([]);

  //@finalizado 1 coleta; 2 falta finalizar; 3 falta transmitir
  useEffect(() => {



    navigation.setOptions({
      headerLeft: () => (
        <Button
          transparent
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon="arrow-left" color="white" size={25} style={{ marginLeft: 10 }} />
        </Button>
      ),
    });

    navigation.setOptions({
      headerRight: () => (
        <View>
        </View>
      ),
    });

    async function verificarSubmisao() {
      const hora = time();
      adicionar_horaF(hora);
      await AsyncStorage.setItem('@horaF', hora);
      await finalizarColeta();
    }

    verificarSubmisao();
  }, [])

  function setOdometroAction(text) {
    newText = text.replace(/[^0-9]/g, '');
    setOdometro(newText);
  }

  async function finalizarColeta() {
    setLoading(true);
    const realm = await getRealm();

    let allColetas = realm.objects('Coleta');
    realm.write(() => {
      realm.delete(allColetas)
    })

    tanquesCount = 0;
    volumeSum = 0;
    tanquesCountOc = 0;
    volumeSumOc = 0;
    coleta.map((coletaLinha) => {
      coletaLinha.coleta.map((coletaItem) => {
        if (coletaItem.cod_ocorrencia != '') {
          volumeSumOc += coletaItem.volume;
          tanquesCountOc++;
        }
        if (coletaItem.volume > 0 && coletaItem.cod_ocorrencia == '') {
          tanquesCount++;
          volumeSum += coletaItem.volume;
        }

      })
    })


    setTanques(tanquesCount);
    setTanquesOc(tanquesCountOc);
    setVolume(volumeSum);
    setVolumeOc(volumeSumOc);

    coleta.map((coleta) => {
      coleta.coleta.map((coletaItem) => {
        coletaItem.lataoList.map((latao) => {
          if (coletaItem.volume > 0 || coletaItem.cod_ocorrencia != '') {
            volumeOC = 0;
            if (coletaItem.cod_ocorrencia != '') {
              volumeOC = coletaItem.volume;
            }

            coletaUnidade = {
              id: coletaItem.id,
              codigo: coletaItem.codigo,
              codigo_cacal: coletaItem.codigo_cacal,
              tanque: coletaItem.tanque,
              latao: coletaItem.latao,
              LINHA: coletaItem.LINHA,
              LINHA_DESC: coletaItem.LINHA_DESC,
              lataoQuant: parseInt(coletaItem.lataoQuant),
              ATUALIZAR_COORDENADA: parseInt(coletaItem.ATUALIZAR_COORDENADA),
              temperatura: parseFloat(coletaItem.temperatura),
              odometro: coletaItem.odometro,
              volume: latao.volume,
              latitude: coletaItem.latitude,
              longitude: coletaItem.longitude,
              cod_ocorrencia: coletaItem.cod_ocorrencia,
              observacao: coletaItem.observacao,
              data: latao.data,
              hora: latao.hora,
              boca: 1,
              volume_fora_padrao: volumeOC
            };
            realm.write(() => {
              realm.create('Coleta', coletaUnidade);
            });
          }
        })
      })
    })

    listGrid = [];
    labels = ['Data', 'Nº Tanques', 'Volume', 'Tanq. Ocorrências', 'Vol. Fora Padrão', 'Hora Ínicio', 'Hora Fim'];
    values = [data, tanques, volume, tanquesOc, volumeOc, horaI, horaF]
    obj = {
      label: '',
      valor: '',
      id: 0
    }
    for (i = 0; i < 7; i++) {
      obj.label = labels[i];
      obj.valor = values[i];
      obj.id = i;
      listGrid[i] = obj;
    }
    setGrid(listGrid);
    setLoading(false);
  }

  function renderTotal(total) {
    return (
      <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
        <TouchableOpacity onPress={() => (coletarLatao(latao))}>
          <View style={styles.viewItemLinha}>
            <View style={styles.viewItemLatao}>
              <Text allowFontScaling={false} style={styles.textTitulo}>
                {total.label}
              </Text>
              <Text allowFontScaling={false} style={styles.textCod}>
                {total.valor}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  async function submeterColeta() {

    //criar array no formato que a api recebe
    setTransmitindo(true);
    setLoading(true);

    await AsyncStorage.setItem('@OdometroI', odometro);

    try {
      var mes = '';
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      if (month < 10) {
        mes = '0' + month;
      }
      var year = new Date().getFullYear();
      const dataHJ = year + '/' + mes + '/' + date;

      const veiculoTemp = await AsyncStorage.getItem('@veiculo');
      const veiculo = JSON.parse(veiculoTemp);

      const data = await AsyncStorage.getItem('@data');

      const responseColeta = await api.post('api/coleta/NovaColeta', {
        data: data,
        transportador: veiculo.COD_TRANSPORTADORA,
        motorista: veiculo.COD_MOTORISTA,
        veiculo: veiculo.VEICULO
      })




      var coletaRequest = [];
      coleta.map((coleta) => {
        coleta.coleta.map((coletaItem) => {
          coletaItem.lataoList.map((latao) => {
            if (coletaItem.volume > 0 || coletaItem.cod_ocorrencia != '') {
              volumeOC = 0;
              if (coletaItem.cod_ocorrencia != '') {
                volumeOC = coletaItem.volume;
              }

              coletaUnidade = {
                id_coleta: responseColeta.data.id,
                id: coletaItem.id,
                codigo: coletaItem.codigo,
                codigo_cacal: coletaItem.codigo_cacal,
                tanque: coletaItem.tanque,
                latao: coletaItem.latao,
                LINHA: coletaItem.LINHA,
                lataoQuant: parseInt(coletaItem.lataoQuant),
                ATUALIZAR_COORDENADA: coletaItem.ATUALIZAR_COORDENADA,
                temperatura: coletaItem.temperatura,
                odometro: coletaItem.odometro,
                volume: latao.volume,
                latitude: coletaItem.latitude,
                longitude: coletaItem.longitude,
                cod_ocorrencia: coletaItem.cod_ocorrencia,
                observacao: coletaItem.observacao,
                data: latao.data,
                hora: latao.hora,
                boca: 1,
                volume_fora_padrao: volumeOC
              };
              coletaRequest.push(coletaUnidade);
            }
          })
        })
      })


      try {
        const responseTanques = await api.post('api/coleta/NovaColetaItem', {
          coletas: coletaRequest
        })
        const realm = await getRealm();

        let allColetas = realm.objects('Coleta');
        realm.write(() => {
          realm.delete(allColetas)
        })
        await AsyncStorage.multiRemove(['@emAberto', '@coleta', '@linha', '@finalizado', '@veiculo']);
        const emAbertoStorage = await AsyncStorage.getItem('@emAberto');
        await AsyncStorage.setItem('@transmitir', 'false');
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }

    Alert.alert(
      'Sucesso!',
      'Coleta transmitida!',
      [
        { text: 'ok', onPress: () => sair() },
      ]
    );
  }

  function sair() {
    save_coleta([]);
    setTransmitindo(false);
    setLoading(false);
    removerID();
  }

  async function updateTanques() {

    const responseTanques = await api.post('api/tanque/TanquesInLinhas', {
      linhas: linhas
    })
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
  }

  return (
    <Container>
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
            {loading || transmitindo ? (
              <ActivityIndicator size="large" color="green" />
            ) : (

                <View style={styles.ViewButton}>
                  <View>
                    <Text allowFontScaling={false} style={styles.textTituloGeral}>Informações Gerais</Text>
                    <FlatList
                      data={grid}
                      keyExtractor={item => item.id}
                      renderItem={({ item }) => renderTotal(item)}
                    />
                  </View>

                  <View style={{ marginTop: 20 }}>
                    <Text allowFontScaling={false} style={styles.textDescOdometro}>
                      Odômetro Final
                    </Text>
                    <TextInput
                      maxLength={9}
                      keyboardType='numeric'
                      editable={!loading}
                      style={styles.inputPlaca}
                      value={odometro}
                      onChangeText={text => setOdometroAction(text)}
                    />
                  </View>

                  <Button
                    block
                    style={loading || transmitindo || odometro.length <= 0 ? styles.buttonContinuarPress : styles.buttonContinuar}
                    disabled={loading || odometro.length <= 0 || transmitindo}
                    rounded={true}
                    onPress={submeterColeta}
                  >
                    <Text allowFontScaling={false} style={styles.textButtonContinuar}>Transmitir Coleta</Text>
                  </Button>
                </View>
              )
            }
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Container>
  )
}

const mapStateToProps = state => ({
  tanqueAtual: state.Coleta.tanqueAtual,
  coleta: state.Coleta.coleta,
  cod_linha: state.Coleta.cod_linha,
  veiculo: state.Identificacao.veiculo,
  transmitir: state.Coleta.transmitir,
  horaI: state.Coleta.horaI,
  horaF: state.Coleta.horaF,
  imei: state.Identificacao.imei,
  data: state.Coleta.data,
  linhas: state.Coleta.linhas,
  id_coleta: state.Coleta.id_coleta
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...actionsIMEI, ...actionsColeta }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Finalizar);
