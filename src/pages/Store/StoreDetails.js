import React, { useEffect, useState }  from 'react';
import _ from 'lodash';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import CreateStore, {Backdrop} from './CreateStore';
import { Container, Row, Col, Button, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Media, Table } from "reactstrap";
import stateWrapper from '../../containers/provider';
import storefront from "../../assets/images/store-umbrella.png";
import storefront2 from "../../assets/images/store-umbrella1.png";
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './store.scss';


const StoreDetails = (props) => {
    const [isLoading, setLoading] = useState(true);
    const storeId = props.match.params.id;

    useEffect(() => {
        if (!props.userStore.state.storeLoaded) return;
        const checkifApproved = (storeId) => {
            let checkApproval = props.userStore.state.stores.filter(item => {
                return item.storeId == storeId && item.approved == true
            });

            if (checkApproval.length > 0) return true;
            return false;
        }
        if (!checkifApproved(storeId)) props.history.push(`/store/get-approved/${storeId}`);
        setLoading(false);
    }, [props.userStore.state.storeLoaded, props.userStore.state.stores])

    useEffect(() => {
        props.userStore.trackApproval(storeId, (result) => {
            if (_.isUndefined(result)) return;
            if (result.approved == false) {
               (async () => {
                if (_.isNull(props.userStore.state.user)) return;
                await props.userStore.getUserStore();
                props.history.push(`/store/get-approved/${storeId}`);
               })();
            }
        });
    }, []);

    return (
          <React.Fragment>
                {
                    isLoading ? (
                        <div style={{position: 'fixed', top: '0%', width: '100%', height: '100%', left: '0%', zIndex: 5000, backgroundColor: '#f8f8fb'}}>
                            <div style={{position: 'relative', top: '45%', left: '43%'}}>
                                <div className="lds-ring-x"><div></div><div></div><div></div><div></div></div>
                            </div>
                        </div>
                    ) : (
                        <div>Details goes here</div>
                    )
                }
            </React.Fragment>
          );
    }
        
export default withRouter(withTranslation()(stateWrapper(StoreDetails)));