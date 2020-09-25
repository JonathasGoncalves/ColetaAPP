import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from '../src/routes/index';
import store from './store/store';
import { Provider } from 'react-redux';
import * as Updates from 'expo-updates';
import { ActivityIndicator, Text, Alert, View, StyleSheet } from 'react-native';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faCheckSquare, faCoffee, faBars, faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-community/async-storage';
/*
Conta de update:
Servicos.ti@selita.coop.br
*/
function App() {

  const [updateController, setUpdateController] = useState(true);

  useEffect(() => {
    //adicionando icones globalmente
    try {
      library.add(fab, faCheckSquare, faCoffee, faBars, faArrowLeft, faTrash);
    } catch (error) {
      console.log(error);
    }

    async function updateAPP() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          const updateEnd = await Updates.fetchUpdateAsync();
          setUpdateController(false);
          await Updates.reloadAsync();
        } else {
          setUpdateController(false);
        }
      } catch (e) {
        Alert.alert(
          'Erro',
          `Erro ${e}`,
          [
            { text: 'OK' },
          ]
        );
        setUpdateController(false);
      }
    }
    updateAPP();
  }, [])

  const MyTheme = {
    colors: {
      primary: 'white',
      background: 'white'
    },
  };

  return (
    <Provider store={store}>
      <NavigationContainer theme={MyTheme}>
        {updateController ? (
          <View style={styles.container}>
            <ActivityIndicator size='large' color='green' />
            <Text allowFontScaling={false} allowFontScaling={false} >Atualizando versão do APP...</Text>
          </View>
        ) : (
            <Routes />
          )
        }
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

