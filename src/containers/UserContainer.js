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

    uploadImage = async (image, callback) => {
       try {
        if (!String(image?.type).includes("image")) {
            return;
        }
        var storageRef = firebase.storage().ref();
        let ref = storageRef.child(uuidv4());
        ref.put(image).then(snaps => {
            callback(snaps);
        });
       } catch(e) {
           this._handleError(e);
       }
    }

    signUp = async ({
        email,
        password,
        username,
        userType,
        downloadURL,
        approved = false,
        createdAt = Date.now(),
        paymentDates = []
    }, checkError = () => {}) => {
        try {
            let auth = firebase.auth();
            await auth.createUserWithEmailAndPassword(email, password);
            const userCollection = CONSTANTS.SCHEMA.USER;
            const userDetailsRef = firebase.firestore().doc(`${userCollection}/${email}`);
            await userDetailsRef.set({
                email,
                store: [username],
                userType,
                downloadURL,
                approved,
                createdAt,
                paymentDates
            });

            this.signIn({email, password});
        } catch(err) {
            console.log(err);
            checkError(err?.message);
        }
    }

    getUser = () => {
        let user = localStorage.getItem(CONSTANTS.SESSIONSTORE);
        if (user) {
            user = JSON.parse(user);
            return user.data;
        } 
        return {}
    }

    checkIfStoreNameExists = async (storename) => {
        let db = this.firebase.firestore();
        const user = db.collection(CONSTANTS.SCHEMA.USER);
        const query = user.where("store", 'array-contains', storename);
        const docs = await query.get();
        if (docs.empty) {
            return {
                status: false,
            }
        }

        return {
            status: true,
            recommendation: `${storename}${String(uuidv4()).substring(0, Math.random(3, 10))}`
        }
    }

    checkIfEmailExists = async (email) => {
        let db = this.firebase.firestore();
        const user = db.collection(CONSTANTS.SCHEMA.USER);
        const query = user.where("email", '==', email);
        const docs = await query.get();
        if (docs.empty) {
            return {
                status: false,
            }
        }

        return {
            status: true,
        }
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

    getUserDataFromFirebase = async () => {
        console.log("ehre");
        const auth = firebase.auth();
        const user = await auth.currentUser;

        if (user) {
            const userCollection = CONSTANTS.SCHEMA.USER;
            const userDetailsRef = firebase.firestore().doc(`${userCollection}/${user.email}`);
            const userDoc = await userDetailsRef.get();
            if(userDoc.exists) {
                await this.setState({
                    user: userDoc.data()
                });
            }
        }
    }

    signIn = async ({
        email,
        password
    }) => {
        try {
            let auth = firebase.auth();
            await auth.signInWithEmailAndPassword(email, password);
            await this.getUserDataFromFirebase();
            return {
                status: true
            }
        } catch(err) {
            return {
                status: false,
                message: err?.message
            }
        }
    }

}

export { UserContainer }