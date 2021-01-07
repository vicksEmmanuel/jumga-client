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


const userRoutes = [

	{ path: "/home", component: Home },
	// this route should be at the end of all other routes
	{ path: "/", exact: true, component: () => <Redirect to="/home" /> }
];

const storeRoutes  = [
	{ path: "/store/front", component: Store}
];

const storeAuthRoutes = [
	{ path: "/store/front/:id/overview", component: ComingSoon},
	{ path: "/store/front/:id/analysis", component: ComingSoon},
	{ path: "/store/front/:id/account", component: ComingSoon},
	{ path: "/store/front/:id/settings", component: ComingSoon},
	{ path: "/store/front/:id/customers", component: ComingSoon},
	{ path: "/store/front/:id/orders", component: ComingSoon},
	{ path: "/store/front/:id/add-products", component: StoreAddProduct}, //Add product
	{ path: "/store/front/:id/products/:productId", component: ComingSoon}, //View a particular product
	{ path: "/store/front/:id/products", component: ComingSoon}, //View all product
	{ path: "/store/front/:id", component: StoreDetails}, //Home
];

const authRoutes = [
	{ path: "/store/login", component: Login },
	{ path: "/store/get-approved/:id", component: StoreCheckout},
	{ path: "/store/register", component: Create},
	{ path: "/payment/close", component: PaymentClose}
];

export { userRoutes, authRoutes, storeRoutes, storeAuthRoutes };
