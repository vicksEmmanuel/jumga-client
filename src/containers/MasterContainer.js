import _ from "lodash";
import firebase from "firebase/app";
import { v4 as uuidv4 } from 'uuid';

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import "firebase/remote-config";

import { Container } from "unstated";
import instance from '../helpers/axiosly';
import CONSTANTS from "../App.constant";

class MasterContainer extends Container {

    constructor() {
        super();
        this.state = {
            categories: [],
            remoteConfigs: {
                store_cost: 20,
                currency: '$',
                // facebook_url: 'https://www.facebook.com/jumga',
                // instagram_url: 'https://www.instagram.com/jumga/?hl=en',
                // contact_email1: 'info@jumga.com',
                // contact_phone_no: '+234 807 443 4878',
                // terms_of_service_url:  'https://www.termsfeed.com/terms-conditions-generator',
                // privacy_policy_url: 'https://jumga.com/pages/privacy-policy'
            }
        }

        this.asyncgetAllRemoteConfigs();
        
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
        console.log(config)
        this.setState({
            ...this.state,
            remoteConfigs: config.remoteConfigs
        }, () => {
        console.log(this.state);
        });
        return config;
    }

    getAllCategories = async () => {
        const categoriesCollection = CONSTANTS.SCHEMA.CATEGORIES;
        const categoriesDetailsRef = firebase.firestore().collection(categoriesCollection);
        const snapshot = await categoriesDetailsRef.get();
        let cat = [];
        snapshot.forEach(doc => {
            console.log(doc.data());
            cat[doc.id] = doc.data();
        });

        this.setState({
            categories: cat
        });
    }
}

export { MasterContainer }