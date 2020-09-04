import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const styles = StyleSheet.create({

  textTitulo: {
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    //marginRight: 10,
    // marginLeft: 10,
    //marginBottom: 10,
    padding: 10,
    textAlign: "center"
  },
  viewMainFlatList: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 2,
    backgroundColor: 'white',
    height: (Dimensions.get("window").height) * 0.8,
  },
  textButtonContinuar: {
    fontSize: 20,
    color: 'white',
    fontWeight: "bold",
  },
  textCod: {
    //flex: 1,
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
  },
  textNome: {
    flex: 1,
    fontSize: 18,
    color: 'black',
    marginLeft: 20,
    marginRight: 15
  },
  viewItemLinha: {
    //flex: 1,
    borderRadius: 5,
    borderColor: 'gray',
    flexDirection: 'row',
    borderBottomWidth: 1,
    //justifyContent: 'space-between',
    //height: 150,
    alignItems: "center",
    marginBottom: 2,
    marginTop: 2,
    minHeight: 70,
    //marginRight: 10,
    //marginLeft: 10
  },
  viewMain: {
    marginRight: 10,
    //marginLeft: 10,
    marginTop: 2,
    backgroundColor: 'white'
  },
  buttonContinuar: {
    width: 200,
    backgroundColor: '#F9690E',
    alignSelf: 'center'
  },
  viewTotalColetado: {
    backgroundColor: '#e5e8e8',
    //marginLeft: 10,
    marginTop: 10,
    //alignSelf: 'center',
    alignItems: 'center',
    height: Dimensions.get("window").height * 0.2,
    width: Dimensions.get("window").width * 0.5,
  },
  ValueTotalColetado: {
    //marginLeft: 10,
    marginTop: 5,
    fontSize: 18,
    color: 'black'
  },
  textTotalColetado: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  },
});

export default styles;
