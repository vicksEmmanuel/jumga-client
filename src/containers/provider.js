import React from "react";
import { Subscribe } from "unstated";
import allStores from "./index";

export default WrappedComponent => {
  
  const subscribeWrapper = ({ ...props }) => (

    <Subscribe to={allStores}>
        {(
          layoutStore,
          userStore,
          masterStore,
          paymentStore
        ) => (
          <WrappedComponent
            layoutStore={layoutStore}
            userStore={userStore}
            masterStore={masterStore}
            paymentStore={paymentStore}
            {...props}
          />
        )}
    </Subscribe>

  )

  return subscribeWrapper;
};
