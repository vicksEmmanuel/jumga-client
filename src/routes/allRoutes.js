import React from "react";
import { Redirect } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Authentication/Login";
import Create from "../pages/Authentication/Create";
import StoreCheckout from "../pages/Store/store-checkout";
import Store from "../pages/Store/StoreListing";


const userRoutes = [

	{ path: "/home", component: Home },
	// this route should be at the end of all other routes
	{ path: "/", exact: true, component: () => <Redirect to="/home" /> }
];

const storeRoutes  = [
	{ path: "/store/front", component: Store}
];

const storeAuthRoutes = [

];

const authRoutes = [
	{ path: "/store/login", component: Login },
	{ path: "/store/get-approved", component: StoreCheckout},
	{ path: "/store/register", component: Create},
];

export { userRoutes, authRoutes, storeRoutes, storeAuthRoutes };
