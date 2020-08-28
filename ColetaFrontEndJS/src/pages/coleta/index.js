import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsColeta from '../../store/actions/coletaActions';
import api from '../../services/api';
import styles from './styles';
import getRealm from '../../services/realm';
import { Button, Footer, FooterTab } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import Finalizar from './finalizarColeta';
import { CommonActions } from '@react-navigation/native';
import calcularTotalColetado from '../../functions/totalColeta';

const Coleta = ({ totalColetado, id_linha, linhas, cod_linha, navigation, save_coleta, save_tanque, coleta, tanqueAtual, data }) => {

  const [tanques, setTanques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lataoCont, setLataoCont] = useState(true);
  const [totalColetadoState, setTotalColetado] = useState(0);

  useEffect(() => {

    total = calcularTotalColetado(coleta);
    setTotalColetado(total);
    navigation.setOptions({
      headerRight: () => (
        <View>
        </View>
      ),
    });

    function goBack() {
      //limparCampos();
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            { name: 'Linha' },
          ],
        })
      );
    }

    /*navigation.setOptions({
      headerLeft: () => (
        <Button
          transparent
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon="arrow-left" color="white" size={25} style={{ marginLeft: 10 }} />
        </Button>
      ),
    });*/
    navigation.setOptions({
      headerLeft: () => (
        <Button
          transparent
          onPress={() => navigation.toggleDrawer()}>
          <FontAwesomeIcon icon="bars" color="white" size={25} style={{ marginLeft: 10 }} />
        </Button>
      ),
    });

    async function buscarTanques() {
      ;
      //coleta iniciada
      await AsyncStorage.setItem('@emAberto', 'true');
      //iniciando redux de coleta
      const realm = await getRealm();
      var coletaCopy = coleta;
      const TanquesUnicos = realm
        .objects('Tanque')
        .filtered('LINHA == $0 and TRUEPREDICATE SORT(tanque ASC) DISTINCT(tanque)', cod_linha);
      TanquesUnicos.addListener((TanquesUnicos) => {
        if (TanquesUnicos.length > 0) {
          let TanquesUnicosState = [];
          TanquesUnicos.map((tanqueUnicoPreencher) => {
            tanque = {
              id: tanqueUnicoPreencher.id,
              codigo: tanqueUnicoPreencher.codigo,
              codigo_cacal: tanqueUnicoPreencher.codigo_cacal,
              tanque: tanqueUnicoPreencher.tanque,
              latao: tanqueUnicoPreencher.latao,
              LINHA: tanqueUnicoPreencher.LINHA,
              LINHA_DESC: tanqueUnicoPreencher.descricao,
              descricao: tanqueUnicoPreencher.descricao,
              lataoQuant: tanqueUnicoPreencher.lataoQuant,
              ATUALIZAR_COORDENADA: tanqueUnicoPreencher.ATUALIZAR_COORDENADA,
              lataoList: [],
              temperatura: 0,
              odometro: '',
              volume: 0,
              volume_fora_padrao: 0,
              latitude: '',
              longitude: '',
              cod_ocorrencia: '',
              observacao: '',
              boca: 1
            }
            TanquesUnicosState.push(tanque);
          })
          const TanquesTodos = realm
            .objects('Tanque')
            .filtered('LINHA == $0', cod_linha);
          TanquesTodos.addListener((TanquesTodos) => {
            if (TanquesTodos.length > 0) {
              TanquesUnicos.map((tanqueUnico) => {
                let lataoArray = [];
                TanquesTodos.map((tanqueList) => {
                  if (tanqueList.tanque == tanqueUnico.tanque) {
                    lataoObj = {
                      latao: tanqueList.latao,
                      volume: 0,
                      data: '',
                      hora: ''
                    }
                    lataoArray.push(lataoObj)
                  }
                })
                TanquesUnicosState[TanquesUnicos.indexOf(tanqueUnico)].lataoList = lataoArray;
              })
              coletaCopy.map((coletaItem) => {
                if (coletaItem.id == cod_linha) {
                  coletaItem.coleta = TanquesUnicosState
                }
              })
              save_coleta(coletaCopy);
              setLoading(false);
            }
          });
        }
      });
    }
    coleta.map((coletaItem) => {
      if (coletaItem.id == cod_linha) {
        if (coletaItem.coleta.length <= 0) {
          buscarTanques();
        }
      }
    })

  }, [])

  async function coletarTanque(tanque) {
    //alterar list para os latões
    save_tanque(tanque);
    AsyncStorage.setItem('@tanqueAtual', JSON.stringify(tanque));
    navigation.navigate('Latao');
  }
  //renderiza item da lista
  function renderTanque(tanque) {

    let cont = 0;
    tanque.lataoList.map((latao) => {
      if (latao.volume > 0) {
        cont++;
      }
    })

    function confirmarExclusao(tanque) {
      const index = coleta[id_linha].coleta.indexOf(tanque)
      Alert.alert(
        'Atenção',
        'Deseja excuir a coleta desse tanque?',
        [
          { text: 'Sim', onPress: () => limparColeta(index) },
          { text: 'Não' },
        ]
      );

    }

    async function limparColeta(index) {

      setLoading(true);
      var copyColeta = coleta;

      copyColeta[id_linha].coleta[index].cod_ocorrencia = '';
      copyColeta[id_linha].coleta[index].observacao = '';
      copyColeta[id_linha].coleta[index].odometro = '';
      copyColeta[id_linha].coleta[index].volume = 0;
      copyColeta[id_linha].coleta[index].volume_fora_padrao = 0;
      copyColeta[id_linha].coleta[index].temperatura = 0;
      copyColeta[id_linha].coleta[index].latitude = '';
      copyColeta[id_linha].coleta[index].longitude = '';
      copyColeta[id_linha].coleta[index].cod_ocorrencia = '';
      copyColeta[id_linha].coleta[index].observacao = '';
      copyColeta[id_linha].coleta[index].lataoList.map((latao) => {
        latao.hora = '';
        latao.data = '';
        latao.volume = 0;
      })

      save_coleta(copyColeta);
      AsyncStorage.setItem('@coleta', JSON.stringify(copyColeta));
      total = calcularTotalColetado(copyColeta);
      setTotalColetado(total);
      setLoading(false);
    }

    return (
      <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
        <TouchableOpacity onPress={() => coletarTanque(tanque)}>
          <View style={styles.viewItemLinha}>
            <Text allowFontScaling={false} style={styles.textCod}>
              {tanque.tanque}
            </Text>
            <Text allowFontScaling={false} style={styles.textNome}>
              {tanque.lataoList.length}/{cont}
            </Text>
            <Text allowFontScaling={false} style={styles.textNome}>
              {tanque.volume}
            </Text>
          </View>
        </TouchableOpacity>
        {(tanque.volume > 0 || tanque.cod_ocorrencia != '') &&
          <Button
            style={{ flex: 1, alignSelf: 'center', height: 30, position: 'absolute', right: 20 }}
            transparent
            onPress={() => confirmarExclusao(tanque)}>
            <FontAwesomeIcon icon="trash" color="black" size={25} style={{ marginLeft: 20 }} />
          </Button>
        }

      </View >

    )
  }

  /*
  <Text style={styles.textCod}>
              {tanque.tanque}
            </Text>
            <Text style={styles.textNome}>
              {tanque.lataoList.length}/{cont}
            </Text>
            <Text style={styles.textNome}>
              {tanque.volume}
            </Text>
            */

  return (
    <View>
      {coleta[id_linha].coleta.length > 0 ?
        (
          <View>
            <View style={styles.viewMainFlatList}>
              <Text maxFontSizeMultiplier={1} style={styles.textTitulo}>{coleta[id_linha].coleta[0].descricao}</Text>
              <FlatList
                data={coleta[id_linha].coleta}
                keyExtractor={item => item.id}
                renderItem={({ item }) => renderTanque(item)}
              />
            </View>

            <View style={styles.viewTotalColetado}>
              <Text style={styles.textTotalColetado}>Total Coletado</Text>
              <Text style={styles.ValueTotalColetado}>{totalColetadoState}</Text>
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color="green" />
        )
      }
    </View>
  );
}

const mapStateToProps = state => ({
  cod_linha: state.Coleta.cod_linha,
  coleta: state.Coleta.coleta,
  tanqueAtual: state.Coleta.tanqueAtual,
  data: state.Coleta.data,
  linhas: state.Coleta.linhas,
  id_linha: state.Coleta.id_linha,
  totalColetado: state.Coleta.totalColetado
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionsColeta, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Coleta);
