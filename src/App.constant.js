const CONSTANTS = {
    FLUTTERWAVEAPIBASE: "https://api.flutterwave.com/v3",
    SESSIONSTORE: "jumga--xx-xx-xx-10/20/20--authUser",
    SESSIONBEARER: "jumgaJWToken",
    SCHEMA: {
        USER: 'users',
        CATEGORIES: 'categories',
        STORES: 'stores',
        PRODUCTS: 'products',
        CART: 'carts',
        ORDER: 'orders'
    },
    FUNCNTIONS: {
        PROCESSPAYMENT: 'flutterwaveProcessPayment',
        SEARCHPRODUCT: 'jumgaOnSearch',
        GETPRODUCTS: 'jumgaGetProductList',
        GETPRODUCT: 'jumgaGetProduct',
        STORESTAT: 'jumgaStoreStatistics',
        GETSTOREPRODUCTS: 'jumgaGetStoreProducts',
        GETCATEGORYPRODUCTS: 'jumgaGetCategories',
        GETORDERS: 'jumgaGetOrder',
        GETCUSTOMERS: 'jumgaGetCustomers',
        GETHISTORY: 'jumgaGetHistory',
        ADMINSTAT: 'adminGetStatistics',
        ADMINGETORDERS: 'adminGetOrder',
        ADMINGETPRODUCTS: 'adminGetProductList',
        ADMINGETSTORES: 'adminGetStores',
        ADMINGETUSERS: 'adminGetUsers',
        ADMINGETDISPATCHERS: 'adminGetDisptachRider',
        DELIVERYGETORDERS: 'dispatchRidersGetOrder',
        DELIVERYGETSTATISTICS: 'dispatchRidersGetStatistics',
    }
}
export default CONSTANTS;