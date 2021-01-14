import React from "react";
import { Redirect } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Authentication/Login";
import Create from "../pages/Authentication/Create";
import StoreCheckout from "../pages/Store/store-checkout";
import Store from "../pages/Store/StoreListing";
import StoreDetails from "../pages/Store/StoreDetails";
import PaymentClose from "../pages/Utility/payment-close";
import ComingSoon from "../pages/Utility/comin-soon";
import StoreAddProduct from "../pages/Store/StoreAddProduct";
import StoreProductDetails from "../pages/Store/StoreProductDetails";
import StoreProducts from "../pages/Store/StoreProducts";
import GeneralStoreProducts from "../pages/Store/GeneralStoreProducts";
import Cart from "../pages/Store/Cart";
import Checkout from "../pages/Store/Checkout";
import LoginX from "../pages/Authentication/LoginX";
import CreateX from "../pages/Authentication/CreateX";
import Overview from "../pages/Store/Overview";


const userRoutes = [
	{ path: "/store/:id", component: ComingSoon},
	{ path: "/search/:id", component: GeneralStoreProducts}, //TODO:
	{ path: "/search/", component: GeneralStoreProducts}, //TODO:
	{ path: "/categories/:id", component: ComingSoon}, //TODO:
	{ path: "/cart", component: Cart}, //TODO: View product in cart
	{ path: "/checkout", component: Checkout}, //TODO:
	{ path: "/:productId", component: StoreProductDetails}, //TODO: //View a particular product
	{ path: "/", exact: true, component: Home } //TODO:
];

const storeRoutes  = [
	{ path: "/store/front", component: Store},
];

const storeAuthRoutes = [
	{ path: "/store/front/:id/overview", component: Overview},
	{ path: "/store/front/:id/analysis", component: ComingSoon}, //TODO: 
	{ path: "/store/front/:id/account", component: ComingSoon}, //TODO: 
	{ path: "/store/front/:id/settings", component: ComingSoon}, //TODO: 
	{ path: "/store/front/:id/customers", component: ComingSoon},  //TODO: 
	{ path: "/store/front/:id/orders", component: ComingSoon}, //TODO: 
	{ path: "/store/front/:id/add-products", component: StoreAddProduct}, //Add product
	{ path: "/store/front/:id/products", component: StoreProducts},  //TODO: //View all product
	{ path: "/store/front/:id", component: StoreDetails}, //Home
];

const authRoutes = [
	{ path: "/store/login", component: Login },
	{ path: "/store/get-approved/:id", component: StoreCheckout},
	{ path: "/store/register", component: Create},
	{ path: "/payment/close", component: PaymentClose},
];

const userAuthRoutes = [
	{ path: "/login", component: LoginX },
	{ path: "/register", component: CreateX},
];

const jumgaAdmminRoutes = [
	{ path: "/dispatch-rider-display" },
	{ path: "/categories"}
]

export { userRoutes, authRoutes, storeRoutes, storeAuthRoutes, userAuthRoutes };
