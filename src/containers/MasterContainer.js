import _ from "lodash";
import firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import "firebase/remote-config";

import { Container } from "unstated";
import CONSTANTS from "../App.constant";

class MasterContainer extends Container {

    constructor() {
        super();
        this.state = {
            categories: [],
            remoteConfigLoading: true,
            cart: [],
            popularProducts: [],
            recentProducts: [],
            remoteConfigs: {
                store_cost: 20,
                currency: 'USD',
                // facebook_url: 'https://www.facebook.com/jumga',
                // instagram_url: 'https://www.instagram.com/jumga/?hl=en',
                // contact_email1: 'info@jumga.com',
                // contact_phone_no: '+234 807 443 4878',
                // terms_of_service_url:  'https://www.termsfeed.com/terms-conditions-generator',
                // privacy_policy_url: 'https://jumga.com/pages/privacy-policy'
            }
        }

        this.asyncgetAllRemoteConfigs();
        this.getAllCategories();
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
        this.setState({
            ...this.state,
            remoteConfigs: config.remoteConfigs,
            remoteConfigLoading: false
        }, () => {
            
        });
        return config;
    }

    searchForId = async (searchDetails = {
      id: '',
      filter: false,
      filterPriceMinRange: 0,
      filterPriceMaxRange: 1000000000,
      filterDiscountRate: 50,
      filterCustomerRating: 5,
      startAt: 0,
      limit: 10,
  }) => {
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.SEARCHPRODUCT);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }
    
    searchForCategoriesProducts = async (searchDetails = {
      id: '',
      filter: false,
      filterPriceMinRange: 0,
      filterPriceMaxRange: 1000000000,
      filterDiscountRate: 50,
      filterCustomerRating: 5,
      startAt: 0,
      limit: 10,
  }) => {
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.GETCATEGORYPRODUCTS);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    searchForStoreProducts = async (searchDetails = {
      id: '',
      filter: false,
      filterPriceMinRange: 0,
      filterPriceMaxRange: 1000000000,
      filterDiscountRate: 50,
      filterCustomerRating: 5,
      startAt: 0,
      limit: 10,
  }) => {
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.GETSTOREPRODUCTS);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    getPopularProducts = async () => {
      try {
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.GETPOPULARPRODUCTS);
        const response = await callable();
        let newPoPrArry = response.data?.data?.map((i, id) => {
          return{
              name: `itemp${id}`,
              productId: i.productId,
              images: i.history[0].images[0],
              productname: i.history[0].productname,
              pastprice: i.history[0].pastprice,
              currentprice: i.history[0].currentprice,
              starRating: i.history[0].starRating
          }
        });

        this.setState({popularProducts: newPoPrArry})
        return newPoPrArry;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    getRecentProducts = async () => {
      try {
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.GETRECENTPRODUCTS);
        const response = await callable();

        let newRecentProArry = response.data.map((i, id) => {
            return {
                name: `itemx${id}`,
                productId: i.productId,
                images: i.images[0],
                productname: i.productname,
                pastprice: i.pastprice,
                currentprice: i.currentprice,
                starRating: i.starRating
            }
        });
        this.setState({recentProducts: newRecentProArry})
        return newRecentProArry;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    sendToDeliveryTeam = async (order) => {
      const doc = firebase.firestore().doc(`${CONSTANTS.SCHEMA.ORDER}/${order.id}`);
      const docData = await doc.get();

      if (docData.exists) {
        await doc.update({isSentToDeliveryTeam: true});
      }
    }

    delivered = async (order) => {
      try {
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.ADMINPROCESSDELIVERY);
        const response = await callable(order);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }



    adminGetProducts = async (searchDetails = {
      startAt: 0,
      limit: 10,
    }) => {
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.ADMINGETPRODUCTS);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    adminGetUsers = async (searchDetails = {
      startAt: 0,
      limit: 10,
    }) => {
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.ADMINGETUSERS);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    adminGetOrders = async (searchDetails = {
      startAt: 0,
      limit: 10,
    }) => {
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.ADMINGETORDERS);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    adminGetDispatchers = async (searchDetails = {
      startAt: 0,
      limit: 10,
    }) => {
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.ADMINGETDISPATCHERS);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    adminGetStores = async (searchDetails = {
      startAt: 0,
      limit: 10,
    }) => {
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.ADMINGETSTORES);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }



    deliveryGetOrders = async (searchDetails = {
      email: '',
      startAt: 0,
      limit: 10,
    }) => {
      console.log(searchDetails);
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.DELIVERYGETORDERS);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }



    getProducts = async (searchDetails = {
      storeId: '',
      startAt: 0,
      limit: 10,
    }) => {
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.GETPRODUCTS);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    getCustomers = async (searchDetails = {
      storeId: '',
      startAt: 0,
      limit: 10,
    }) => {
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.GETCUSTOMERS);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    getOrders = async (searchDetails = {
      storeId: '',
      startAt: 0,
      limit: 10,
    }) => {
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.GETORDERS);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    getHistory = async (searchDetails = {
      email: '',
      startAt: 0,
      limit: 10,
    }) => {
      try {
        if (!_.isObject(searchDetails)) return [];
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.GETHISTORY);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    getProduct = async (searchDetails = {
      id: '',
    }) => {
      try {
        if (!_.isObject(searchDetails)) return {};
        const callable = firebase.functions().httpsCallable(CONSTANTS.FUNCNTIONS.GETPRODUCT);
        const response = await callable(searchDetails);
        return response.data;
      } catch(e) {
        console.log(e);
        return [];
      }
    }

    getAllCategories = async () => {
        if (this.state.categories.length > 0) return this.state.categories;
        const categoriesCollection = CONSTANTS.SCHEMA.CATEGORIES;
        const categoriesDetailsRef = firebase.firestore().collection(categoriesCollection);
        const snapshot = await categoriesDetailsRef.get();
        let cat = [];
        snapshot.forEach(doc => {
            cat[doc.id] = doc.data();
        });

        this.setState({
            ...this.state,
            categories: cat
        });

        return this.state.categories;
    }

    objectsEqual = (o1, o2) => {
      return typeof o1 === 'object' && Object.keys(o1).length > 0 
      ? Object.keys(o1).length === Object.keys(o2).length 
          && Object.keys(o1).every(p => this.objectsEqual(o1[p], o2[p]))
      : o1 === o2;
    }

    addToCart = async (user, cartItem) => {
      try {
        let cart = this.state.cart;
        let check = cart.filter(item => {
            // return this.objectsEqual(item, cartItem);
            return item.productId == cartItem.productId
        });
  
        if (check.length > 0) throw new Error('Product is already in cart');

        if (_.isNull(user)) {  
          cart.push({
            ...cartItem,
            quantity: 1,
            total: cartItem?.currentprice * 1
          });
  
          this.setState({
            cart
          });
  
        } else {

          const cartCollection = CONSTANTS.SCHEMA.CART;
          const cartDetailsRef = firebase.firestore().collection(cartCollection);
          const cartDoc = cartDetailsRef.doc();                    
          cartDoc.set({
            ...cartItem,
            email: user?.email,
            quantity: 1,
            total: cartItem?.currentprice * 1
          });

          this.getCart(user?.email);
        }
      } catch(e) {
        throw new Error(e?.message);
      }
    }

    getCart = async (userId) => {
      const doc = firebase.firestore().collection(CONSTANTS.SCHEMA.CART);
      const docRef = doc.where('email', '==', userId);
      const docData = await docRef.get();

      if (docData.empty) return;

      let cart = this.state.cart;
      docData.forEach(i => {

        let check = cart.filter(item => {
            // return this.objectsEqual(item, cartItem);
            return item.productId == i.data()?.productId
        });

      if (!(check.length > 0)) cart.push({...i.data(), id: i.id});
      });

      this.setState({
        cart,
      })
      
    }

    updateCartItem = async (cart, userId) => {
      const doc = firebase.firestore().doc(`${CONSTANTS.SCHEMA.CART}/${cart?.id}`);
      const docRef = await doc.get();
      if (docRef.exists) await doc.update(cart);
      await this.getCart(userId);
    }

    deleteCartItem = async (cart, userId) => {
      const doc = firebase.firestore().doc(`${CONSTANTS.SCHEMA.CART}/${cart?.id}`);
      const docRef = await doc.get();
      if (docRef.exists) await doc.delete();
      await this.getCart(userId);
    }
}

export { MasterContainer }