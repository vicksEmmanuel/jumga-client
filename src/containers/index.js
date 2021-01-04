import { LayoutContainer } from "./LayoutContainer";
import { MasterContainer } from "./MasterContainer";
import { UserContainer } from "./UserContainer";
import { firebaseConfigParams } from '../config';
import { PaymentContainer } from "./PaymentContainer";

const store = [
    new LayoutContainer(),
    new UserContainer(firebaseConfigParams),
    new MasterContainer(),
    new PaymentContainer()
]

export default store;