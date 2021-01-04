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
import CONSTANTS from "../App.constant";

class PaymentContainer extends Container {

    constructor() {
        super();
        this.state = {}        
    }

    initiatePayment = async (paymentDetails) => {
        try {
            const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.PROCESSPAYMENT);
            const response = await callable(paymentDetails);
            console.log(response);
            return response;
        } catch(e) {
            console.log(e);
        }
    }

}

export { PaymentContainer }