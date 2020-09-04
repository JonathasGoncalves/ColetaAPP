import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
  textDescPlaca: {
    fontSize: 20,
    color: 'black',
    alignSelf: 'center',
    fontWeight: "bold",
    ///padding: 10,
    //textAlign: "center",
    //marginTop: 20
  },
  textButtonContinuar: {
    fontSize: 20,
    color: 'white',
    fontWeight: "bold",
  },
  inputPlaca: {
    //flex: 1,
    borderWidth: 1,
    height: 40,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
    textAlign: 'center'
  },
  viewItemTransp: {
    //flex: 1,
    borderRadius: 5,
    borderColor: 'gray',
    flexDirection: 'row',
    borderBottomWidth: 1,
    justifyContent: 'space-around',
    //height: 50,
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
  },
  buttonContinuarPress: {
    width: 200,
    backgroundColor: '#F9690E',
    alignSelf: 'center',
    opacity: 0.5
  }

});

export default styles;
