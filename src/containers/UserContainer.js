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
import axios from 'axios';
import CONSTANTS from "../App.constant";
import { firebaseConfigParams } from '../config';


class UserContainer extends Container {
    
    constructor(firebaseConfig) {
        super();
        this.state = {
            user: null,
            stores: [],
            storeLoaded: false,
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

    uploadImage = (image, getTransferRate = () => {}) => {
        return new Promise((resolve, reject) => {
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
                    getTransferRate('Upload is ' + progress + '% done');
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
                    reject();
                  }, function() {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                      console.log('File available at', downloadURL);
                      resolve(downloadURL);
                    });
                  });
               } catch(e) {
                   this._handleError(e);
               }
        });
    }

    createProduct = async ({
        images = [],
        productname,
        manufacturename,
        manufacturebrand,
        pastprice,
        currentprice,
        productdesc,
        metaname,
        metakeywords,
        metadescription,
        categories,
        storeId,
    }) => {
        try {

            const productCollection = CONSTANTS.SCHEMA.PRODUCTS;
            const id = `${storeId}${uuidv4()}`;
            const productRef = firebase.firestore().doc(`${productCollection}/${id}`);
            await productRef.set({
                images,
                productname,
                manufacturename,
                manufacturebrand,
                pastprice,
                currentprice,
                productdesc,
                metaname,
                metakeywords,
                metadescription,
                categories,
                storeId,
                starRating: 0,
                reviews: [],
                createdAt: Date.now()
            });
            return id;

        } catch(e) {
            throw new Error(e);
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

    getUserStore = async (callback = () => {}) => {
        const storeCollection = CONSTANTS.SCHEMA.STORES;
        const storeDetailsRef = firebase.firestore().collection(storeCollection);
        const query = storeDetailsRef.where('userEmail', '==', this.state.user.email);
        const docs = await query.get();

        if (docs.empty) return null;

        let x = [];

        docs.forEach(doc => {
            const store = doc.data();
            x.push(store);
        });

        this.setState({
            stores: x,
            storeLoaded: true
        }, callback);

        return x;
    }

    checkifApproved = (storeId) => {
        let checkApproval = this.state.stores.filter(item => {
            return item.storeId == storeId && item.approved == true
        });

        if (checkApproval.length > 0) return true;
        return false;
    }

    createStore = async ({
        store,
        categories = [],
        storeId,
        paymentDates = [],
        approved = false,
        userEmail,
        dispatchRiders = null,
        createdDate = Date.now(),
        dateVisited = Date.now(),
    }, props) => {
        const storeCollection = CONSTANTS.SCHEMA.STORES;
        const userCollection = CONSTANTS.SCHEMA.USER;
        const storeDetailsRef = firebase.firestore().doc(`${storeCollection}/${storeId}`);
        const userDetailsRef = firebase.firestore().doc(`${userCollection}/${userEmail}`);
        const userData = await userDetailsRef.get();
        const storeData = await storeDetailsRef.get();
        if (storeData.exists) {
            storeId = `${storeId}${Date.now()}`;
        }

        let ip = await axios.get(firebaseConfigParams.geolocationIpRoute);
        let result = await axios.get(`${firebaseConfigParams.geolocationRoute}&ip=${ip.data.ip}`);
        let state = result.data?.state_prov;
        let country = result.data?.country_name;

        await storeDetailsRef.set({
            store,
            categories,
            storeId,
            paymentDates,
            approved,
            userEmail,
            dispatchRiders,
            createdDate,
            dateVisited,
            wallentBalance: 0.00,
            country,
            state,
        });

        let user = {...userData.data()};
        user.stores.push(storeId);
        await userDetailsRef.update(user);
        await this.getUserStore(() => {props.history.push('/store/get-approved')});
    }

    getUser = () => {
        let user = localStorage.getItem(CONSTANTS.SESSIONSTORE);
        if (user) {
            user = JSON.parse(user);
            return user.data;
        } 
        return {}
    }

    storeNameCleanUp = name => {
        return String(name).trim().replace(/\s/g, '-').replace(/[\@\"\']+/g, '').toLowerCase();
    }

    checkIfStoreNameExists = async (storename) => {
        let db = this.firebase.firestore();
        const store = db.collection(CONSTANTS.SCHEMA.STORES);
        const query = store.where("storeId", '==', storename);
        const docs = await query.get();
        if (docs.empty) {
            return {
                status: false,
            }
        }
        let x = uuidv4();

        return {
            status: true,
            recommendation: this.storeNameCleanUp(`${storename}${String(x).substring(0, parseInt(_.random(3, x.length)))}`)
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
            this.setState({
                user: null,
                stores: [],
                storeLoaded: false,
            })
            props.history.push("/store/login");
        } catch(err) {
            this._handleError(err);
        }
    }

    getUserDataFromFirebase = async () => {
        if (!_.isNull(this.state.user)) return;
        const auth = firebase.auth();
        const user = await auth.currentUser;

        if (user) {
            const userCollection = CONSTANTS.SCHEMA.USER;
            const userDetailsRef = firebase.firestore().doc(`${userCollection}/${user.email}`);
            const userDoc = await userDetailsRef.get();
            if(userDoc.exists) {
                await this.setState({
                    user: userDoc.data()
                }, () => {
                    this.getUserStore();
                });
            }
        }
    }

    trackApproval = async (storeId, callback) => {
        const doc = firebase.firestore().collection(CONSTANTS.SCHEMA.STORES).doc(storeId);
        doc.onSnapshot(docSnapShot => {
            callback(docSnapShot.data());
        });
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