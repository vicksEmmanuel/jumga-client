import React, { useEffect } from "react";
import { Route,Redirect,withRouter } from "react-router-dom";
import CONSTANTS from '../../App.constant';

const NonAuthmiddleware = ({
	component: Component,
	layout: Layout,
	path
}) => {
	return (
		<Route
			path={path}
			render={props => {
				return <Layout>
					<Component {...props} />
				</Layout>;
			}}
		/>
	);
}

export default withRouter(NonAuthmiddleware);

