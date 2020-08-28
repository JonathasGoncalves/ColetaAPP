import React from 'react';
import Cadastro from '../pages/indentificacao/cadastro/index';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
function IDAPP() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
        options={{
          title: 'Cadastro',
          headerStyle: {
            backgroundColor: '#F9690E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default IDAPP;