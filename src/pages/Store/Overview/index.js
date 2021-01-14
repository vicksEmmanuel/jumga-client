import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Media, Table } from "reactstrap";
import * as _ from 'lodash';
//import Charts
import StackedColumnChart from "./StackedColumnChart";


// Pages Components
import WelcomeComp from "./WelcomeComp";
import DeliveryRider from "./DeliveryRider";

import stateWrapper from '../../../containers/provider';
import { withRouter, Link } from 'react-router-dom';
//Import Breadcrumb
import Breadcrumbs from '../../../components/Common/Breadcrumb';

//i18n
import { withTranslation } from 'react-i18next';

const Overview  = props => {

    const [isLoading, setLoading] = useState(true);
    const storeId = props.match.params.id;
    const [state, setState] = useState({
        reports: [],
        revenue: [
            { title: "Year", linkto: "#", isActive: true }
        ],
        modal: false,
        delivery: null,
        noOfOrders: props.userStore.state?.noOfOrders
    });

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

        let reports = state.reports;
        let store = props.userStore.state.stores.filter(item => {
            return item.storeId == storeId
        });

        reports.push({ title: "Revenue", iconClass: "bx-archive-in", description: `$ ${store[0]?.walletBalance}` });
        reports.push({ title: "Pending Revenue", iconClass: "bx-copy-alt", description: `$ ${store[0]?.pendingBalance}` });
        setState({...state, reports, delivery: props.userStore.state.delivery,noOfOrders: props.userStore.state.noOfOrders});

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
            } else {
                props.history.push(`/store/front/${storeId}/overview`);
            }
        });
    }, []);

    const togglemodal = () => {
        setState({
            ...state,
            modal: !state.modal
        });
    }

    useEffect(() => {
       try {
        (async() => {
            await props.userStore.getNumofProductsOfAParticularStore(storeId);
            await props.userStore.getStoreStatistics(storeId);

            let reports = state.reports;
            let store = props.userStore.state.stores.filter(item => {
                return item.storeId == storeId
            });
            
            reports.push({ title: 'Orders', iconClass: 'bx-purchase-tag-alt', description: props.userStore.state.noOfOrders})
            setState({...state, reports})

        })()
       } catch(e) {
           console.log(e);
       }
    }, [])

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
                        <>
                            <div className="page-content">
                                <Container fluid>

                                    {/* Render Breadcrumb */}
                                    <Breadcrumbs title={props.t('Overview')} breadcrumbItem={props.t(storeId)} />

                                    <Row>
                                        <Col xl="4">
                                            <WelcomeComp storeId={storeId}/>
                                            <DeliveryRider storeId={storeId} />
                                        </Col>
                                        <Col xl="8">
                                            <Row>
                                                {/* Reports Render */}
                                                {
                                                    state.reports.map((report, key) =>
                                                        <Col md="4" key={"_col_" + key}>
                                                            <Card className="mini-stats-wid">
                                                                <CardBody>
                                                                    <Media>
                                                                        <Media body>
                                                                            <p className="text-muted font-weight-medium">{report.title}</p>
                                                                            <h4 className="mb-0">{report.description}</h4>
                                                                        </Media>
                                                                        <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                                                                            <span className="avatar-title">
                                                                                <i className={"bx " + report.iconClass + " font-size-24"}></i>
                                                                            </span>
                                                                        </div>
                                                                    </Media>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    )
                                                }
                                            </Row>

                                            <Card>
                                                <CardBody>
                                                    <CardTitle className="mb-4 float-sm-left">
                                                        Sales
                                                    </CardTitle>
                                                    <div className="float-sm-right">
                                                        <ul className="nav nav-pills">
                                                            {
                                                                state.revenue.map((item, key) =>
                                                                    <li className="nav-item" key={"_li_" + key}>
                                                                        <Link className={item.isActive ? "nav-link active" : "nav-link"} to={item.linkto}>{item.title}</Link>
                                                                    </li>
                                                                )
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                    <StackedColumnChart />
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </>
                    )
                }
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(stateWrapper(Overview)));

