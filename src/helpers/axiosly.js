import axios from 'axios';
import { firebaseConfigParams } from "../config";

const axio = axios.create({
    baseURL: firebaseConfigParams.appDomain,
  timeout: 999999,//10000,
});

axio.interceptors.request.use((config) => {
    const customConfig = config;
    if (localStorage.getItem('jumgaJWToken')) {
      let webToken = JSON.parse(localStorage.getItem('jumgaJWToken'));
      if (new Date(webToken.date) >= Date.now()) {
        customConfig.headers.Authorization = webToken.bearer;
      }
    }
    return customConfig;
  });

export default axio;