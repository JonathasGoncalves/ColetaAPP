
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { InitialRoute } from './../src/routes/index';
import { NavigationContainer } from '@react-navigation/native';

//aqui vou chamar os route files
export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <InitialRoute />
      </Provider>
    </NavigationContainer>

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
