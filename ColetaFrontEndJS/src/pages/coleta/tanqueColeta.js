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

const TanqueColeta = ({ salvar_total_coletado, salvar_total_coletadoOff, id_linha, coleta, tanqueAtual, navigation, save_coleta, save_tanque, cod_linha }) => {

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [coletando, setColetando] = useState(false);
  const [odometro, setOdometro] = useState('');
  const [volume, setVolume] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [loading, setLoading] = useState(false);
  const [obs, setObs] = useState('');
  const [obsType, setObsType] = useState('');
  const [editableLabel, setEditableLabel] = useState(true);
  const [tempInvalida, setTemInvalida] = useState(false);

  useEffect(() => {
    function setLocalizacao(geolocation) {
      setLatitude(String(geolocation.coords.latitude));
      setLongitude(String(geolocation.coords.longitude));
    }

    try {
      //Geolocation.getCurrentPosition(info => setLocalizacao(info));
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
    setTemperatura(String(tanqueAtual.temperatura));
    setOdometro(tanqueAtual.odometro);

    if (tanqueAtual.cod_ocorrencia != '') {
      setObsType(tanqueAtual.cod_ocorrencia);
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


  }, [])

  function setTemperaturaAction(text) {
    newText = text.replace(/[^0-9.]/g, '');

    if (parseInt(newText) > 99.9) {
      setTemInvalida(true);
    } else {
      setTemInvalida(false);
    }
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
    if (coletando) {
      setColetando(!coletando);
      return true;
    } else {
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
  }

  async function onPressInfo() {
    setLoading(true);

    const dataFormat = date();
    const timeFormat = time();

    var copyColeta = coleta;
    var tanqueTemp = {};
    copyColeta[id_linha].coleta.map((tanqueMap) => {
      if (tanqueMap.tanque == tanqueAtual.tanque) {
        if (obsType == '003') {
          tanqueMap.volume = parseInt(volume);
          tanqueMap.lataoList.map((listLatao) => {
            listLatao.volume = 0;
          })
        }
        tanqueMap.lataoList.map((listLatao) => {
          listLatao.hora = timeFormat;
          listLatao.data = dataFormat;
        })
        tanqueMap.cod_ocorrencia = obsType;
        tanqueMap.observacao = obs;
        tanqueMap.odometro = odometro;
        if (temperatura != '') {
          tanqueMap.temperatura = parseFloat(temperatura);
        } else {
          tanqueMap.temperatura = 0;
        }
        tanqueTemp = tanqueMap;
      }
    })

    total = calcularTotalColetado(copyColeta);
    salvar_total_coletado(total.total);
    salvar_total_coletadoOff(total.totalOff);

    save_tanque(tanqueTemp);
    await AsyncStorage.setItem('@tanqueAtual', JSON.stringify(tanqueTemp));
    await AsyncStorage.setItem('@coleta', JSON.stringify(copyColeta));
    save_coleta(copyColeta);
    if (obsType != '') {
      navigation.dispatch(state => {
        // Remove the home route from the stack
        const routes = state.routes.filter(r => r.name !== 'Home');
        return CommonActions.reset({
          index: 0,
          routes
        });
      });
      navigation.goBack();
      setLoading(false);
    } else {
      navigation.navigate('LataoList');
      setLoading(false);
    }
  }

  function setObsTypeFunction(type) {
    if (type == obsType) {
      setObsType('');
      //setTemperatura(0);
      //setOdometro('');
      //setEditableLabel(true);
    } else {
      //setTemperatura(0);
      //setOdometro('');
      //setEditableLabel(false);
      setObsType(type);
    }
  }

  return (
    <Container >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{
          padding: 24,
          flex: 1,
          justifyContent: "space-around"
        }}>
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
                maxLength={4}
                editable={editableLabel}
                keyboardType='numeric'
                style={styles.inputPlaca}
                value={temperatura}
                onChangeText={text => setTemperaturaAction(text)}
              />
              {tempInvalida && <Text allowFontScaling={false} style={{ alignSelf: 'center', color: 'red' }}>Temperatura precisa ser menor que 99.9</Text>}
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
                      maxLength={6}
                      keyboardType='numeric'
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
              style={(obsType == '' && (odometro.length <= 0 || temperatura.length <= 0) || (obsType != '' && (odometro.length <= 0)) || (obsType == '003' && (volume.length <= 0)) ||
                (obsType == '004' && (obs.length <= 0)) ||
                loading || tempInvalida) ? styles.buttonContinuarPress : styles.buttonContinuar}
              rounded={true}
              onPress={onPressInfo}
              disabled={
                (
                  odometro.length <= 0 ||
                  (obsType == '' && (odometro.length <= 0 || temperatura.length <= 0)) ||
                  (obsType == '003' && (volume.length <= 0))) ||
                (obsType == '004' && (obs.length <= 0) ||
                  loading || tempInvalida
                )
              }
            >
              <Text allowFontScaling={false} style={styles.textButtonContinuar}>Continuar</Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container >
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

export default connect(mapStateToProps, mapDispatchToProps)(TanqueColeta);