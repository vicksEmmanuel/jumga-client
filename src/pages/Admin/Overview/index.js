import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Media, Table } from "reactstrap";
import * as _ from 'lodash';
import wNumb from 'wnumb';
//import Charts
import StackedColumnChart from "./StackedColumnChart";


// Pages Components
import WelcomeComp from "./WelcomeComp";
import stateWrapper from '../../../containers/provider';
import { withRouter, Link } from 'react-router-dom';
//Import Breadcrumb
import Breadcrumbs from '../../../components/Common/Breadcrumb';

//i18n
import { withTranslation } from 'react-i18next';

const Overview  = props => {

    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if(!_.isNull(props.userStore.state.user)) {
            if (props.userStore.state.user?.userType !== 'Admin') return props.history.push('/');
            setLoading(false);
        }
    }, [props.userStore.state.user]);

    const [state, setState] = useState({
        reports: [],
        revenue: [
            { title: "Year", linkto: "#", isActive: true }
        ],
        modal: false,
        noOfOrders: props.userStore.state?.admin.noOfOrders
    });

    const formatNumber = (number) => {
        var formatter = wNumb({
            mark: '.',
            thousand: ',',
            prefix: '',
            suffix: ''
        });
        return formatter.to(number);
    }

    useEffect(() => {
       try {
        (async() => {
            await props.userStore.getAdminStatistics();

            let reports = state.reports;

            reports.push({ title: 'Orders', iconClass: 'bx-purchase-tag-alt', description: formatNumber(props.userStore.state.admin?.noOfOrders)});
            reports.push({ title: "Users", iconClass: "bx bx-group", description: `${formatNumber(props.userStore.state.admin?.noOfUsers)}` });
            reports.push({ title: "Revenue", iconClass: "bx-archive-in", description: `$ ${formatNumber(props.userStore.state.admin?.walletBalance)}` });
            reports.push({ title: "Pending Revenue", iconClass: "bx-copy-alt", description: `$ ${formatNumber(props.userStore.state.admin?.pendingBalance)}` });
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
                                    <Breadcrumbs title={props.t('Overview')} breadcrumbItem={props.t('Jumga')} />

                                    <Row>
                                        <Col xl="2"></Col>
                                        <Col xl="8">
                                            <WelcomeComp/>
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

