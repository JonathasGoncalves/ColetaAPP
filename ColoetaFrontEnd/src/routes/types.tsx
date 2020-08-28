import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Imei: undefined;
  Linha: undefined;
};

export type ImeiScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Imei'
>;

export type ImeiScreenRouteProp = RouteProp<RootStackParamList, 'Imei'>;

export type Props = {
  navigation: ImeiScreenNavigationProp;
  route: ImeiScreenRouteProp;
};