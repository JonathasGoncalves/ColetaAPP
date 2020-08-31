import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsColeta from '../../store/actions/coletaActions';
import styles from './styles';
import { Button } from 'native-base';
import getRealm from '../../services/realm';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import { time } from '../../functions/tempo';
import { CommonActions } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import * as actionsIMEI from '../../store/actions/imeiActions';

const Finalizar = ({ removerID, id_coleta, linhas, coleta, data, horaI, horaF, finalizar_coleta, navigation, save_coleta, cod_linha, placa, transmitir_coleta, adicionar_horaF, imei }) => {

  const [loading, setLoading] = useState(false);
  const [transmitindo, setTransmitindo] = useState(false);
  const [tanques, setTanques] = useState(0);
  const [volume, setVolume] = useState(0);
  const [tanquesOc, setTanquesOc] = useState(0);
  const [volumeOc, setVolumeOc] = useState(0);

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
    setLoading(false);
  }

  async function submeterColeta() {

    //criar array no formato que a api recebe
    setTransmitindo(true);
    setLoading(true);

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
      console.log(veiculoTemp);

      const responseColeta = await api.post('api/coleta/NovaColeta', {
        cod_transportadora: veiculo.COD_TRANSPORTADORA,
        data: dataHJ
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
        removerID();
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
        { text: 'ok' },
      ]
    );

    finalizar_coleta();
    //await updateTanques();
    setTransmitindo(false);
    setLoading(false);
    save_coleta([]);
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Coletar' },
        ],
      })
    );

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
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="green" />
      ) : (
          <View style={styles.ViewButton}>
            <View>
              <Text allowFontScaling={false} style={styles.textTituloGeral}>Informações Gerais</Text>
              <View style={styles.ViewColetaInfo}>
                <View>
                  <Text allowFontScaling={false} style={styles.itemColetaInfo}>Data</Text>
                  <Text allowFontScaling={false} style={styles.itemColetaInfo}>Nº Tanques</Text>
                  <Text allowFontScaling={false} style={styles.itemColetaInfo}>Volume</Text>
                  <Text allowFontScaling={false} style={styles.itemColetaInfo}>Tanq. Ocorrências</Text>
                  <Text allowFontScaling={false} style={styles.itemColetaInfo}>Vol. Fora Padrão</Text>
                  <Text allowFontScaling={false} style={styles.itemColetaInfo}>Hora Ínicio</Text>
                  <Text allowFontScaling={false} style={styles.itemColetaInfoLast}>Hora Fim</Text>
                </View>
                <View>
                  <Text allowFontScaling={false} style={styles.itemColetaResp}>{data}</Text>
                  <Text allowFontScaling={false} style={styles.itemColetaResp}>{tanques}</Text>
                  <Text allowFontScaling={false} style={styles.itemColetaResp}>{volume} lts</Text>
                  <Text allowFontScaling={false} style={styles.itemColetaResp}>{tanquesOc}</Text>
                  <Text allowFontScaling={false} style={styles.itemColetaResp}>{volumeOc} lts</Text>
                  <Text allowFontScaling={false} style={styles.itemColetaResp}>{horaI}</Text>
                  <Text allowFontScaling={false} style={styles.itemColetaRespLast}>{horaF}</Text>
                </View>
              </View>
            </View>
            <Button
              block
              style={loading || transmitindo ? styles.buttonContinuarPress : styles.buttonContinuar}
              disabled={transmitindo}
              rounded={true}
              onPress={submeterColeta}
            >
              <Text allowFontScaling={false} style={styles.textButtonContinuar}>Transmitir Coleta</Text>
            </Button>
          </View>
        )
      }
    </View>
  )
}

const mapStateToProps = state => ({
  tanqueAtual: state.Coleta.tanqueAtual,
  coleta: state.Coleta.coleta,
  emAberto: state.Coleta.emAberto,
  cod_linha: state.Coleta.cod_linha,
  placa: state.Identificacao.placa,
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
