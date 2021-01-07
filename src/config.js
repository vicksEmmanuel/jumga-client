
export const ENV = process.env.NODE_ENV;
const isStaging = (ENV.toLowerCase() === 'development')

export const firebaseConfigParams = {
  appDomain: "http://localhost:3000/",
  apiKey: (isStaging) ? process.env.REACT_APP_APIKEY_STAGING : process.env.REACT_APP_APIKEY_PROD,
  authDomain: (isStaging) ? process.env.REACT_APP_AUTHDOMAIN_STAGING : process.env.REACT_APP_AUTHDOMAIN_PROD,
  databaseURL: (isStaging) ? process.env.REACT_APP_DATABASEURL_STAGING : process.env.REACT_APP_DATABASEURL_PROD,
  projectId: (isStaging) ? process.env.REACT_APP_PROJECTID_STAGING: process.env.REACT_APP_PROJECTID_PROD,
  storageBucket: (isStaging) ? process.env.REACT_APP_STORAGEBUCKET_STAGING : process.env.REACT_APP_STORAGEBUCKET_PROD,
  messagingSenderId: (isStaging) ? process.env.REACT_APP_MESSAGINGSENDERID_STAGING : process.env.REACT_APP_MESSAGINGSENDERID_PROD,
  appId: (isStaging) ? process.env.REACT_APP_APPID_STAGING : process.env.REACT_APP_APPID_PROD,
  flwPubKey: (isStaging) ? process.env.REACT_APP_FLUTTERWAVEPUBKEY_STAGING : process.env.REACT_APP_FLUTTERWAVEPUBKEY_PROD,
  flwSecretKey: (isStaging) ? process.env.REACT_APP_FLUTTERWAVESECRETKEY_STAGING : process.env.REACT_APP_FLUTTERWAVESECRETKEY_PROD,
  storePaymentPlanID: (isStaging) ? parseInt(process.env.REACT_APP_STORE_PAYMENT_PLAN_ID_STAGING) : parseInt(process.env.REACT_APP_STORE_PAYMENT_PLAN_ID_PROD),
  // geolocationRoute: 'http://api.ipstack.com/41.190.2.56?access_key=881adef0d0649ce8981bbab9feb172c9',
  // geolocationRoute: 'http://ipwhois.app/json',
  // geolocationRoute: 'http://ip-api.com/json?fields=status,country,currency,message',
  geolocationRoute: 'https://api.ipgeolocation.io/ipgeo?apiKey=d0124bc29ad4449b9d4d318fffbe9071',
  geolocationIpRoute: 'https://api.ipgeolocation.io/getip',
  currencyExchangeApiKey: '3f2fafa7fca1c5b86d68'
}