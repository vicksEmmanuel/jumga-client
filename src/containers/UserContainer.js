import _ from "lodash";
import firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/remote-config";

import { Container } from "unstated";
import instance from '../helpers/axiosly';
import CONSTANTS from "../App.constant";

class UserContainer extends Container {
    
    constructor(firebaseConfig) {
        super();
        this.state = {
            user: null
        }

        if (firebaseConfig) {
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
            firebase.auth().onAuthStateChanged(user => {
              if (user) {
                localStorage.setItem(CONSTANTS.SESSIONSTORE, JSON.stringify(user));
              } else {
                localStorage.removeItem(CONSTANTS.SESSIONSTORE);
              }
            });
            this.firebase = firebase;
        }
    }

    _handleError(error) {
        let errorMessage = error.message;
        console.log(errorMessage);
        return errorMessage;
    }

    goBack = (props) => {
        props.history.goBack();
    }

    getUser = () => {
        let user = localStorage.getItem(CONSTANTS.SESSIONSTORE);
        if (user) {
            user = JSON.parse(user);
            return user.data;
        } 
        return {}
    }

    logOut = async (props) => {
        try {
            let user = await firebase.auth().signOut();
            localStorage.removeItem(CONSTANTS.SESSIONBEARER);
            localStorage.removeItem(CONSTANTS.SESSIONSTORE);
            props.history.push("/login");
        } catch(err) {
            this._handleError(err);
        }
    }

    signIn = (values, change = () => {}, props ) => {
        instance.post(`admin/auth/signin`,values).then(data => {
            if (!data.data.isSuccess) {
                change();
                return;
            }
    
            if (String(data.data.data.userType).toLocaleLowerCase() != 'admin')  {
                change();
                return;
            }
    
            localStorage.setItem(CONSTANTS.SESSIONSTORE, JSON.stringify(data.data));
            localStorage.setItem(CONSTANTS.SESSIONBEARER, JSON.stringify({
                bearer : `Bearer ${data.data.message}`,
                date: new Date(data.data.expirationDate)
            }));
    
            props.history.push("/home");
        }).catch(e => {
           change();
        })
    }

}

export { UserContainer }