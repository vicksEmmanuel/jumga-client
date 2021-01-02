import { LayoutContainer } from "./LayoutContainer";
import { MasterContainer } from "./MasterContainer";
import { UserContainer } from "./UserContainer";
import { firebaseConfigParams } from '../config';

const store = [
    new LayoutContainer(),
    new UserContainer(firebaseConfigParams),
    new MasterContainer()
]

export default store;