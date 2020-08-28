import axios from 'axios';

const api = axios.create({
  baseURL: 'http://apicoletaleite.selita.coop.br/',
  //baseURL: 'http://192.168.1.36:8000/',
  timeout: 10000,
});

export default api;