import React, { useEffect, useState } from "react";
import { Route,Redirect,withRouter } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import * as _ from 'lodash';
import stateWrapper from "../../containers/provider";
import firebase from "firebase/app";
import { v4 as uuidv4 } from 'uuid';

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import "firebase/remote-config";
import CONSTANTS from '../../App.constant';

const StoreAuthmiddleware = (superProps) => {
	const Layout = superProps?.layout;
	const Component = superProps?.component;
    const path = superProps?.path;

	return (
		<Route
			path={path}
			render={(props) => {
			
				// here you can apply condition
				if (!localStorage.getItem(CONSTANTS.SESSIONSTORE)) {
					return (
						<Redirect to={{ pathname: "/store/login", state: { from: props.location } }} />
					);
				}


				return <Layout>
					<Component {...props} />
				</Layout>;
			}}
		/>
	);
}

export default withRouter(withTranslation()(stateWrapper(StoreAuthmiddleware)));

