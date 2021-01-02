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
                this.getUserDataFromFirebase();
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

    checkIfUserHasPaid = async (email) => {
        return false;
    }

    uploadImage = async (image, callback = async () => {}) => {
       try {
        if (!String(image?.type).includes("image")) {
            return;
        }
        var storageRef = firebase.storage().ref();
        let ref = storageRef.child(uuidv4());
        let uploadTask = ref.put(image);
        uploadTask.on('state_changed', function(snapshot){
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
          }, function(error) {
            // Handle unsuccessful uploads
          }, function() {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              console.log('File available at', downloadURL);
              callback(downloadURL);
            });
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
        approved = true,
        createdAt = Date.now(),
        paymentDates = [],
        stores = []
    }, checkError = () => {}) => {
        try {
            let auth = firebase.auth();
            await auth.createUserWithEmailAndPassword(email, password);
            const userCollection = CONSTANTS.SCHEMA.USER;
            const userDetailsRef = firebase.firestore().doc(`${userCollection}/${email}`);
            await userDetailsRef.set({
                email,
                username,
                stores,
                userType,
                downloadURL,
                approved,
                createdAt,
                paymentDates
            });

            await this.signIn({email, password});
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
            props.history.push("/store/login");
        } catch(err) {
            this._handleError(err);
        }
    }

    getUserDataFromFirebase = async () => {
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