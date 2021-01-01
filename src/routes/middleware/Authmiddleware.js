import React, { useEffect } from "react";
import { Route,Redirect,withRouter } from "react-router-dom";
import CONSTANTS from '../../App.constant';

const Authmiddleware = ({
	component: Component,
	layout: Layout,
	path
}) => {
	return (
		<Route
			path={path}
			render={props => {
			
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

export default withRouter(Authmiddleware);

