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


const LataoColeta = ({ salvar_total_coletadoOff, salvar_total_coletado, save_latao, lataoAtual, id_linha, coleta, tanqueAtual, navigation, save_coleta, save_tanque, cod_linha }) => {

  const [coletando, setColetando] = useState(false);
  const [volume, setVolume] = useState('');
  const [loading, setLoading] = useState(false);
  const [latao, setLatao] = useState(0);
  const [dateSave, setDate] = useState('');
  const [totalColetadoState, setTotalColetado] = useState(0);
  const [totalColetadoOffState, setTotalColetadoOffState] = useState(0);

  function setVolumeAction(text) {
    newText = text.replace(/[^0-9]/g, '');
    setVolume(newText);
  }

  useEffect(() => {
    if (lataoAtual.volume > 0) {
      setVolume(String(lataoAtual.volume));
    }

  }, [])

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


  async function onPressColetar() {
    setLoading(true);
    dataFormat = date();
    timeFormat = time();
    var copyColeta = coleta;
    var indexTanque = 0;
    var lataoTemp = {};
    copyColeta[id_linha].coleta.map((tanqueMap) => {
      if (tanqueMap.tanque == tanqueAtual.tanque) {
        indexTanque = copyColeta[id_linha].coleta.indexOf(tanqueMap);
        tanqueMap.lataoList.map((listLatao) => {
          if (lataoAtual.latao == listLatao.latao) {
            listLatao.hora = timeFormat;
            listLatao.data = dataFormat;
            if (tanqueMap.volume > 0) {
              tanqueMap.volume = parseInt(tanqueMap.volume) - parseInt(listLatao.volume) + parseInt(volume);
            } else {
              tanqueMap.volume = parseInt(volume);
            }
            listLatao.volume = parseInt(volume);
            lataoTemp = listLatao;
          }
        })
      }
    })


    //setTotalColetado(total.total);
    //setTotalColetadoOffState(total.totalOff);
    await AsyncStorage.setItem('@tanqueAtual', JSON.stringify(copyColeta[id_linha].coleta[indexTanque]));
    await AsyncStorage.setItem('@coleta', JSON.stringify(copyColeta));
    save_tanque(copyColeta[id_linha].coleta[indexTanque]);
    save_coleta(copyColeta);
    save_latao(lataoTemp);
    total = calcularTotalColetado(coleta);
    salvar_total_coletado(total.total);
    salvar_total_coletadoOff(total.totalOff);


    navigation.dispatch(state => {
      const routes = state.routes.filter(r => r.name !== 'Home');
      return CommonActions.reset({
        index: 0,
        routes
      });
    });
    navigation.goBack();
    setLoading(false);
  }

  return (
    <View>
      <View>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flexDirection: 'row', marginLeft: 10 }}>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={styles.textInfoColeta}>Tanque</Text>
              <Text style={styles.ValueInfoColeta}>{tanqueAtual.tanque}</Text>
            </View>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={styles.textInfoColeta}>Latão</Text>
              <Text style={styles.ValueInfoColeta}>{lataoAtual.latao}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', marginLeft: 10 }}>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={styles.textInfoColeta}>Odometro</Text>
              <Text style={styles.ValueInfoColeta}>{tanqueAtual.odometro}</Text>
            </View>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={styles.textInfoColeta}>Temperatura</Text>
              <Text style={styles.ValueInfoColeta}>{tanqueAtual.temperatura}</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <Text style={styles.textInfoColeta}>Data</Text>
            <Text style={styles.ValueInfoColeta}>{dateSave}</Text>
          </View>
        </View>
      </View>


      <Text allowFontScaling={false} style={styles.textTitulo}>Volume</Text>
      <TextInput
        keyboardType='numeric'
        maxLength={6}
        style={styles.inputPlaca}
        value={volume}
        onChangeText={text => setVolumeAction(text)}
      />
      <Button
        block
        style={loading || volume.length <= 0 ? styles.buttonContinuarPress : styles.buttonContinuar}
        rounded={true}
        onPress={onPressColetar}
        disabled={loading || volume.length <= 0}
      >
        <Text allowFontScaling={false} style={styles.textButtonContinuar}>Coletar</Text>
      </Button>
    </View>
  );
}


const mapStateToProps = state => ({
  tanqueAtual: state.Coleta.tanqueAtual,
  coleta: state.Coleta.coleta,
  cod_linha: state.Coleta.cod_linha,
  id_linha: state.Coleta.id_linha,
  lataoAtual: state.Coleta.lataoAtual
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionsColeta, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LataoColeta);





