import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const api = axios.create({
  baseURL: 'http://apicoletaleite.selita.coop.br/',
  //baseURL: 'http://192.168.1.36:8000/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  async function (config) {
    const access_token = await AsyncStorage.getItem('@access_token');
    console.log(config);
    //const token = access_token;
    if (access_token) config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;