import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, TextInput, ScrollView, Alert, BackHandler } from 'react-native';
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

const LataoColeta = ({ id_linha, coleta, tanqueAtual, navigation, save_coleta, save_tanque, cod_linha }) => {

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [tanque, setTanque] = useState({});
  const [coletando, setColetando] = useState(false);
  const [info, setInfo] = useState(true);
  const [odometro, setOdometro] = useState('');
  const [volume, setVolume] = useState('');
  const [temperatura, setTemperatura] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingLimpar, setloadingLimpar] = useState(true);
  const [latao, setLatao] = useState(0);
  const [obs, setObs] = useState('');
  const [obsType, setObsType] = useState('');
  const [editableLabel, setEditableLabel] = useState(true);
  const [dateSave, setDate] = useState('');
  const [totalColetadoState, setTotalColetado] = useState(0);


  useEffect(() => {

    total = calcularTotalColetado(coleta);
    setTotalColetado(total);

    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);

    function setLocalizacao(geolocation) {
      setLatitude(String(geolocation.coords.latitude));
      setLongitude(String(geolocation.coords.longitude));
    }

    try {
      Geolocation.getCurrentPosition(info => setLocalizacao(info));
    } catch (error) {
      Alert.alert(
        'Atenção!',
        'Não foi possivel capturar a localização!',
        [
          { text: 'ok' },
        ]
      );
    }


    setObs(tanqueAtual.observacao);
    setTemperatura(tanqueAtual.temperatura);
    setOdometro(tanqueAtual.odometro);

    if (tanqueAtual.cod_ocorrencia != '') {
      setObsType(tanqueAtual.cod_ocorrencia);
      setEditableLabel(false);
    }

    navigation.setOptions({
      headerRight: () => (
        <View></View>
      ),
    });

    navigation.setOptions({
      headerLeft: () => (
        <Button
          transparent
          onPress={() => handleBackButtonClick()}>
          <FontAwesomeIcon icon="arrow-left" color="white" size={25} style={{ marginLeft: 10 }} />
        </Button>
      ),
    });

    function filtrarTanque(tanque) {
      return tanque.tanque == tanqueAtual.tanque
    }

    const tanqueFind = coleta[id_linha].coleta.filter(filtrarTanque);
    setTanque(tanqueFind[0]);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }
  }, [])

  function setTemperaturaAction(text) {
    newText = text.replace(/[^0-9]/g, '');
    setTemperatura(newText);
  }

  function setOdometroAction(text) {
    newText = text.replace(/[^0-9]/g, '');
    setOdometro(newText);
  }

  function setVolumeAction(text) {
    newText = text.replace(/[^0-9]/g, '');
    setVolume(newText);
  }


  function handleBackButtonClick() {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Coleta' },
        ],
      })
    );
    return true;
  }

  function verificarVolume(volumeVerificar) {
    if (volumeVerificar >= 0) {
      setVolume(volumeVerificar);
    } else {
      Alert.alert(
        'Valor inválido!',
        'Volume negativo!',
        [
          { text: 'Continuar' },
        ]
      );
    }
  }

  function coletarLatao(latao) {
    setVolume(latao.volume);
    setLatao(latao.latao);
    setColetando(true);
  }

  async function onPressInfo() {
    const dataFormat = date();
    const timeFormat = time();
    setDate(dataFormat);

    var copyColeta = coleta;
    var tanqueTemp = {};
    copyColeta[id_linha].coleta.map((tanqueMap) => {
      if (tanqueMap.tanque == tanqueAtual.tanque) {
        //tanqueTemp = tanqueMap;

        tanqueMap.lataoList.map((listLatao) => {
          listLatao.hora = timeFormat;
          listLatao.data = dataFormat;
        })
        tanqueMap.volume = parseInt(volume);

        tanqueMap.cod_ocorrencia = obsType;
        tanqueMap.observacao = obs;
        tanqueMap.odometro = odometro;
        tanqueMap.temperatura = temperatura;
        tanqueTemp = tanqueMap;
      }
    })
    save_tanque(tanqueTemp);
    await AsyncStorage.setItem('@tanqueAtual', JSON.stringify(tanqueTemp));
    await AsyncStorage.setItem('@coleta', JSON.stringify(copyColeta));
    //await AsyncStorage.setItem('@finalizado', '1');
    save_coleta(copyColeta);
    if (obsType != '') {
      handleBackButtonClick();
    } else {
      setInfo(false);
    }
  }

  async function onPressColetar() {

    dataFormat = date();
    timeFormat = time();

    var copyColeta = coleta;
    var contColeta = 0;
    var tanqueTemp = {};


    copyColeta[id_linha].coleta.map((tanqueMap) => {
      if (tanqueMap.tanque == tanqueAtual.tanque) {
        //tanqueTemp = tanqueMap;

        tanqueMap.lataoList.map((listLatao) => {
          if (latao == listLatao.latao) {
            tanqueTemp = tanqueMap;
            if (tanqueMap.cod_ocorrencia == '') {
              if (tanqueMap.volume > 0) {
                tanqueMap.volume = parseInt(tanqueMap.volume) - parseInt(listLatao.volume) + parseInt(volume);
              }
              listLatao.volume = parseInt(volume);
            } else {
              tanqueMap.volume = parseInt(tanqueMap.volume) - parseInt(listLatao.volume) + parseInt(volume);
              listLatao.volume = parseInt(volume);
              //tanqueMap.volume = parseInt(tanqueMap.volume) + parseInt(volume);
            }
          }
        })
        tanqueMap.volume = parseInt(volume);
        tanqueMap.cod_ocorrencia = obsType;
        tanqueMap.observacao = obs;
        tanqueMap.odometro = odometro;
        tanqueMap.temperatura = temperatura;
        tanqueTemp = tanqueMap;
      }
    })

    total = calcularTotalColetado(coleta);
    setTotalColetado(total);

    save_tanque(tanqueTemp);
    await AsyncStorage.setItem('@tanqueAtual', JSON.stringify(tanqueTemp));
    await AsyncStorage.setItem('@coleta', JSON.stringify(copyColeta));
    save_coleta(copyColeta);
    setColetando(false);
  }

  function setObsTypeFunction(type) {
    if (type == obsType) {
      setObsType('');
      setTemperatura(0);
      setOdometro('');
      setEditableLabel(true);
    } else {
      setTemperatura(0);
      setOdometro('');
      setEditableLabel(false);
      setObsType(type);
    }
  }

  function confirmarExclusao(latao) {
    const indexTanque = coleta[id_linha].coleta.indexOf(tanque);
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
    console.log(index);
    console.log(indexTanque);
    copyColeta[id_linha].coleta[indexTanque].volume = parseInt(copyColeta[id_linha].coleta[indexTanque].volume) - parseInt(copyColeta[id_linha].coleta[indexTanque].lataoList[index].volume);
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
    setTotalColetado(total);
    AsyncStorage.setItem('@coleta', JSON.stringify(copyColeta));
    setLoading(false);
  }

  function renderLataoList(latao) {
    return (
      <View style={{ flexDirection: 'row', borderBottomWidth: 1 }}>
        <TouchableOpacity onPress={() => coletarLatao(latao)}>
          <View style={styles.viewItemLinha}>
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
            disabled={!loadingLimpar}
            style={{ flex: 1, alignSelf: 'center', height: 30 }}
            transparent
            onPress={() => confirmarExclusao(latao)}>
            <FontAwesomeIcon icon="trash" color="black" size={25} style={{ marginLeft: 20 }} />
          </Button>
        }
      </View>
    )
  }

  return (
    <View >
      {info ? (
        <View>
          <ScrollView>
            <Text allowFontScaling={false} style={styles.textTitulo}>Odômetro</Text>
            <TextInput
              maxLength={9}
              editable={editableLabel}
              keyboardType='numeric'
              style={styles.inputPlaca}
              value={odometro}
              onChangeText={text => setOdometroAction(text)}
            />
            <Text allowFontScaling={false} style={styles.textTitulo}>Temperatura</Text>
            <TextInput
              maxLength={3}
              editable={editableLabel}
              keyboardType='numeric'
              style={styles.inputPlaca}
              value={temperatura}
              onChangeText={text => setTemperaturaAction(text)}
            />
            <View >
              <ListItem style={{ borderColor: 'white' }}>
                <Left>
                  <Text
                    allowFontScaling={false}
                    style={styles.textCod}
                    onPress={() => setObsTypeFunction('001')}
                  >
                    IMP. DE ACESSO AO TANQUE</Text>
                </Left>
                <Right>
                  <Radio
                    selectedColor={"#F9690E"}
                    selected={obsType == '001'}
                    onPress={() => setObsTypeFunction('001')}
                  />
                </Right>
              </ListItem>
              <ListItem style={{ borderColor: 'white' }}>
                <Left>
                  <Text
                    allowFontScaling={false}
                    style={styles.textCod}
                    onPress={() => setObsTypeFunction('002')}
                  >
                    VOLUME INSUFICIENTE</Text>
                </Left>
                <Right>
                  <Radio
                    selectedColor={"#F9690E"}
                    selected={obsType == '002'}
                    onPress={() => setObsTypeFunction('002')}
                  />
                </Right>
              </ListItem>
              <ListItem style={{ borderColor: 'white' }}>
                <Left>
                  <Text
                    allowFontScaling={false}
                    style={styles.textCod}
                    onPress={() => setObsTypeFunction('003')}
                  >
                    LEITE FORA DO PADRAO</Text>
                </Left>
                <Right>
                  <Radio
                    selectedColor={"#F9690E"}
                    selected={obsType == '003'}
                    onPress={() => setObsTypeFunction('003')}
                  />
                </Right>
              </ListItem>
              <ListItem style={{ borderColor: 'white' }}>
                <Left>
                  <Text
                    allowFontScaling={false}
                    style={styles.textCod}
                    onPress={() => setObsTypeFunction('004')}
                  >
                    OUTROS</Text>
                </Left>
                <Right>
                  <Radio
                    selectedColor={"#F9690E"}
                    selected={obsType == '004'}
                    onPress={() => setObsTypeFunction('004')}
                  />
                </Right>
              </ListItem>
              {obsType == '004' &&
                <>
                  <Text allowFontScaling={false} style={styles.textTitulo}>Observações</Text>
                  <TextInput
                    multiline={true}
                    style={styles.inputPlaca}
                    value={obs}
                    onChangeText={text => setObs(text)}
                  />
                </>
              }
              {obsType == '003' &&
                <>
                  <Text allowFontScaling={false} style={styles.textTitulo}>Volume Fora Do Padrão</Text>
                  <TextInput
                    multiline={true}
                    style={styles.inputPlaca}
                    value={volume}
                    onChangeText={text => setVolumeAction(text)}
                  />
                </>
              }
            </View>
          </ScrollView>
          <Button
            block
            style={(obsType == '' && (loading || odometro.length <= 0 || temperatura.length <= 0)) ? styles.buttonContinuarPress : styles.buttonContinuar}
            rounded={true}
            onPress={onPressInfo}
            disabled={(obsType == '' && (odometro.length <= 0 || temperatura.length <= 0))}
          >
            <Text allowFontScaling={false} style={styles.textButtonContinuar}>Continuar</Text>
          </Button>
        </View>
      ) : coletando ? (
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
                  <Text style={styles.ValueInfoColeta}>{latao}</Text>
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
            style={styles.inputPlaca}
            value={volume}
            onChangeText={text => setVolumeAction(text)}
          />
          <Button
            block
            style={loading || volume.length <= 0 ? styles.buttonContinuarPress : styles.buttonContinuar}
            rounded={true}
            onPress={onPressColetar}
            disabled={loading || volume < 0}
          >
            <Text allowFontScaling={false} style={styles.textButtonContinuar}>Coletar</Text>
          </Button>
        </View>
      ) : (
            <View>
              <View style={styles.viewMainFlatList}>
                <FlatList
                  data={tanque.lataoList}
                  keyExtractor={item => item.latao}
                  renderItem={({ item }) => renderLataoList(item)}
                />
              </View>
              <View style={styles.viewTotalColetado}>
                <Text style={styles.textTotalColetado}>Total Coletado</Text>
                <Text style={styles.ValueTotalColetado}>{totalColetadoState}</Text>
              </View>
            </View>
          )
      }
    </View >
  );
}

const mapStateToProps = state => ({
  tanqueAtual: state.Coleta.tanqueAtual,
  coleta: state.Coleta.coleta,
  cod_linha: state.Coleta.cod_linha,
  id_linha: state.Coleta.id_linha
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionsColeta, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LataoColeta);