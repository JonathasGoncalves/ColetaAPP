import React from 'react';
import { View, Text, Button } from 'react-native';

import { connect, ConnectedProps } from 'react-redux'

interface IMEIState {
  imei: string
}

const mapState = (state: IMEIState) => ({
  imei: state.imei
})

const mapDispatch = {
  ImeiOK: () => ({ type: 'IMEI_IS_OK' })
}

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux;

function Linha(props: Props) {
  console.log(props.imei);
  return (
    <View>
      <Text>props.imei</Text>
    </View>
  );
}

export default connector(Linha);