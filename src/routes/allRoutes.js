import React from "react";
import { Redirect } from "react-router-dom";

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
import LoginAdmin from "../pages/Authentication/LoginAdmin";
import LoginDelivery from "../pages/Authentication/LoginDelivery";
import CreateX from "../pages/Authentication/CreateX";
import Overview from "../pages/Store/Overview";
import StoreCustomers from "../pages/Store/StoreCustomers";
import UserHistory from "../pages/Store/History";
import StoreOrders from "../pages/Store/StoreOrders";

import Home from "../pages/Home/Home";
import StoreHome from "../pages/Store/Home";
import DeliveryHome from "../pages/Delivery/DeliveryHome";

// import DeliveryOverview from '../pages/Delivery/DeliveryOverview';
// import DeliveryOrders from '../pages/Delivery/DeliveryOrders';


// import AdminOverview from "../pages/Admin/Overview";
// import AdminAddDelivery from "../pages/Admin";
// import AdminUsers from "../pages/Admin";
// import AdminAddCategories from "../pages/Admin";
// import AdminOrders from '../pages/Admin';
// import AdminProducts from '../pages/Admin';

const userRoutes = [
	{ path: "/store/:id", component: ComingSoon},
	{ path: "/search/:id", component: GeneralStoreProducts},
	{ path: "/search/", component: GeneralStoreProducts},
	{ path: "/categories/:id", component: ComingSoon}, //TODO:
	{ path: "/cart", component: Cart},
	{ path: "/checkout", component: Checkout},
	//Home
	{ path: "/store", component: StoreHome }, //TODO:
	{ path: "/delivery", component: DeliveryHome},
	{ path: "/history", component: UserHistory}, //TODO:
	{ path: "/:productId", component: StoreProductDetails},

	
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
	{ path: "/store/front/:id/customers", component: StoreCustomers},
	{ path: "/store/front/:id/orders", component: StoreOrders},
	{ path: "/store/front/:id/add-products", component: StoreAddProduct},
	{ path: "/store/front/:id/products", component: StoreProducts},
	{ path: "/store/front/:id", component: StoreDetails},
];

const adminAuthRoutes = [
	{ path: "/admin/overview", component: ComingSoon}, //AdminOverview}, //TODO:
	{ path: "/admin/add-delivery", component: ComingSoon},//AdminAddDelivery}, //TODO:
	{ path: "/admin/analysis", component: ComingSoon}, //TODO: 
	{ path: "/admin/users", component: ComingSoon},//AdminUsers}, //TODO:
	{ path: "/admin/add-categories", component: ComingSoon},//AdminAddCategories}, //TODO:
	{ path: "/admin/order", component: ComingSoon},//AdminOrders}, //TODO:
	{ path: "/admin/products", component: ComingSoon}//AdminProducts}, //TODO:
];

const deliveryAuthRoutes = [
	{ path: "/delivery/overview", component: ComingSoon},//DeliveryOverview}, //TODO:
	{ path: "/delivery/account", component: ComingSoon}, //TODO: 
	{ path: "/delivery/orders", component: ComingSoon}//DeliveryOrders}, //TODO:
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
	{ path: "/admin/login", component: LoginAdmin},
	{ path: "/delivery/login", component: LoginDelivery}
];

export { userRoutes, authRoutes, storeRoutes, storeAuthRoutes, userAuthRoutes };
