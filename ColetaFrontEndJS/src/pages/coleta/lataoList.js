import React, { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, ActivityIndicator, FlatList, TouchableOpacity, TextInput, ScrollView, Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsColeta from '../../store/actions/coletaActions';
import styles from './styles';
import { Button } from 'native-base';
import { CommonActions } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Content, ListItem, Radio, Right, Left, Container } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { date, time } from '../../functions/tempo';
import Geolocation from '@react-native-community/geolocation';
import calcularTotalColetado from '../../functions/totalColeta';


const LataoList = ({ save_latao, id_linha, coleta, tanqueAtual, navigation, save_coleta, save_tanque, cod_linha }) => {

  const [latao, setLatao] = useState(0);
  const [totalColetadoState, setTotalColetado] = useState(0);
  const [totalColetadoOffState, setTotalColetadoOffState] = useState(0);

  useEffect(() => {
    console.log(tanqueAtual);
    total = calcularTotalColetado(coleta);
    setTotalColetado(total.total);
    setTotalColetadoOffState(total.totalOff);
  }, [tanqueAtual])

  navigation.setOptions({
    headerRight: () => (
      <View></View>
    ),
  });

  navigation.setOptions({
    headerLeft: () => (
      <Button
        transparent
        onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon="arrow-left" color="white" size={25} style={{ marginLeft: 10 }} />
      </Button>
    ),
  });

  function coletarLatao(latao) {
    console.log(latao.volume);
    /*if (latao.volume > 0) {
      //setVolume(String(latao.volume));
    } else {
      //setVolume('');
    }*/
    save_latao(latao);
    setLatao(latao.latao);
    navigation.navigate('Latao');
  }

  function confirmarExclusao(latao) {
    const indexTanque = coleta[id_linha].coleta.indexOf(tanqueAtual);
    const index = coleta[id_linha].coleta[indexTanque].lataoList.indexOf(latao);

    Alert.alert(
      'Atenção',
      'Deseja excuir a coleta desse tanque?',
      [
        { text: 'Sim', onPress: () => limparColeta(indexTanque, index) },
        { text: 'Não' },
      ]
    );
  }

  async function limparColeta(indexTanque, index) {
    setLoading(true);
    var copyColeta = coleta;
    temp = parseInt(copyColeta[id_linha].coleta[indexTanque].volume);
    temp2 = parseInt(copyColeta[id_linha].coleta[indexTanque].lataoList[index].volume);
    copyColeta[id_linha].coleta[indexTanque].volume = temp - temp2;
    //copyColeta[id_linha].coleta[indexTanque].volume = copyColeta[id_linha].coleta[indexTanque].volume - copyColeta[id_linha].coleta[indexTanque].lataoList[index].volume_fora_padrao;
    copyColeta[id_linha].coleta[indexTanque].lataoList[index].hora = '';
    copyColeta[id_linha].coleta[indexTanque].lataoList[index].data = '';
    copyColeta[id_linha].coleta[indexTanque].lataoList[index].volume = 0;
    if (copyColeta[id_linha].coleta[indexTanque].volume == 0) {
      copyColeta[id_linha].coleta[indexTanque].cod_ocorrencia = '';
      copyColeta[id_linha].coleta[indexTanque].observacao = '';
    }
    save_coleta(copyColeta);
    total = calcularTotalColetado(copyColeta);
    setTotalColetado(total.total);
    setTotalColetadoOffState(total.totalOff)
    AsyncStorage.setItem('@coleta', JSON.stringify(copyColeta));
    setLoading(false);
  }

  function renderLataoList(latao) {
    return (
      <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={() => coletarLatao(latao)}>
          <View style={styles.viewItemLinhaFlex}>
            <View style={styles.viewItemLatao}>
              <Text allowFontScaling={false} style={styles.textTitulo}>
                Latão
            </Text>
              <Text allowFontScaling={false} style={styles.textCod}>
                {latao.latao}
              </Text>
            </View>
            <View style={styles.viewItemLatao}>
              <Text allowFontScaling={false} style={styles.textTitulo}>
                Volume
              </Text>
              <Text allowFontScaling={false} style={styles.textCod}>
                {latao.volume}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {latao.volume > 0 &&
          <Button
            style={{ flex: 1, alignSelf: 'center', height: 30, position: 'absolute', right: 20 }}
            transparent
            onPress={() => confirmarExclusao(latao)}>
            <FontAwesomeIcon icon="trash" color="black" size={25} style={{ marginLeft: 20 }} />
          </Button>
        }
      </View>
    )
  }

  return (
    <View>
      <View style={styles.viewMainFlatList}>
        <FlatList
          data={tanqueAtual.lataoList}
          keyExtractor={item => item.latao}
          renderItem={({ item }) => renderLataoList(item)}
        />
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={styles.viewTotalColetado}>
          <Text style={styles.textTotalColetado}>Total Coletado</Text>
          <Text style={styles.ValueTotalColetado}>{totalColetadoState}</Text>
        </View>
        <View style={styles.viewTotalColetado}>
          <Text style={styles.textTotalColetado}>Total Fora do Padrão</Text>
          <Text style={styles.ValueTotalColetado}>{totalColetadoOffState}</Text>
        </View>
      </View>
    </View>
  );
}


const mapStateToProps = state => ({
  tanqueAtual: state.Coleta.tanqueAtual,
  coleta: state.Coleta.coleta,
  cod_linha: state.Coleta.cod_linha,
  id_linha: state.Coleta.id_linha,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionsColeta, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LataoList);





