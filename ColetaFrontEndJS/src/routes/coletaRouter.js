import React, { useEffect, useState } from 'react';
import { Button, TouchableOpacity, View, Icon } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Linha from '../pages/linha';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Coleta from '../pages/coleta/index';
import TanqueColeta from '../pages/coleta/tanqueColeta';
import LataoColeta from '../pages/coleta/lataoColeta';
import LataoList from '../pages/coleta/lataoList';
import Finalizar from '../pages/coleta/finalizarColeta';
import { connect } from 'react-redux';
import * as actionsIMEI from '../store/actions/imeiActions';
import * as actionsColeta from '../store/actions/coletaActions';
import { bindActionCreators } from 'redux'
import AsyncStorage from '@react-native-community/async-storage';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


function ColetaStack() {
  return (
    <Stack.Navigator initialRouteName={"Coleta"} screenOptions={{ headerShown: true }}>
      <Stack.Screen
        options={{
          title: 'Coleta',
          unmountOnBlur: true,
          headerStyle: {
            backgroundColor: '#F9690E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center',
          },
          cardStyle: {
            backgroundColor: 'white'
          }
        }}
        name="Coleta"
        component={Coleta}
      />
      <Stack.Screen
        options={{
          title: 'Coletar Tanque',
          unmountOnBlur: true,
          headerStyle: {
            backgroundColor: '#F9690E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center',
          },
          cardStyle: {
            backgroundColor: 'white'
          }
        }}
        name="Tanque"
        component={TanqueColeta}
      />
      <Stack.Screen
        options={{
          title: 'Coletar Latão',
          unmountOnBlur: true,
          headerStyle: {
            backgroundColor: '#F9690E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center',
          },
          cardStyle: {
            backgroundColor: 'white'
          }
        }}
        name="Latao"
        component={LataoColeta}
      />
      <Stack.Screen
        options={{
          title: 'Coletar Latão',
          unmountOnBlur: true,
          headerStyle: {
            backgroundColor: '#F9690E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center',
          },
          cardStyle: {
            backgroundColor: 'white'
          }
        }}
        name="LataoList"
        component={LataoList}
      />
    </Stack.Navigator>
  );
}

function LinhaStack() {
  return (
    <Stack.Navigator initialRouteName={"Linha"} screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="Linha"
        component={Linha}
        mode='modal'
        options={{
          title: 'Coleta',
          unmountOnBlur: true,
          headerStyle: {
            backgroundColor: '#F9690E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center',
          },
          cardStyle: {
            backgroundColor: 'white'
          }
        }}
      />
    </Stack.Navigator>
  );
}


function AppLinha() {

  return (
    <Stack.Navigator initialRouteName={"Linha"} screenOptions={{ headerShown: false }}>
      <Stack.Screen
        options={{
          title: 'Coleta',
          unmountOnBlur: true,
          headerStyle: {
            backgroundColor: '#F9690E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center',
          },
          cardStyle: {
            backgroundColor: 'white'
          }
        }}
        name="Coleta"
        component={ColetaStack}
      />
      <Stack.Screen
        options={{
          title: 'Coletar Tanque',
          unmountOnBlur: true,
          headerStyle: {
            backgroundColor: '#F9690E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center',
          },
          cardStyle: {
            backgroundColor: 'white'
          }
        }}
        name="Linha"
        component={LinhaStack}
      />
    </Stack.Navigator>
  )
}

function FinalizarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        options={{
          title: 'Coletar Tanque',
          unmountOnBlur: true,
          headerStyle: {
            backgroundColor: '#F9690E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            alignSelf: 'center',
          },
          cardStyle: {
            backgroundColor: 'white'
          }
        }}
        name="Latao"
        component={Finalizar}
      />
    </Stack.Navigator>
  );
}

function MAIN() {
  return (
    <Drawer.Navigator
      initialRouteName={'Coletar'}
      options={{
        unmountOnBlur: true,
      }}
      drawerStyle={{
        backgroundColor: 'white',
        width: '50%'
      }}
      drawerContentOptions={{
        activeTintColor: '#F9690E',
        labelStyle: { fontSize: 18 }
      }}
    >
      <Drawer.Screen
        options={{
          unmountOnBlur: true,
        }}
        name="Coletar"
        component={AppLinha}
      />
      <Drawer.Screen
        options={{
          unmountOnBlur: true,
        }}
        name="Finalizar"
        component={FinalizarStack}
      />
    </Drawer.Navigator>
  );
}

const mapStateToProps = state => ({
  transmitir: state.Coleta.transmitir,
  coleta: state.Coleta.coleta,
  cod_linha: state.Coleta.coleta
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...actionsIMEI, ...actionsColeta }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MAIN);