import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import * as _ from 'lodash';
import ErrorMessage from '../../components/Common/ErrorMessage';
import stateWrapper from "../../containers/provider";
import { Container, Row, Col } from "reactstrap";
import './store.scss';

import CardMaintenance from "./card-store-checkout";

import logo from "../../assets/images/jumga logo.png";

const StoreCheckout = (props) => {
    const storeId = props.match.params.id;

    const processCurrency = async () => {
        // let { remoteConfigs, remoteConfigLoading } = props.masterStore.state;
        // if (_.isEmpty(remoteConfigs)) return;
        if (state.currencyLoaded) return;
        if (props.paymentStore.state.currency.isLoading) return;

        await (async () => {
            try {
                // state.currency TODO: Change back to this
                // let result = await props.paymentStore.convertToLocalCurrency(props.masterStore.state.remoteConfigs?.store_cost,'USD');
                setState({
                    ...state,
                    currencyLoaded: true,
                    store_cost: props.paymentStore.state.currency.store_cost,
                    currency: props.paymentStore.state.currency.code,
                    currencyPricePerDollar: props.paymentStore.state.currency.pricePerDollar,
                    // remoteConfigCheck: !remoteConfigLoading
                });
            } catch(err) {
                setState({
                    ...state,
                    isError: true,
                    errMsg: 'Something went wrong when trying to load currency',
                });
            }
        })();
    }

    const checkIfStoreExists = (storeId) => {
        let isExists = props.userStore.state.stores.filter(item => {
            return item.storeId == storeId
        });
        if (isExists.length > 0) return true;
        return false;
    }
    const checkifApproved = (storeId) => {
        let checkApproval = props.userStore.state.stores.filter(item => {
            return item.storeId == storeId && item.approved == true
        });
        if (checkApproval.length > 0) return true;
        return false;
    }

    const [state, setState] = useState({
        currencyLoaded: false,
        isOpen: true,
        store_cost: props.paymentStore.state.currency?.store_cost || null,
        currency: props.paymentStore.state.currency?.code || 'USD',
        currencyPricePerDollar: props.paymentStore.state.currency?.pricePerDollar || 0,
        isError: false,
        errMsg: '',
        storeCheck: !checkifApproved(storeId),
        // remoteConfigCheck: !props.masterStore.state.remoteConfigLoading,
        bgColor: 'white',
        color: 'rgb(22, 46, 88)',
        clicked: false,
        currencyLoadedTimes: 1,
        user: props.userStore.state.user,
        url: null
    });

    // useEffect(() => {
    //     (async () => {
    //         await processCurrency();
    //     })();
    // }, [props.masterStore.state.remoteConfigs]);

    useEffect(() => {
        (async () => {
            await processCurrency();
        })();
    }, [props.paymentStore.state.currency]);

    useEffect(() => {
        if (_.isNull(props.userStore.state.user)) return;
        setState({
            ...state,
           user: props.userStore.state.user
        });
    }, [props.userStore.state.user])

    const loadData = async () => {
       if (!_.isNull(props.userStore.state.user)) {
        let stores = await props.userStore.getUserStoreExtra();
        if (!(stores.length > 0))  return props.history.push(`/store/front/`);
        if (!checkIfStoreExists(storeId))  return props.history.push(`/store/front/`);
        if (!checkifApproved(storeId)) return setState({...state, storeCheck: true});
        props.history.push(`/store/front/${storeId}`);
       }
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadData();
    }, [props.userStore.state.stores, props.userStore.state.user])

    useEffect(() => {
        if (state.isError) {
            setTimeout(() => {setState({...state, isError: false, errMsg: ''})}, 10000);
        }
    }, [state.isError]);

    let windowRef = null;

    const openNewWindow = (url) => {
        windowRef = window.open(url, 'Payment', 'statusbar=no,height=600,width=400');    
    }

    const handlePayment = async () => {
        console.log(state)
        if (
            !state.currencyLoaded &&
            _.isNull(props.userStore.state.user) &&
            _.isNull(state.currency)
        ) {
            setState({...state, isError: true, errMsg: 'Wait for the loading to be completed'});
            return;
        }
        setState({
            ...state,
            bgColor: 'rgb(22, 46, 88)',
            color: 'white',
            clicked: true
        });
        try {
            const options = {
                email: state.user?.email,
                name: state.user?.username,
                storename: storeId,
                // payment_plan: firebaseConfigParams.storePaymentPlanID,
                paymentTitle: `Payment for access to ${storeId}`,
                description: `${props.userStore.state.user.username} is to pay ${state.store_cost} to have access to ${storeId} store`,
                currency: state.currency,
                currencyPricePerDollar: state.currencyPricePerDollar
            };

            let payment = await  props.paymentStore.initiatePayment(options);
            const { link } = payment?.data?.data;
            setState({
                ...state,
                bgColor: 'white',
                color: 'rgb(22, 46, 88)',
                clicked: false,
                url: link
            });
            openNewWindow(link);
        } catch(e) {
            setState({
                ...state,
                bgColor: 'white',
                color: 'rgb(22, 46, 88)',
                clicked: false,
                isError: true,
                errMsg: 'Something went wrong...Probably your network',
            });
        }
    }

    useEffect(() => {
        props.userStore.trackApproval(storeId, (result) => {
            if (_.isUndefined(result)) return;
            if (result.approved == true) {
               (async () => {
                if (_.isNull(props.userStore.state.user)) return;
                await props.userStore.getUserStore();
                if (!_.isNull(windowRef)) windowRef.close();
                props.history.push(`/store/front/${storeId}`);
               })();
            }
        });
    }, []);

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
                                                            {state.store_cost == null ? "" : state.store_cost}
                                                        </h5>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="12">
                                                            <div align="right">
                                                                <button
                                                                    disabled={state.clicked}
                                                                    onClick={handlePayment}
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
                                                <Row>
                                                    <Col md="12">
                                                        <div align="left">
                                                            {
                                                                _.isNull(state.url) ? <></> : (
                                                                    <span style={{color: 'white', fontSize: '12'}}>
                                                                        If window does not open click this  
                                                                        <a target="_blank" style={{color: 'dodgerblue'}} href={state.url}>Link</a>
                                                                    </span>
                                                                )
                                                            }
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