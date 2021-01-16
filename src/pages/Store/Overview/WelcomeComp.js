import React, { useState, useEffect } from "react";

import { Row, Col, Card, CardBody } from "reactstrap";
import stateWrapper from '../../../containers/provider';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import wNumb from 'wnumb';
import * as _ from 'lodash';

const WelcomeComp = props => {
    const [state, setState] = useState({});

    const formatNumber = (number) => {
        var formatter = wNumb({
            mark: '.',
            thousand: ',',
            prefix: '',
            suffix: ''
        });
        return formatter.to(number);
    }

    return (
        <React.Fragment>
            <Card className="overflow-hidden">
                <div className="bg-soft-primary">
                    <Row>
                        <Col xs="7">
                            <div className="text-primary p-3">
                                <h5 className="text-primary">Welcome Back !</h5>
                                <p>{props.storeId}</p>
                            </div>
                        </Col>
                    </Row>
                </div>
                <CardBody className="pt-0">
                    <Row>
                        <Col sm="4">
                            <div className="avatar-md profile-user-wid mb-4">
                                {_.isNull(props.userStore.state.user?.downloadURL) ? 
                                    < div 
                                        style={{
                                            color: 'white', 
                                            backgroundColor: 'rgba(230,0,103, 1)', 
                                            borderRadius: '50%',
                                            fontWeight: 'bold',
                                            paddingTop: 5,
                                            width: 30,
                                            height: 30,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {String(props.userStore.state.user?.username).substring(0,2).toUpperCase()}
                                    </div> :
                                    <img src={props.userStore.state.user?.downloadURL} alt="" className="img-thumbnail rounded-circle"/>
                                }
                            </div>
                            <h5 className="font-size-15 text-truncate">{props.userStore.state.user?.username}</h5>
                            <p className="text-muted mb-0 text-truncate">Store Owner</p>
                        </Col>

                        <Col sm="8">
                            <div className="pt-4">
                                <Row>
                                    <Col xs="6">
                                        <h5 className="font-size-15">{formatNumber(props.userStore.state.noOfProducts)}</h5>
                                        <p className="text-muted mb-0">Products</p>
                                    </Col>
                                    <Col xs="6">
                                        <h5 className="font-size-15">${
                                            props.userStore.state.stores.filter(item => {
                                                return item.storeId == props.storeId
                                            })[0]?.walletBalance
                                        }</h5>
                                        <p className="text-muted mb-0">Revenue</p>
                                    </Col>
                                </Row>
                                <div className="mt-4">
                                    <Link to="/profile" className="btn btn-primary waves-effect waves-light btn-sm">View Profile <i className="mdi mdi-arrow-right ml-1"></i></Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(stateWrapper(WelcomeComp)));

