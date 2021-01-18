import React, { Component, useEffect } from 'react';
import { Switch, BrowserRouter as Router,Route } from "react-router-dom";
import { Provider, Subscribe } from "unstated";

import allStores from './containers';
import { userRoutes , authRoutes, storeRoutes, storeAuthRoutes, userAuthRoutes, adminAuthRoutes, deliveryAuthRoutes } from "./routes/allRoutes";
import Storemiddleware from "./routes/middleware/Storemiddleware";
import NonAuthmiddleware from "./routes/middleware/NonAuthMiddleware";
import NonAuthLayout from './components/NonAuthLayout';
import StoreLayout from './components/StoreLayout';
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import DispatcherLayout from "./components/DispatcherLayout";
import UserLayout from "./components/UserLayout";

import "./assets/scss/theme.scss";
import StoreAuthmiddleware from './routes/middleware/StoreAuthmiddleware';
import UserMiddleware from './routes/middleware/UserMiddleware';

class App extends Component{

	constructor(props) {
		super(props);
		this.layoutStore = allStores[0];
		this.userStore = allStores[2];
		this.masterStore = allStores[3];
		this.paymentStore = allStores[4];
	}

	appScreen = (layout) => 
		<React.Fragment>
			<Router>
				<Switch>
					{userAuthRoutes.map((route, idx) => (
						<NonAuthmiddleware
							path={route.path}
							component={route.component}
							key={idx}
							layout={NonAuthLayout}
						/>
					))}
					
					{authRoutes.map((route, idx) => (
						<NonAuthmiddleware
							path={route.path}
							component={route.component}
							key={idx}
							layout={NonAuthLayout}
						/>
					))}
					{deliveryAuthRoutes.map((route, idx) => (
						<StoreAuthmiddleware
							path={route.path}
							component={route.component}
							key={idx}
							layout={DispatcherLayout}
						/>
					))}

					{adminAuthRoutes.map((route, idx) => (
						<StoreAuthmiddleware
							path={route.path}
							component={route.component}
							key={idx}
							layout={AdminLayout}
						/>
					))}

					{storeAuthRoutes.map((route, idx) => (
						<StoreAuthmiddleware
							path={route.path}
							component={route.component}
							key={idx}
							layout={Layout}
						/>
					))}

					{storeRoutes.map((route, idx) => (
						<Storemiddleware
							path={route.path}
							component={route.component}
							key={idx}
							layout={StoreLayout}
						/>
					))}

					{userRoutes.map((route, idx) => (
						<UserMiddleware
							path={route.path}
							component={route.component}
							key={idx}
							layout={UserLayout}
						/>
					))}
				</Switch>
			</Router>
		</React.Fragment>

	render() {
		return (
			<Provider inject={allStores}>
				<Subscribe to={[this.layoutStore]}>
					{layoutStore => (
						this.appScreen(layoutStore)
					)}
				</Subscribe>
			</Provider>
		)
	}
}

export default App;
