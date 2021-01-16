import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Container, Row, Col, Button, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Media, Table } from "reactstrap";
import Lottie from 'react-lottie';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import * as animationData from '../../assets/images/9644-delivery-riding.json';
import svg from '../../svgs';
import logo from '../../assets/images/jumga basket logo.png';
import "./home.scss";



 const Home = (props) => {

    const defaultOptions = {
        loop: 1,
        autoplay: true, 
        animationData: animationData.default,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }

    const bigScreen = (children) => (
        <div style={{width: '95%'}} className="d-none d-md-block">
            {children}
        </div>
    );

    const smallScreen = (children) => (
        <div style={{width: '100%'}} className="d-md-none">
            {children}
        </div>
    );

    const largeCustomIntro = () => {
        return (
            <Row className="d-none d-md-flex">
                <Col lg="6" md="6">
                    { !state.isAnimationDone ? (
                        <div style={{width: '100%', position: 'relative', top: '-40%', left: '-20%'}}>
                            <Lottie 
                                options={defaultOptions}
                                height={300}
                                width={300}
                                eventListeners={[
                                    {
                                        eventName: 'complete',
                                        callback: () => setState({...state, isAnimationDone: true})
                                    }
                                ]}
                            />
                        </div>
                    ) : (
                        <img src={logo} style={{width: 300}} />
                    )}
                </Col>
                <Col lg="6" md="6">
                    <div align="left"  style={{fontSize: '50px', lineHeight: '60px', fontWeight: '700', top: '-30%', left: '-15%', position: 'relative', color:'#D5371C'}}>
                        Jumga
                    </div>
                </Col>
            </Row>
        )
    }
    const smallCustomIntro = () => {
        return (
            <Row className="d-md-none">
                <Col lg="6" md="6" sm="6" xs="6">
                    { !state.isAnimationDone ? (
                        <div style={{width: '100%', position: 'relative', top: '-75%', left: '-30%'}}>
                            <Lottie 
                                options={defaultOptions}
                                height={200}
                                width={200}
                                eventListeners={[
                                    {
                                        eventName: 'complete',
                                        callback: () => setState({...state, isAnimationDone: true})
                                    }
                                ]}
                            />
                        </div>
                    ) : (
                        <img src={logo} style={{width: 150, top: '-45%', position: 'relative', paddingBottom: 30}} />
                    )}
                </Col>
                <Col lg="6" md="6" sm="6" xs="6">
                    <div align="left"  style={{fontSize: '30px', lineHeight: '40px', fontWeight: '700', top: '-70%', position: 'relative', color:'#D5371C', left: '-30%'}}>
                        Jumga
                    </div>
                </Col>
            </Row>
        )
    }

    const [state, setState] = useState({
        isAnimationDone: false
    })

    const homeBig = () => {
        return (
            <div style={{width: '100%', marginTop: '2%'}}>
                <Row>
                    <Col xs="12">
                        <div style={{width: '100%', margin: 0}} align="left">
                            <Row>
                                <Col lg="6" md="6" sm="12">
                                    <Row>
                                        <Col lg="12">
                                            <div className="page-title-box d-flex align-items-center justify-content-between" style={{margin: 0, padding: 0}}>
                                                <div className="mb-0" style={{fontSize: '20px', lineHeight: '32px', fontWeight: '700', zIndex: 400, color: '#0f1c70'}}>{props.t("Dispatch anything, anytime, anywhere")}</div>
                                            </div>
                                            <div style={{position: 'relative', top: '-35%', opacity: 0.9, left: '-50px', height: 150}} align="left">
                                                <svg.zigzag width="200px" height="200px"/>
                                            </div>
                                        </Col>
                                    </Row>
                                    {largeCustomIntro()}
                                    {smallCustomIntro()}
                                </Col>
                                <Col lg="6" md="6" sm="12" align="right">
                                    Helo World
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <center>
                            {bigScreen(homeBig())}
                            {smallScreen(homeBig())}
                        </center>
                    </Container>
                </div>
            </React.Fragment>
        );
    }

export default withRouter(withTranslation()(Home))
