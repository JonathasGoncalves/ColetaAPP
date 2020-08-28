import React from 'react';
import Imei from '../pages/Imei/index';
import { createStackNavigator } from '@react-navigation/stack'
import { RootStackParamList } from './types'
import linha from '../pages/linha/index';


const RootStack = createStackNavigator<RootStackParamList>();

export const InitialRoute: React.FC = () => (
  <RootStack.Navigator initialRouteName="Imei">
    <RootStack.Screen name="Imei" component={Imei} />
    <RootStack.Screen
      name="Linha"
      component={linha}
    />
  </RootStack.Navigator>
);


