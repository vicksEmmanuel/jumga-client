import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Container, Row, Col, Button } from "reactstrap";
import Lottie from 'react-lottie';
import { withRouter, Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { withTranslation } from 'react-i18next';
import * as animationData from '../../assets/images/22620-store.json';
import svg from '../../svgs';
import logo from '../../assets/images/jumga basket logo.png';
import "./home.scss";
import stateWrapper from "../../containers/provider";
import store1 from '../../assets/images/store-umbrella1.png';
import store2 from '../../assets/images/store-umbrella.png';


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


    const temp = [
        {storeId: 'Kodebottle'},
        {storeId: 'Apple'},
        {storeId: 'MC Donalds'},
        {storeId: 'KFC'},
        {storeId: 'Tesla'},
        {storeId: 'Jumga'},
        {storeId: 'MeatStore'},
        {storeId: 'Gamify'},
        {storeId: 'LG'},
        {storeId: 'Binotone'},        
    ]

    const homeBig = () => {
        return (
            <div style={{width: '100%', marginTop: '2%'}}>
                <Row>
                    <Col xs="12">
                        <div style={{width: '100%', margin: 0}} align="left">
                            <Row style={{marginBottom: '5%'}}>
                                <Col lg="6" md="6" sm="12">
                                    <Row>
                                        <Col lg="12">
                                            <div className="page-title-box d-flex align-items-center justify-content-between" style={{margin: 0, padding: 0}}>
                                                <div className="mb-0" style={{fontSize: '20px', lineHeight: '32px', fontWeight: '700', zIndex: 400, color: '#0f1c70'}}>{props.t("Sell anything, anytime, anywhere")}</div>
                                            </div>
                                            <div style={{position: 'relative', top: '-35%', opacity: 0.9, left: '-50px', height: 150}} align="left">
                                                <svg.zigzag width="200px" height="200px"/>
                                            </div>
                                        </Col>
                                    </Row>
                                    {largeCustomIntro()}
                                    {smallCustomIntro()}
                                </Col>
                                <Col lg="6" md="6" sm="12" align="center">
                                    <div style={{width: '100%'}} align="right">
                                        <Button 
                                            className="btn btn-success" 
                                            style={{border: 0, outline: 0, backgroundColor: '#d3212d', color: 'white'}}
                                            onClick={() => {props.history.push('/store/front')}}
                                        >
                                            Go To Store
                                        </Button>
                                    </div>
                                    <div style={{width: '100%', marginTop: 30, overflow: 'hidden'}}
                                    >
                                        {temp.map((item, id) => {
                                            return (
                                                <div 
                                                className="dropshadow moveUpandDown"
                                                    style={{
                                                        display: 'inline-block', 
                                                        padding: 20, 
                                                        color: '#91a3b0',
                                                        borderRadius: 5, 
                                                        borderColor: 'teal', 
                                                        borderWidth: '5px',
                                                        marginLeft: 20,
                                                        fontWeight: 'bold',
                                                        fontSize: 20,
                                                        marginBottom: 20,
                                                        backgroundColor: 'white'
                                                    }} key={id}>{item.storeId}</div>
                                            )
                                        })}
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="12">
                                    <Row>
                                        <Col lg="6" md="6" style={{backgroundColor: '#c0e8d5'}}>
                                            <div style={{width: '100%', padding: 20}}>
                                                <h1 className="ml1" style={{color: '#d3212d', marginBottom: 20}}>
                                                    <span className="text-wrapper">
                                                        <span className="line line1"></span>
                                                        <span className="letters">Store Features</span>
                                                        <span className="line line2"></span>
                                                    </span>
                                                </h1>
                                                <p style={{fontWeight: '400'}}>
                                                    <div style={{marginBottom: 10}}>
                                                        <i className="bx bx-check-shield text-primary" style={{color: '#7fff00'}}></i> Fast and Secure
                                                    </div>
                                                    <div style={{marginBottom: 10}}>
                                                        <i className="bx bx-check-shield text-primary" style={{color: '#7fff00'}}></i> Secure payment system from anywhere around the world
                                                    </div>
                                                    <div style={{marginBottom: 10}}>
                                                        <i className="bx bx-check-shield text-primary" style={{color: '#7fff00'}}></i> Inclusion of analytics tools to help grow your businsess
                                                    </div>
                                                    <div style={{marginBottom: 10}}>
                                                        <i className="bx bx-check-shield text-primary" style={{color: '#7fff00'}}></i> Unlimited number of product catalog
                                                    </div>
                                                    <div style={{marginBottom: 10}}>
                                                        <i className="bx bx-check-shield text-primary" style={{color: '#7fff00'}}></i> Continous support from the Jumga team
                                                    </div>
                                                    <div style={{marginBottom: 10}}>
                                                        <i className="bx bx-check-shield text-primary" style={{color: '#7fff00'}}></i> Ready available dispatchers close and far away
                                                    </div>
                                                    <div style={{marginBottom: 10}}>
                                                        <i className="bx bx-check-shield text-primary" style={{color: '#7fff00'}}></i> Create as many stores as you like
                                                    </div>
                                                </p>
                                            </div>
                                        </Col>
                                        <Col lg="6" md="6" style={{backgroundColor: 'white'}} align="center">
                                            <LazyLoadImage
                                                style={{width: '100%', height: '400px', borderRadius: 5}}
                                                className="d-none d-md-block"
                                                src={store1}
                                            />
                                        </Col>
                                    </Row>
                                    <Row align="center">
                                        <Col lg="12" style={{backgroundColor: '#c0e8d5'}}>
                                            <div style={{width: '100%', padding: 20, marginTop: 20}}>
                                                <h1 className="ml1" style={{color: '#d3212d', marginBottom: 20}}>
                                                    <span className="text-wrapper">
                                                        <span className="line line1"></span>
                                                        <span className="letters" style={{ fontSize: 24}}>Why Own A Jumga Store</span>
                                                        <span className="line line2"></span>
                                                    </span>
                                                </h1>
                                                <Row>
                                                    <Col>
                                                        <p style={{fontWeight: '400', fontSize: 16}}>
                                                            Jumga was created in 2020 to enable sellers access to both international and local buyers,
                                                            whose barrier was either the payment method, trust, or delivery method. Jumga solves these
                                                            issues with just the click of a finger. We have a standby dispatch team, we provide the trust
                                                            and we provide the best payment method. Jumga is the go to for any buyer thus sellers should
                                                            come onto our system.
                                                        </p>
                                                    </Col>
                                                    <Col lg="6" md="6" align="center">
                                                        <LazyLoadImage
                                                            alt={"Store front"}
                                                            src={store2}
                                                            width={300}
                                                            className="d-none d-md-block store-front"
                                                            style={{position:'relative', marginTop: '10%'}}
                                                        />
                                                    </Col>
                                                </Row>
                                                
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row style={{backgroundColor: 'white'}}>
                                        <Col lg="12" style={{marginTop: 30}}  align="center">
                                            <h1 className="ml1" style={{color: '#d3212d', marginBottom: 20}}>
                                                <span className="text-wrapper">
                                                    <span className="line line1"></span>
                                                    <span className="letters"style={{ fontSize: 24}}>Pricing</span>
                                                    <span className="line line2"></span>
                                                </span>
                                            </h1>

                                           <div style={{marginBottom: 20,}}>
                                                <div style={{marginBottom: 10}}>
                                                    <i className="bx bx-extension text-primary" style={{color: '#7fff00'}}></i> Annual Fee <span style={{fontWeight: 'bolder'}}>{props.paymentStore.state.currency?.store_cost}</span>
                                                </div>
                                                <div style={{marginBottom: 10}}>
                                                    <i className="bx bx-extension text-primary" style={{color: '#7fff00'}}></i> Commission Per Sales <sspan style={{fontWeight: 'bolder'}}>2.5%</sspan>
                                                </div>
                                           </div>
                                        </Col>
                                    </Row>
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

export default withRouter(withTranslation()(stateWrapper(Home)))
