import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Route,Redirect,withRouter } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import * as _ from 'lodash';
import ErrorMessage from '../../components/Common/ErrorMessage';
import stateWrapper from "../../containers/provider";
import { Container, Row, Col } from "reactstrap";
import './store.scss';

import CardMaintenance from "./card-store-checkout";

import logo from "../../assets/images/jumga logo.png";
import CONSTANTS from '../../App.constant';

const StoreCheckout = (props) => {

    const storeId = props.match.params.id;
    const checkifApproved = (storeId) => {
        let checkApproval = props.userStore.state.stores.filter(item => {
            return item.storeId == storeId && item.approved == true
        });
        if (checkApproval.length > 0) return true;
        return false;
    }

    const [state, setState] = useState({
        isOpen: true,
        store_cost: props.masterStore.state.remoteConfigs?.store_cost,
        currency: props.masterStore.state.remoteConfigs?.currency,
        isError: false,
        errMsg: '',
        storeCheck: !checkifApproved(storeId),
        remoteConfigCheck: !props.masterStore.state.remoteConfigLoading,
        bgColor: 'white',
        color: 'rgb(22, 46, 88)',
        clicked: false
    });

    useEffect(() => {
        let { remoteConfigs, remoteConfigLoading } = props.masterStore.state;
        setState({
            ...state,
            store_cost: remoteConfigs.store_cost,
            currency: remoteConfigs.currency,
            remoteConfigCheck: !remoteConfigLoading
        });
    },[props.masterStore.state.remoteConfigs])

    useEffect(() => {
        if (!props.userStore.state.storeLoaded) return;
        if (!checkifApproved(storeId)) {
            setState({...state, storeCheck: true});
        } else {
            props.history.push(`/store/front/`);
        }
    }, [props.userStore.state.storeLoaded, props.userStore.state.stores])

    useEffect(() => {
        if (state.isError) {
            setTimeout(() => {setState({...state, isError: false, errMsg: ''})}, 10000);
        }
    }, [state.isError]);

    return (
            <React.Fragment>
                <div onClick={() => {setState({...state, errMsg: '', isError: false})}}>
                <ErrorMessage isError={state.isError} message={state.errMsg} />
            </div>
            <section className="my-5 pt-sm-5">
                <Container>
                    <Row>
                        <Col xs="12" className="text-center">
                            <div className="home-wrapper">
                                <div className="mb-5">
                                    <Link to={'/'}>
                                        <img src={logo} alt="logo" height="44" />
                                    </Link>
                                </div>
                                <h3 className="mt-5">Get Approved</h3>
                                <Row>
                                    <Col md="4"></Col>
                                    <Col md="4">
                                        <p>Jumga requires you to pay an annual fee before you can access the store services</p>
                                    </Col>
                                    <Col md="4"></Col>
                                </Row>

                                <Row>
                                    <Col md="3"></Col>
                                    <CardMaintenance>
                                        <div style={{cursor: 'pointer', width: '5%'}} align="left" onClick={() => {
                                            props.history.push('/store/front');
                                        }}>
                                            <i align="left" className="bx bx-arrow-back mb-4 h4 text-primary"></i>
                                        </div>
                                        <div align="left">
                                            <Row>
                                                <Col md="12">
                                                    <h5 className="font-size-25 text-uppercase" style={{color: 'white', fontSize: 25}}>
                                                        {state.currency == null ? "": state.currency}{state.store_cost == null ? "" : state.store_cost}
                                                    </h5>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12">
                                                        <div align="right">
                                                            <button
                                                                disabled={!(state.remoteConfigCheck == true && state.storeCheck == true) || state.clicked}
                                                                onClick={async () => {
                                                                    if (!(state.remoteConfigCheck == true && state.storeCheck == true)) {
                                                                        setState({...state, isError: true, errMsg: 'Wait for the loading to be completed'});
                                                                    }
                                                                    setState({
                                                                        ...state,
                                                                        bgColor: 'rgb(22, 46, 88)',
                                                                        color: 'white',
                                                                        clicked: true
                                                                    });
                                                                    console.log(props);
                                                                    let payment = await  props.paymentStore.initiatePayment({
                                                                        email: props.userStore.state.user.email,
                                                                        name: props.userStore.state.user.username,
                                                                        paymentTitle: `Payment for access to ${storeId}`,
                                                                        description: `${props.userStore.state.user.username} is to pay ${state.currency}${state.store_cost} to have access to ${storeId} store`
                                                                    });

                                                                    console.log(payment);
                                                                }}
                                                                style={{
                                                                    borderRadius: 20, 
                                                                    backgroundColor: state.bgColor, 
                                                                    display: 'inline-block',
                                                                    padding: '1%',
                                                                    paddingLeft: '3%',
                                                                    paddingRight: '3%',
                                                                    cursor: 'pointer',
                                                                    fontFamily: 'Sriracha, cursive',
                                                                    color: state.color,
                                                                    transition: 'all 0.5s ease'
                                                                }}
                                                            >
                                                                pay {state.clicked? (
                                                                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                                                                ): <></>}
                                                            </button>
                                                        </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </CardMaintenance>

                                    <Col md="3"></Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </React.Fragment>
            );
}
            
export default withRouter(withTranslation()(stateWrapper(StoreCheckout)));