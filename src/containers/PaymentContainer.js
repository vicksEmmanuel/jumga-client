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

class PaymentContainer extends Container {

    constructor() {
        super();
        this.state = {}        
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

    convertToLocalCurrency = async (price, currency) => {
        try {
            if (_.isNull(currency) || _.isNull(price)) return;
            let result = await axios.get(firebaseConfigParams.geolocationRoute);
            if (result.data?.status === 'success') {
                let newCurrency = result.data?.currency;
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
            }
            throw new Error(`${result.data?.status} ${result.data?.message}`);
        } catch(err) {
            throw new Error(err);
        }
    }

}

export { PaymentContainer }