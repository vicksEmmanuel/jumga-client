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

var randomColor = require('randomcolor');

const StoreDetails = (props) => {
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (!props.userStore.state.storeLoaded) return;
        const storeId = props.match.params.id;
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

    return (
          <React.Fragment>
                {
                    isLoading ? (
                        <div>Loading animation</div>
                    ) : (
                        <div>Details goes here</div>
                    )
                }
            </React.Fragment>
          );
    }
        
export default withRouter(withTranslation()(stateWrapper(StoreDetails)));