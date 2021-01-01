import { LayoutContainer } from "./LayoutContainer";
import { UserContainer } from "./UserContainer";
import { firebaseConfigParams } from '../config';

const store = [
    new LayoutContainer(),
    new UserContainer(firebaseConfigParams),
]

export default store;