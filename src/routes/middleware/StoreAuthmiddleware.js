import React, { useEffect } from "react";
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
	const checkifApproved = () => {
		let user = superProps?.userStore?.state?.user;
		if (!_.isNull(user)) {
			if (user?.approved) return true;
			return false;
		}
		return false;
		// let user = localStorage.getItem(CONSTANTS.SESSIONSTORE);
		// if (user) {
		// 	let email = JSON.parse(user).email;
		// 	const userCollection = CONSTANTS.SCHEMA.USER;
        //     const userDetailsRef = firebase.firestore().doc(`${userCollection}/${email}`);
        //     const userDoc = await userDetailsRef.get();
        //     if(userDoc.exists) {
		// 		if (userDoc.data()?.approved) return true;
		// 		return false;
        //     }
		// 	return false;
		// }
		// return false;
	}
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

				if (!checkifApproved()) {
					return (
						<Redirect to={{ pathname: "/store/get-approved", state: { from: props.location } }} />
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

