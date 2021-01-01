
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
}