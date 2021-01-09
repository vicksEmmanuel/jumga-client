import React, { Component, useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Table, Input, CardTitle, InputGroup, InputGroupAddon, Button } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import * as _ from 'lodash';
import stateWrapper from '../../containers/provider';
//i18n
import { withTranslation } from 'react-i18next';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';


const Cart = props => {
    const [state, setState] = useState({
        isLoading: true,
        productList: props.masterStore.state.cart
    });

    useEffect(() => {
        setTimeout(() => {
            setState({...state, isLoading: false})
        }, 3000)
    }, [])

    const loadData = () => {
        setState({ ...state, productList: props.masterStore.state.cart });
    }

    useEffect(() => {
        if (!_.isEmpty(props.masterStore.state.cart)) loadData();
    }, [props.masterStore.state.cart]);

    const removeCartItem = (id) => {
        let productList = state.productList;

        if (!_.isNull(props.userStore.state.user)) {
            let index = state.productList.findIndex(p => p?.productId === id);
            if (index > -1) props.masterStore.deleteCartItem(state.productList[index], props.userStore.state.user.email);
        }

        var filtered = productList.filter(function (item) {
            return item?.productId !== id;
        });

        console.log("here");

        props.masterStore.setState({ ...state, cart: filtered }, () => {
            setState({...state, productList: filtered});
        });
    }

    const updateCount = (newCount, id) => {
        let newCartData = state.productList.map(p => (p?.productId === id ? { 
            ...p,
            quantity: newCount ,
            total: newCount * p?.currentprice
        } : p));

        if (!_.isNull(props.userStore.state.user)) {
            let index = state.productList.findIndex(p => p?.productId === id);
            if (index > - 1) {
                let data = state.productList[index];
                props.masterStore.updateCartItem({
                    ...data,
                    quantity: newCount,
                    total: newCount * data?.currentprice,
                }, props.userStore.state.user.email);
            }
        }

        props.masterStore.setState({
            cart: newCartData
        });
    }
    const countDown = (id, prev_data_attr) => {
        let newCount = prev_data_attr - 1 >= 1 ?  prev_data_attr - 1 : 1;
        updateCount(newCount, id);
    }

    const countUP = (id, prev_data_attr) => {
        let newCount = prev_data_attr + 1;
        updateCount(newCount, id);
    }

    const goToPay = e => {
        e.preventDefault();
        if (_.isNull(props.userStore.state.user)) return props.history.push('/login');

        return props.history.push('/checkout');
    }

    return (
        <React.Fragment>
            {
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Cart" breadcrumbItem="" />

                        {
                            state.isLoading ? (
                                <div style={{position: 'fixed', top: '0%', width: '100%', height: '100%', left: '0%', zIndex: 5000, backgroundColor: 'rgba(0,0,0,0.4)'}}>
                                    <div style={{position: 'relative', top: '45%', left: '43%'}}>
                                        <div className="lds-ring-x"><div></div><div></div><div></div><div></div></div>
                                    </div>
                                </div>
                            ) :
        
                            <Row>
                                {
                                    state.productList.length > 0 ? (
                                        <>
                                            <Col lx="8">
                                                <Card>
                                                    <CardBody>
                                                        <div className="table-responsive">
                                                            <Table className="table table-centered mb-0 table-nowrap">
                                                                <thead className="thead-light">
                                                                    <tr>
                                                                        <th>Product</th>
                                                                        <th>Product Desc</th>
                                                                        <th>Price</th>
                                                                        <th>Quantity</th>
                                                                        <th colSpan="2">Total</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        state.productList.map((product) =>
                                                                            <tr key={product?.productId}>
                                                                                <td>
                                                                                    <img src={product?.images[0]} alt="product-img" title="product-img" className="avatar-md" />
                                                                                </td>
                                                                                <td>
                                                                                    <h5 className="font-size-14 text-truncate"><Link to={"/" + product?.productId} className="text-dark">{product?.productname}</Link></h5>
                                                                                    <p className="mb-0">{
                                                                                        product?.variantion ? (
                                                                                            <>
                                                                                                {product?.variantion?.key} : <span className="font-weight-medium">{product?.variantion.value}</span>
                                                                                            </>
                                                                                        ) : ''
                                                                                    }</p>
                                                                                </td>
                                                                                <td>
                                                                                    $ {product.currentprice}
                                                                                </td>
                                                                                <td>
                                                                                    <div style={{ width: "120px" }}>
                                                                                        <InputGroup>
                                                                                            <InputGroupAddon addonType="prepend">
                                                                                                <Button 
                                                                                                    color="primary"
                                                                                                    style={{backgroundColor: '#f68b1e', borderColor: '#f68b1e'}} 
                                                                                                    onClick={() => { countUP(product?.productId, parseInt(product?.quantity)) }}>+</Button>
                                                                                            </InputGroupAddon>
                                                                                            <Input type="text" value={product?.quantity} name="demo_vertical" readOnly/>
                                                                                            <InputGroupAddon addonType="append">
                                                                                                <Button 
                                                                                                    color="primary" 
                                                                                                    style={{backgroundColor: '#f68b1e', borderColor: '#f68b1e'}}
                                                                                                    onClick={() => { countDown(product?.productId, parseInt( product?.quantity)) }}>-</Button>
                                                                                            </InputGroupAddon>
                                                                                        </InputGroup>
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    $ {product.total}
                                                                                </td>
                                                                                <td>
                                                                                    <Link to="#" onClick={() => removeCartItem(product?.productId)} className="action-icon text-danger"> <i className="mdi mdi-trash-can font-size-18"></i></Link>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    }
                    
                    
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                        <Row className="mt-4">
                                                            <Col sm="6">
                                                                <Link to="/" className="btn btn-success">
                                                                    <i className="mdi mdi-arrow-left mr-1"></i> Continue Shopping </Link>
                                                            </Col>
                                                            <Col sm="6">
                                                                <div className="text-sm-right mt-2 mt-sm-0">
                                                                    <Link 
                                                                        to="#" 
                                                                        onClick={goToPay}
                                                                        className="btn btn-success"
                                                                        style={{backgroundColor: '#f68b1e', borderColor: '#f68b1e'}}
                                                                    >
                                                                        <i className="mdi mdi-cart-arrow-right mr-1"></i> Checkout </Link>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                            <Col xl="4">
                                                <Card>
                                                    <CardBody>
                                                        <CardTitle className="mb-3">Order Summary</CardTitle>
                    
                                                        <div className="table-responsive">
                                                            <Table className="table mb-0">
                                                                <tbody>
                                                                    <tr>
                                                                        <td>Grand Total :</td>
                                                                        <td>$ 1,857</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Discount : </td>
                                                                        <td>- $ 157</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Shipping Charge :</td>
                                                                        <td>$ 25</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Estimated Tax : </td>
                                                                        <td>$ 19.22</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>Total :</th>
                                                                        <th>$ 1744.22</th>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </>
                                    ) : (
                                        <Col lx="12">
                                            {
                                                !_.isNull(props.userStore.state.user) ? (
                                                    <>
                                                        <h2 className="display-2 text-center" style={{fontSize:25, marginTop: 20, fontWeight: 'bolder'}}>
                                                                Cart is Empty
                                                        </h2>
                                                        <div className="mt-5 text-center">
                                                            <Link 
                                                                className="btn btn-success waves-effect waves-light" 
                                                                to="#"
                                                                style={{backgroundColor: '#f68b1e', borderColor: '#f68b1e', color: 'slategray'}}
                                                                onClick={e => {
                                                                    e.preventDefault();
                                                                    props.history.goBack();
                                                                }}
                                                            >Go Back</Link>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h2 className="display-2 text-center" style={{fontSize:25, marginTop: 20, fontWeight: 'bolder', color: 'slategray'}}>
                                                            Cart is Empty. Sign In to continue
                                                        </h2>
                                                        <div className="mt-5 text-center">
                                                            <Link 
                                                                className="btn btn-success waves-effect waves-light" 
                                                                to="/login"
                                                                style={{backgroundColor: '#f68b1e', borderColor: '#f68b1e'}}
                                                            >Login</Link>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </Col>
                                    )
                                }
                            </Row>
                        }
    
                    </Container>
                </div>
            }
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(stateWrapper(Cart)));