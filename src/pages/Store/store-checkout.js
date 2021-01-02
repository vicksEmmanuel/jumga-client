import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Route,Redirect,withRouter } from "react-router-dom";
import { withTranslation } from 'react-i18next';
import * as _ from 'lodash';
import stateWrapper from "../../containers/provider";
import { Container, Row, Col } from "reactstrap";

//Import Cards
import CardMaintenance from "./card-store-checkout";

//Import Images
import maintenance from "../../assets/images/maintenance.png";
import logo from "../../assets/images/jumga logo.png";

    const StoreCheckout = (props) => {

        const [state, setState] = useState({
            store_cost: null,
            currency: null
        });

        useEffect(() => {
            let { remoteConfigs } = props.masterStore.state;
            setState({
                ...state,
                store_cost: remoteConfigs.store_cost,
                currency: remoteConfigs.currency
            });           
        },[props.masterStore.state.remoteConfigs])

        return (
              <React.Fragment>
                <section className="my-5 pt-sm-5">
                    <Container>
                        <Row>
                            <Col xs="12" className="text-center">
                                <div className="home-wrapper">
                                    <div className="mb-5">
                                        <img src={logo} alt="logo" height="44" />
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
                                            <div align="left" onClick={() => {}}>
                                                <i align="left" className="bx bx-arrow-back mb-4 h4 text-primary"></i>
                                            </div>
                                            <div align="left">
                                                <Row>
                                                    <Col md="6">
                                                        <h5 className="font-size-25 text-uppercase" style={{color: 'white', fontSize: 25}}>
                                                            {state.currency == null ? "": state.currency}{state.store_cost == null ? "" : state.store_cost}
                                                        </h5>
                                                    </Col>
                                                    <Col md="4">
                                                        
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