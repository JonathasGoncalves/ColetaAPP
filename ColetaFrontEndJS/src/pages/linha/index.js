import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Alert, ListViewBase } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsIMEI from '../../store/actions/imeiActions';
import * as actionsColeta from '../../store/actions/coletaActions';
import api from '../../services/api';
import styles from './styles';
import { Button } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import getRealm from '../../services/realm';
import TanqueSchema from '../../schemas/TanqueRepository';
import AsyncStorage from '@react-native-community/async-storage';
import { time, date } from '../../functions/tempo';

const Linha = ({ save_linhaID, coleta, linhas, navigation, save_linha, adicionar_data, adicionar_horaI, save_coleta }) => {
  const [linhasRender, setLinhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [path, setPath] = React.useState('');
  /*
  formato do objeto com todas as coletas. 
  Coleta guarda o array de tanque e valores coletados e id é o numero da linha
    [
      {
        "coleta": [
  
        ],
        "id": "000001"
      },
      {
        "coleta": [
  
        ],
        "id": "000006"
      }
    ]
  */
  useEffect(() => {
    //buscar linhas da base local
    function pupularColeta() {
      coletaTemp = [];
      linhas.map((linha) => {
        console.log(linha);
        coletaTemp.push({
          id: linha,
          coleta: []
        });
      })
      save_coleta(coletaTemp);
    }

    async function buscarLinhas() {


      const realm = await getRealm();
      const results = realm
        .objects('Tanque')
        .filtered(`TRUEPREDICATE SORT(LINHA ASC) DISTINCT(LINHA)`);

      results.addListener((results) => {

        if (results.length > 0) {
          setLinhas(results);
          setLoading(false);
        }
      });
    }

    buscarLinhas();

    //executa somente uma vez
    if (coleta.length == 0) {

      pupularColeta();
    }

    //adiconando configurações do header

    navigation.setOptions({ title: 'Realizar Coleta' });
    navigation.setOptions({
      headerLeft: () => (
        <Button
          transparent
          onPress={() => navigation.toggleDrawer()}>
          <FontAwesomeIcon icon="bars" color="white" size={25} style={{ marginLeft: 10 }} />
        </Button>
      ),
    });
    navigation.setOptions({
      headerRight: () => (
        <View></View>
      ),
    });
  }, [loading])

  async function selecionarLinha(cod_linha) {
    coleta.map((coletaItem) => {
      if (coletaItem.id == cod_linha) {
        id = coleta.indexOf(coletaItem);
        save_linhaID(id);
        AsyncStorage.setItem('@idlinha', JSON.stringify(id));
      }
    })

    const hora = time();
    const data = date();
    await AsyncStorage.setItem('@linha', cod_linha);
    save_linha(cod_linha);
    adicionar_horaI(hora);
    await AsyncStorage.setItem('@horaI', hora);
    await AsyncStorage.setItem('@data', data);
    adicionar_data(data);
    //await AsyncStorage.setItem('@finalizado', '1');
    //transmitir_coleta('1');
    navigation.navigate('Coleta');
  }

  //renderiza item da lista
  function renderLinha(linha) {
    return (
      <TouchableOpacity onPress={() => selecionarLinha(linha.LINHA)}>
        <View style={styles.viewItemLinha}>
          <Text allowFontScaling={false} style={styles.textCod}>
            {linha.LINHA}
          </Text>
          <Text allowFontScaling={false} style={styles.textNome}>
            {linha.descricao}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.viewMain}>

      {linhasRender.length > 0 ? (
        < View style={styles.viewMain}>
          <Text allowFontScaling={false} style={styles.textTitulo}>Selecione a linha</Text>
          <FlatList
            data={linhasRender}
            keyExtractor={item => item.id}
            renderItem={({ item }) => renderLinha(item)}
          />
        </View>
      ) : (
          <ActivityIndicator size="large" color="green" />
        )
      }
    </View >
  );
}

const mapStateToProps = state => ({
  imei: state.Identificacao.imei,
  cod_linha: state.Coleta.cod_linha,
  coleta: state.Coleta.coleta,
  linhas: state.Coleta.linhas
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionsColeta, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Linha);


