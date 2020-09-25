
import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const styles = StyleSheet.create({
  viewItemLinha: {
    borderRadius: 5,
    borderColor: 'gray',
    flexDirection: 'row',
    borderBottomWidth: 0,
    alignItems: "center",
    marginBottom: 2,
    marginTop: 2,
    minHeight: 70
  },
  viewItemLinhaFlex: {
    borderRadius: 5,
    borderColor: 'gray',
    flexDirection: 'row',
    borderBottomWidth: 0,
    alignItems: "center",
    marginBottom: 2,
    marginTop: 2,
    minHeight: 70,
    //width: (Dimensions.get("window").width) * 0.8,
  },
  viewItemLatao: {
    borderRadius: 5,
    borderColor: 'gray',
    flexDirection: 'row',
    borderBottomWidth: 0,
    alignItems: "center",
    marginBottom: 2,
    marginTop: 2,
    minHeight: 70,
    marginLeft: 20
  },
  textTituloFinalizar: {
    flex: 1,
    fontSize: 20,
    color: 'black',
    fontWeight: "bold",
    padding: 10,
    borderRightWidth: 1,
  },
  textvalorFinal: {
    flex: 1,
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    alignSelf: 'center',
  },
  textCod: {
    //flex: 1,
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    alignSelf: 'center'
  },
  ViewTotalFinalizar: {
    width: (Dimensions.get("window").width) * 0.9,
    //position: 'absolute'
    //backgroundColor: 'red',
    alignItems: 'center'
  },
  textLabel: {
    //flex: 1,
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    fontWeight: "bold",
    alignSelf: 'center'
  },
  textLatao: {
    //flex: 1,
    fontSize: 18,
    color: 'black',
    marginLeft: 40,
  },
  textNome: {
    //flex: 1,
    fontSize: 18,
    color: 'black',
    marginLeft: 60,
    marginRight: 15
  },
  textNomeVolumeFora: {
    fontSize: 18,
    color: 'red',
    marginLeft: 60,
    marginRight: 15
  },
  viewMain: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 2,
    backgroundColor: 'white',
  },
  viewMainFlatList: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 2,
    backgroundColor: 'white',
    //height: (Dimensions.get("window").height) * 0.8,
  },
  viewTotalColetado: {
    backgroundColor: '#e5e8e8',
    //marginLeft: 10,
    marginTop: 10,
    //alignSelf: 'center',
    alignItems: 'center',
    //height: Dimensions.get("window").height * 0.2,
    height: 80,
    width: Dimensions.get("window").width * 0.5,
  },
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
  ViewFlatList: {
    width: Dimensions.get("window").width * 0.9,
    marginTop: 20
  },
  textTituloGeral: {
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    //marginRight: 10,
    // marginLeft: 10,
    //marginBottom: 10,
    marginTop: 20,
    textAlign: "center"
  },
  textTituloGeralFinalizar: {
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    //marginRight: 10,
    // marginLeft: 10,
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center"
  },
  ViewItemList1: {
    //flexDirection: 'row',
    borderWidth: 1,
  },
  viewItemLinhaFinalizar: {
    //borderRadius: 5,
    //borderColor: 'gray',
    //flexDirection: 'column',
    borderBottomWidth: 0,
    //alignItems: "center",
    //marginBottom: 2,
    //marginTop: 2,
    minHeight: 70
  },
  ViewItemList: {
    //flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1
  },
  textButtonContinuar: {
    fontSize: 20,
    color: 'white',
    fontWeight: "bold",
  },
  textButtonFinalizar: {
    fontSize: 30,
    color: 'white',
    fontWeight: "bold",
  },
  inputPlaca: {
    //flex: 1,
    borderWidth: 1,
    minHeight: 40,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
    textAlign: 'center'
  },
  buttonContinuar: {
    width: 200,
    backgroundColor: '#F9690E',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20
  },
  buttonContinuarPress: {
    width: 200,
    backgroundColor: '#F9690E',
    alignSelf: 'center',
    opacity: 0.5,
    marginBottom: 10,
    marginTop: 20
  },
  buttonTransmitir: {
    width: (Dimensions.get("window").width) * 1,
    backgroundColor: '#F9690E',
    height: (Dimensions.get("window").height) * 0.1
  },
  buttonTransmitirPress: {
    width: (Dimensions.get("window").width) * 1,
    backgroundColor: '#F9690E',
    height: (Dimensions.get("window").height) * 0.1,
    opacity: 0.5,
  },
  buttonFinalizar: {
    width: 250,
    height: 70,
    backgroundColor: '#F9690E',
    alignSelf: 'center',
    position: "absolute",
    marginTop: '150%'
  },
  ViewButton: {
    //marginTop: '100%',
    //position: 'absolute'
    alignItems: 'center',
    //alignContent: 'flex-start',
  },
  ViewInfo: {
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'flex-start'
  },
  textDescPlaca: {
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    //marginRight: 10,
    // marginLeft: 10,
    //marginBottom: 10,
    padding: 10,
    textAlign: "center",
    marginTop: 20,
    bottom: 50
  },
  textDescOdometro: {
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    //marginRight: 10,
    // marginLeft: 10,
    //marginBottom: 10,
    padding: 10,
    textAlign: "center",
    marginTop: 20,
    width: (Dimensions.get("window").width) * 0.8,
  },
  ViewColetaInfo: {
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'flex-start',
    width: (Dimensions.get("window").width) * 0.905,
    marginTop: 30
  },
  itemColetaInfo: {
    width: (Dimensions.get("window").width) * 0.5,
    fontSize: 20,
    color: 'black',
    fontWeight: "bold",
    padding: 10,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 0
  },
  itemColetaInfoLast: {
    width: (Dimensions.get("window").width) * 0.5,
    fontSize: 20,
    color: 'black',
    fontWeight: "bold",
    padding: 10,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    borderLeftWidth: 0
  },
  itemColetaResp: {
    flex: 1,
    width: (Dimensions.get("window").width) * 0.4,
    fontSize: 20,
    color: 'black',
    //fontWeight: "bold",
    padding: 10,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0
  },
  itemColetaRespLast: {
    flex: 1,
    width: (Dimensions.get("window").width) * 0.4,
    fontSize: 20,
    color: 'black',
    //fontWeight: "bold",
    padding: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0
  },
  textInfoColeta: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  },
  ValueInfoColeta: {
    marginLeft: 10,
    marginTop: 5,
    fontSize: 16,
    color: 'black'
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

