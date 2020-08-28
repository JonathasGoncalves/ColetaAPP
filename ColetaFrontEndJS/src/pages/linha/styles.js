import { StyleSheet } from 'react-native';

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
    marginLeft: 10,
    marginTop: 2,
    backgroundColor: 'white'
  },
  buttonContinuar: {
    width: 200,
    backgroundColor: '#F9690E',
    alignSelf: 'center'
  }
});

export default styles;
