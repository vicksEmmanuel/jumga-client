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
        GETORDERS: 'jumgaGetOrder',
        GETCUSTOMERS: 'jumgaGetCustomers'
    }
}
export default CONSTANTS;