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
import { ScrollView } from 'react-native-gesture-handler';
import NetInfo from "@react-native-community/netinfo";

const Transferir = ({ removerID, id_coleta, linhas, coleta, data, horaI, horaF, navigation, save_coleta, cod_linha, placa, transmitir_coleta, adicionar_horaF, imei }) => {

  const [loading, setLoading] = useState(false);
  const [odometro, setOdometro] = useState('');
  const [transmitindo, setTransmitindo] = useState(false);
  const [tanques, setTanques] = useState(0);
  const [volume, setVolume] = useState(0);
  const [tanquesOc, setTanquesOc] = useState(0);
  const [volumeOc, setVolumeOc] = useState(0);
  const [grid, setGrid] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [placaState, setPlaca] = useState('');

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

    NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    async function verificarSubmisao() {
      const veiculoTemp = await AsyncStorage.getItem('@veiculo');
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
            temp = 0;
            if (coletaItem.cod_ocorrencia != '') {
              volumeOC = coletaItem.volume;
            }
            if (coletaItem.temperatura >= 0) {
              temp = parseFloat(coletaItem.temperatura)
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
              temperatura: temp,
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

    const horafAdd = await AsyncStorage.getItem('@horaF');
    labels = ['Data', 'Nº Tanques', 'Volume', 'Tanq. Ocorrências', 'Vol. Fora Padrão', 'Hora Ínicio', 'Hora Fim'];
    values = [data, tanquesCount, volumeSum, tanquesCountOc, volumeSumOc, horaI, horafAdd]
    obj = {
      label: '',
      valor: '',
      id: '0'
    }
    listGrid = [];
    for (i = 0; i < 7; i++) {
      obj.label = labels[i];
      obj.valor = values[i];
      obj.id = String(i);
      listGrid.push(obj);
      obj = {
        label: '',
        valor: '',
        id: '0'
      }
    }
    setGrid(listGrid);
    setLoading(false);
  }

  function renderTotal(total) {
    return (
      <View style={total.id == '0' ? styles.ViewItemList1 : styles.ViewItemList}>
        <View style={styles.viewItemLinhaFinalizar}>
          <View style={styles.viewItemLatao}>
            <Text allowFontScaling={false} style={styles.textTituloFinalizar}>
              {total.label}
            </Text>
            <Text allowFontScaling={false} style={styles.textvalorFinal}>
              {total.valor}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  async function submeterColeta() {

    if (isConnected) {




      //criar array no formato que a api recebe
      setTransmitindo(true);
      setLoading(true);

      await AsyncStorage.setItem('@OdometroF', odometro);

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
        const odometroI = await AsyncStorage.getItem('@OdometroI');
        const odometroF = await AsyncStorage.getItem('@OdometroF');

        novaColeta = {};

        const response = await api.post('api/transportadora/verificarPlaca', {
          placa: placaState
        })
        const responseColetaEmAberto = await api.post('api/coleta/coletaEmAbertoPorVeiculo', {
          veiculo: response.data.motorista.VEICULO
        })

        if (responseColetaEmAberto.data.coleta) {
          novaColeta = responseColetaEmAberto.data.coleta;
        } else {
          const responseColeta = await api.post('api/coleta/NovaColeta', {
            data: data,
            transportador: response.data.motorista.COD_TRANSPORTADORA,
            motorista: response.data.motorista.COD_MOTORISTA,
            veiculo: response.data.motorista.VEICULO,
            odometroI: odometroI,
            odometroF: odometroF,
            id_pesagem: ''
          })
          novaColeta = responseColeta.data;
        }

        var coletaRequest = [];
        coleta.map((coleta) => {
          coleta.coleta.map((coletaItem) => {
            coletaItem.lataoList.map((latao) => {
              if (coletaItem.volume > 0 && coletaItem.cod_ocorrencia == '') {

                temp = 0;
                if (coletaItem.temperatura >= 0) {
                  temp = parseFloat(coletaItem.temperatura)
                }
                coletaUnidade = {
                  id_coleta: novaColeta.id,
                  id: coletaItem.id,
                  codigo: coletaItem.codigo,
                  codigo_cacal: coletaItem.codigo_cacal,
                  tanque: coletaItem.tanque,
                  latao: coletaItem.latao,
                  LINHA: coletaItem.LINHA,
                  lataoQuant: parseInt(coletaItem.lataoQuant),
                  ATUALIZAR_COORDENADA: coletaItem.ATUALIZAR_COORDENADA,
                  temperatura: temp,
                  odometro: coletaItem.odometro,
                  volume: latao.volume,
                  latitude: coletaItem.latitude,
                  longitude: coletaItem.longitude,
                  cod_ocorrencia: coletaItem.cod_ocorrencia,
                  observacao: coletaItem.observacao,
                  data: latao.data,
                  hora: latao.hora,
                  boca: 1,
                  volume_fora_padrao: 0
                };
                coletaRequest.push(coletaUnidade);
              }
            })
            if (coletaItem.cod_ocorrencia != '') {
              volumeOC = 0;
              volumeOC = coletaItem.volume;
              temp = 0;
              if (coletaItem.temperatura >= 0) {
                temp = parseFloat(coletaItem.temperatura)
              }
              coletaUnidade = {
                id_coleta: novaColeta.id,
                id: coletaItem.id,
                codigo: coletaItem.codigo,
                codigo_cacal: coletaItem.codigo_cacal,
                tanque: coletaItem.tanque,
                latao: coletaItem.latao,
                LINHA: coletaItem.LINHA,
                lataoQuant: parseInt(coletaItem.lataoQuant),
                ATUALIZAR_COORDENADA: coletaItem.ATUALIZAR_COORDENADA,
                temperatura: temp,
                odometro: coletaItem.odometro,
                volume: 0,
                latitude: coletaItem.latitude,
                longitude: coletaItem.longitude,
                cod_ocorrencia: coletaItem.cod_ocorrencia,
                observacao: coletaItem.observacao,
                data: coletaItem.lataoList[0].data,
                hora: coletaItem.lataoList[0].hora,
                boca: 1,
                volume_fora_padrao: volumeOC
              };
              coletaRequest.push(coletaUnidade);
            }
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
        Alert.alert(
          'Erro!',
          'Placa inválida!',
          [
            { text: 'ok', onPress: () => sair() },
          ]
        );
        console.log(error);
      }

      Alert.alert(
        'Sucesso!',
        'Coleta transferida!',
        [
          { text: 'ok', onPress: () => sair() },
        ]
      );
    } else {
      Alert.alert(
        'Erro!',
        'Sem conexão com a internet',
        [
          { text: 'ok' },
        ]
      );
    }
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
        <ScrollView>
          <View style={{
            padding: 24,
            flex: 1,
            justifyContent: "space-around"
          }}>

            {loading || transmitindo ? (
              <ActivityIndicator size="large" color="green" />
            ) : (

                <View style={styles.ViewTotalFinalizar}>
                  <View style={styles.ViewFlatList}>
                    <Text allowFontScaling={false} style={styles.textTituloGeralFinalizar}>Informações Gerais</Text>
                    <FlatList
                      data={grid}
                      keyExtractor={item => item.id}
                      renderItem={({ item }) => renderTotal(item)}
                    />
                  </View>

                  <View style={{ marginTop: 20 }}>
                    <Text allowFontScaling={false} style={styles.textDescOdometro}>
                      Placa Destino
                    </Text>
                    <TextInput
                      maxLength={9}
                      //keyboardType='numeric'
                      editable={!loading}
                      style={styles.inputPlaca}
                      value={placaState}
                      onChangeText={text => setPlaca(text)}
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
        </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Transferir);
