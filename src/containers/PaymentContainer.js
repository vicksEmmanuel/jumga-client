import * as _ from "lodash";
import firebase from "firebase/app";
import { v4 as uuidv4 } from 'uuid';

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import "firebase/remote-config";

import { Container } from "unstated";
import CONSTANTS from "../App.constant";
import axios from 'axios';
import { firebaseConfigParams } from '../config';
import { get } from "lodash";

class PaymentContainer extends Container {

    constructor() {
        super();
        this.state = {
            currency: {
                pricePerDollar: 1,
                code: 'USD',
                store_cost: null,
                isLoading: true
            },
        }    
        this.setCurrency();    
    }

    setCurrency = async () => {
        const remoteConfigs = await this.asyncgetAllRemoteConfigs();
        const {
            store_cost,
            currency,
            currencyPricePerDollar,
        } = await this.convertToLocalCurrency(remoteConfigs?.store_cost, remoteConfigs?.currency);

        this.setState({
            currency: {
                pricePerDollar: currencyPricePerDollar,
                code: currency,
                store_cost,
                isLaoding: false
            }
        });

    }

    getAllRemoteConfigs = async (state) => {
    
        try {
          firebase.remoteConfig().defaultConfig = ({
            ...state.remoteConfigs
          });
          await firebase.remoteConfig().fetchAndActivate();
          // console.log("remoteConfig activated == ", activated);
          let jsonRemoteConfig = firebase.remoteConfig().getAll();
    
          if (!_.isEmpty(jsonRemoteConfig)) {
    
            let updatedState = {...state};
    
            let remoteConfig = {};
            
            Object.entries(jsonRemoteConfig).forEach(($) => {
              
              const [key, entry] = $;
              remoteConfig[key] = entry._value;
             
            });
    
            updatedState.remoteConfigs = remoteConfig;
    
            return updatedState;
          }
        } 
        catch (error) {
          console.log(`fetching values for remoteConfig produced an error == `, error);
          return state.remoteConfig;
        }
    }  

    asyncgetAllRemoteConfigs = async () => {
        let config = await this.getAllRemoteConfigs(this.state);
        // this.setState({
        //     ...this.state,
        //     remoteConfigs: config.remoteConfigs,
        //     remoteConfigLoading: false
        // }, () => {
            
        // });
        return config.remoteConfigs;
    }

    initiatePayment = async (paymentDetails) => {
        try {
            const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.PROCESSPAYMENT);
            const response = await callable(paymentDetails);
            return response.data;
        } catch(e) {
            console.log(e);
        }
    }

    formatToIntCurrency = (value) => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.state.currency?.code,
            minimumFractionDigits: 2
        });

        return formatter.format(Number(value) * this.state.currency?.pricePerDollar);
    }

    convertToLocalCurrency = async (price, currency) => {
        try {
            if (_.isNull(currency) || _.isNull(price)) return;
            let ip = await axios.get(firebaseConfigParams.geolocationIpRoute);
            let result = await axios.get(`${firebaseConfigParams.geolocationRoute}&ip=${ip.data.ip}`);
            // if (result.data?.status === 'success') {
                
            // }
            let newCurrency = result.data?.currency?.code;
            if (newCurrency === currency) {
                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: newCurrency,
                    minimumFractionDigits: 2
                });

                return {
                    store_cost: formatter.format(price),
                    currency: newCurrency,
                    currencyPricePerDollar: 1,
                };
            }
            let newExchange = await axios.get(`https://free.currconv.com/api/v7/convert?q=${currency}_${newCurrency}&compact=ultra&apiKey=${firebaseConfigParams.currencyExchangeApiKey}`);
            if(_.isEmpty(newExchange.data)) throw new Error('Something went wrong with currency exchange');
            let x = Object.keys(newExchange.data).map(i => {
                return newExchange.data[i];
            });
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: newCurrency,
                minimumFractionDigits: 2
            });

            return {
                store_cost: formatter.format(x[0] * price),
                currency: newCurrency,
                currencyPricePerDollar: x[0]
            };
            // throw new Error(`${result.data?.status} ${result.data?.message}`);
        } catch(err) {
            throw new Error(err);
        }
    }

}

export { PaymentContainer }