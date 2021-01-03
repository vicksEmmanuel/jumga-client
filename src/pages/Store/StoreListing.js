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

const StoreListing = (props) => {

    const [stores, setStores] = useState([]);

    // const [cat, useCat] = useState([]);
    const [isOpen, setOpen] = useState(false);

    const createStore = () => {
        setOpen(!isOpen);
    }

    useEffect(() => {
        setStores(props.userStore.state.stores);
    }, [props.userStore.state.stores]);

    useEffect(() => {
    }, [props.masterStore.state.remoteConfig]);

    const bigScreen = (children) => (
        <div style={{width: '70%'}} className="d-none d-md-block">
            {children}
        </div>
    );

    const smallScreen = (children) => (
        <div style={{width: '100%'}} className="d-md-none">
            {children}
        </div>
    );

    const cardBurrow = (children, color = '#f6f7f9') => {
        const lagreBox = () => <div style={{width: '30%', display: 'block', marginRight: 10, float: 'left'}} className='d-none d-md-inline-block' align="left"> {box} </div>
        const smallBox = () => <div style={{width: '100%', display: 'block', marginRight: 10, float: 'left'}} className='d-md-none' align="left"> {box} </div>

        const box = (
            <Card
                className="mt-4 store-listing-card" 
                style={{borderRadius: 5, backgroundColor: '#faf0be', height: 200}}
            >
                <CardBody>
                    {children}
                </CardBody>
            </Card>
        )

        return (
            <div key={Date.now()} style={{width: '100%'}}>
                {lagreBox()}
                {smallBox()}
            </div>
        )
    }
    const storelisting = () => {
        return (
            <div style={{width: '100%', marginTop: '10%'}}>
                <Row>
                    <Col xs="12">
                        <div className="page-title-box d-flex align-items-center justify-content-between" style={{margin: 0, padding: 0}}>
                            <h4 className="mb-0 font-size-18">{props.t("Recent stores")}</h4>
                        </div>
                        <div style={{width: '100%', margin: 0}} align="left">
                            {cardBurrow((
                                <div 
                                    onClick={() => {
                                        createStore();
                                    }}
                                    style={{width: '100%', alignContent: 'center', height: '100%', cursor: 'pointer'}}
                                >
                                    <center style={{height: '80%', paddingTop: '20%'}} className="d-none d-md-block">
                                        <div>
                                            <i className="bx bx-plus text-primary" style={{fontSize: 20, fontWeight: 'bold'}}></i>
                                        </div>
                                        <h4 className="mb-0 font-size-16 text-primary">Add store</h4>
                                    </center>
                                    <center style={{height: '100%', paddingTop: '20%'}} className='d-md-none' >
                                        <div>
                                            <i className="bx bx-plus text-primary" style={{fontSize: 20, fontWeight: 'bold'}}></i>
                                        </div>
                                        <h4 className="mb-0 font-size-16 text-primary">Add store</h4>
                                    </center>
                                    <div style={{width: '100%', backgroundColor: 'black', height: 1, opacity: 0.3}}></div>
                                </div>
                            ))}
                            {stores.map((item, id) => {
                                let categories = item.categories.length > 2 ? item.categories.splice(0,2) : item.categories;
                                return cardBurrow((
                                    <div 
                                        key={id}
                                        onClick={() => {
                                            props.history.push(`/store/front/${item?.storeId}`);
                                        }}
                                        style={{width: '100%', height: '100%', cursor: 'pointer'}}
                                    >
                                       <div style={{height: '80%'}}>
                                            <h4 style={{fontSize: 16}}>{item.store}</h4>
                                            <p>{item.storeId}</p>
                                       </div>
                                       <div style={{height: '20%'}}>
                                            {categories.map((val, idx) => {
                                                return (
                                                    <div key={idx} style={{display: 'inline', marginRight: 4}}>
                                                        <i className="bx bxs-circle font-size-10" style={{color: randomColor(), marginRight: 3}}></i>
                                                        <span 
                                                            style={{fontSize: 10 }}
                                                        >
                                                            {val}
                                                        </span>
                                                    </div>
                                                )
                                            })}
                                       </div>
                                    </div>
                                ), '#f7fcf1')
                            })}
                       </div>
                    </Col>
                </Row>
            </div>
        )
    }

    return (
          <React.Fragment>
                <div style={{position: 'fixed', backgroundColor: 'white', width: '100%', marginTop: 70, height: '40%'}}>
                    <Row>
                        <Col xs="12">
                            <div className="page-title-box">
                                <LazyLoadImage
                                    alt={"Store front"}
                                    src={storefront}
                                    width={300}
                                    className="d-none d-md-block"
                                    style={{float: 'right', marginTop: 20, marginRight: 10}}
                                />
                                <LazyLoadImage
                                    alt={"Store front"}
                                    src={storefront2}
                                    width={300}
                                    className="d-none d-md-block"
                                    style={{float: 'left', marginTop: 20, marginLeft: 10}}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="page-content">
                    <Container fluid>
                        <center>
                            {bigScreen(storelisting())}
                            {smallScreen(storelisting())}
                        </center>
                    </Container>
                </div>
                <CreateStore isOpen={isOpen} createStore={createStore} categories={props.masterStore.state.categories}/>
                {isOpen ? <Backdrop createStore={createStore} /> : <></>}
            </React.Fragment>
          );
    }
        
export default withRouter(withTranslation()(stateWrapper(StoreListing)));