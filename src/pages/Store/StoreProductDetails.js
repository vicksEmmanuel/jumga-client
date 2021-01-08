import React, { Component, useEffect, useState } from 'react';
import * as _ from 'lodash';
import { Container, Row, Col, Card, CardBody, Button, Nav, NavItem, NavLink, TabContent, TabPane, Table, Media } from "reactstrap";
import classnames from 'classnames';
import Page404 from '../Utility/pages-404';
import stateWrapper from '../../containers/provider';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

//Import Star Ratings
import StarRatings from 'react-star-ratings';
import ErrorMessage from '../../components/Common/ErrorMessage';

//Import Product Images
import img4 from "../../assets/images/product/img-4.png";
import img6 from "../../assets/images/product/img-6.png";
import img7 from "../../assets/images/product/img-7.png";
import img8 from "../../assets/images/product/img-8.png";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

const StoreProductDetail = props => {
    let productId = props.match.params?.productId;

    console.log(productId);

    const initialState = {
        extraProduct: [],
        product: {},
        is404: false,
        errMsg: '',
        isError: false,
        comments: [
            { id: 1, img: avatar2, name: "Brian", description: "If several languages coalesce, the grammar of the resulting language.", date: "5 hrs ago" },
            {
                id: 2, img: avatar4, name: "Denver", description: "To an English person, it will seem like simplified English, as a skeptical Cambridge", date: "07 Oct, 2019",
                childComment: [
                    { id: 1, img: avatar5, name: "Henry", description: "Their separate existence is a myth. For science, music, sport, etc.", date: "08 Oct, 2019" },
                ]
            },
            { id: 3, img: "Null", name: "Neal", description: "Everyone realizes why a new common language would be desirable.", date: "05 Oct, 2019" },
        ],
        recentProducts: [
            { id: 1, img: img7, name: "Wirless Headphone", link: "", rating: 4, oldPrice: 240, newPrice: 225 },
            { id: 2, img: img4, name: "Phone patterned cases", link: "", rating: 3, oldPrice: 150, newPrice: 145 },
            { id: 3, img: img6, name: "Phone Dark Patterned cases", link: "", rating: 4, oldPrice: 138, newPrice: 135 },
        ],
        activeTab: '1',
        metaTagHolder: ''
    }
    const [state, setState] = useState(initialState);

    const loadData = () => {
        (async () => {
            setState(initialState);
            let result = await props.masterStore.getProduct({
                id: productId, //If the value is '' it would return all the products
            });
            if (_.isEmpty(result)) return setState({...state, is404: true});
            setState({...state, product: result.product, extraProduct: result.extraProductFromStore});
            console.log(result);
        })();
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadData();
    }, [productId])

    useEffect(() => {
        if (state.isError) {
            setTimeout(() => {setState({...state, isError: false, errMsg: ''})}, 10000);
        }
    }, [state.isError]);

    const addToCart = () => {
        try {
            props.masterStore.addToCart(props.userStore.state.user, {});
        } catch(e) {
            console.log(e);
            setState({...state, isError: true, errMsg: e?.message});
        }
    }

    const toggleTab = (tab) => {
        if (state.activeTab !== tab) {
            setState({
                ...state,
                activeTab: tab
            });
        }
    }

    const imageShow = (img, id) => {
        var expandImg = document.getElementById("expandedImg" + id);
        expandImg.src = img;
    }

    const calculateAndReturnDiscount = () => {
        let oldPrice = Number(state.product.pastprice);
        let newPrice = Number(state.product.currentprice);
        let x = oldPrice  -  newPrice;

        if (x <= 0) return <></>;

        let discount = (x)/oldPrice * 100;

        return <h6 className="text-success text-uppercase">{discount}% Off</h6>
    }

    const metaTags = () => {
        if (String(state.product.metakeywords).length > 0) {
            const keywords = state.product.metakeywords.split(',');
            let jsx =keywords.map((item, id) => {
                let x = id + 1;
                return (
                    <Link 
                        onClick={e => {
                            e.preventDefault();
                            setState({...state, metaTagHolder: x});
                        }}
                        to="#" 
                        className={x == state.metaTagHolder ? "active": ''}
                    >
                        <div className="product-color-item border rounded">
                            <img src={state.product.images[0]} alt="" className="avatar-md" />
                        </div>
                        <p>{item}</p>                        
                    </Link>
                )
            });

            return jsx;
        } 

        return <div></div>
    }

    return (
        <React.Fragment>
            <div onClick={() => {setState({...state, errMsg: '', isError: false})}}>
               <ErrorMessage isError={state.isError} message={state.errMsg} />
            </div>
            <div className="page-content">
               {state.is404 ? (
                   <Page404/>
               ) : (
                    <Container>
                        <Breadcrumbs title={state.product?.storeId} breadcrumbItem={state.product?.productname} />
                        {
                            _.isEmpty(state.product) ? <></> : (
                                <>
                                    <Row>
                                        <Col>
                                            <Card>
                                                <CardBody>
                                                    <Row>
                                                        <Col xl="6">
                                                            <div className="product-detai-imgs">
                                                                {
                                                                    <Row>
                                                                        <Col md="2" xs="3">
                                                                            <Nav className="flex-column" pills>
                                                                                {state.product?.images.map((item, id) => {
                                                                                    let p = id + 1;
                                                                                    return (
                                                                                        <NavItem key={p}>
                                                                                            <NavLink
                                                                                                className={classnames({ active: state.activeTab == p })}
                                                                                                onClick={() => { toggleTab(`${p}`); }}
                                                                                            >
                                                                                                <img src={item} alt="" onClick={() => { imageShow(item, p) }} className="img-fluid mx-auto d-block rounded" />
                                                                                            </NavLink>
                                                                                        </NavItem>
                                                                                    )
                                                                                })}
                                                                            </Nav>
                                                                        </Col>
                                                                        <Col md={{ size: 7, offset: 1 }} xs="9">
                                                                            <TabContent activeTab={state.activeTab}>
                                                                                {
                                                                                    state.product.images.map((item, id) => {
                                                                                        let p = id + 1;
                                                                                        return (
                                                                                            <TabPane tabId={`${p}`}>
                                                                                                <div>
                                                                                                    <img src={item} alt="" id={`expandedImg${p}`} className="img-fluid mx-auto d-block" />
                                                                                                </div>
                                                                                            </TabPane>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </TabContent>
                                                                            <div className="text-center">
                                                                                <Button 
                                                                                    onClick={addToCart}
                                                                                    type="button" 
                                                                                    color="primary" 
                                                                                    className="btn waves-effect waves-light mt-2 mr-1"
                                                                                >
                                                                                        <i className="bx bx-cart mr-2"></i> Add to cart
                                                                                </Button>
                                                                                <Button type="button" color="success" className="ml-1 btn waves-effect  mt-2 waves-light">
                                                                                    <i className="bx bx-shopping-bag mr-2"></i>Buy now
                                                                            </Button>
                                                                            </div>

                                                                        </Col>
                                                                    </Row>
                                                                }
                                                            </div>
                                                        </Col>

                                                        <Col xl="6">
                                                            <div className="mt-4 mt-xl-3">
                                                                { state.product.categories.map((item, id) => {
                                                                    return <Link to={`categories/${item}`} className="text-primary">{item}</Link>
                                                                })}
                                                                <h4 className="mt-1 mb-3">{state.product.productname}</h4>

                                                                <div className="text-muted float-left mr-3 mb-3">
                                                                    <StarRatings
                                                                        rating={state.product.starRating}
                                                                        starRatedColor="#F1B44C"
                                                                        starEmptyColor="#2D363F"
                                                                        numberOfStars={5}
                                                                        name='rating'
                                                                        starDimension="14px"
                                                                        starSpacing="3px"
                                                                    />
                                                                </div>
                                                                <p className="text-muted mb-4">( {state.product.reviews.length} Customers Review )</p>

                                                                { Number(state.product.pastprice) > 0 ? calculateAndReturnDiscount() : <></>}
                                                                <h5 className="mb-4">Price : <span className="text-muted mr-2"><del>{
                                                                    Number(state.product.pastprice) > Number(state.product.currentprice) ? '$'+state.product.pastprice + ' USD': ''}
                                                                    </del></span> <b>{'$'+ state.product.currentprice + ' USD'}</b></h5>
                                                                <p className="text-muted mb-4">{state.product.productdesc}</p>
                                                                
                                                                {/* <Row className="mb-3">
                                                                    <Col md="6">
                                                                        <div>
                                                                            <p className="text-muted"><i className="bx bx-unlink font-size-16 align-middle text-primary mr-1"></i> Wireless</p>
                                                                            <p className="text-muted"><i className="bx bx-shape-triangle font-size-16 align-middle text-primary mr-1"></i> Wireless Range : 10m</p>
                                                                            <p className="text-muted"><i className="bx bx-battery font-size-16 align-middle text-primary mr-1"></i> Battery life : 6hrs</p>
                                                                        </div>
                                                                    </Col>
                                                                    <Col md="6">
                                                                        <div>
                                                                            <p className="text-muted"><i className="bx bx-user-voice font-size-16 align-middle text-primary mr-1"></i> Bass</p>
                                                                            <p className="text-muted"><i className="bx bx-cog font-size-16 align-middle text-primary mr-1"></i> Warranty : 1 Year</p>
                                                                        </div>
                                                                    </Col>
                                                                </Row> */}

                                                                <div className="product-color">
                                                                    <h5 className="font-size-15">{state.product.metaname}</h5>
                                                                    {metaTags()}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    {/* <div className="mt-5">
                                                        <h5 className="mb-3">Specifications :</h5>

                                                        <div className="table-responsive">
                                                            <Table className="table mb-0 table-bordered">
                                                                <tbody>
                                                                    <tr>
                                                                        <th scope="row" style={{ width: "400px" }}>Category</th>
                                                                        <td>Headphone</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Brand</th>
                                                                        <td>JBL</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Color</th>
                                                                        <td>Black</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Connectivity</th>
                                                                        <td>Bluetooth</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">Warranty Summary</th>
                                                                        <td>1 Year</td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </div> */}

                                                    <div className="mt-5">
                                                        <h5 className="mb-4">{state.product.reviews.length > 0 ? 'Reviews :': ''}</h5>
                                                        {
                                                            state.product.reviews.map((comment, k) =>
                                                                <Media className={comment.id === 1 ? "border-bottom" : "border-bottom mt-3"} key={"__media__" + k}>
                                                                    {
                                                                        comment.img !== "Null" ?
                                                                            <img src={comment.img} className="avatar-xs mr-3 rounded-circle" alt="img" />
                                                                            : <div className="avatar-xs mr-3">
                                                                                <span className="avatar-title bg-soft-primary text-primary rounded-circle font-size-16">
                                                                                    {String(comment?.name).toUpperCase().charAt(0)}
                                                                            </span>
                                                                            </div>
                                                                    }
                                                                    <Media body>
                                                                        <h5 className="mt-0 mb-1 font-size-15">{comment.name}</h5>
                                                                        <p className="text-muted">{comment.description}</p>
                                                                        <div className="text-muted font-size-12"><i className="far fa-calendar-alt text-primary mr-1"></i>{comment.date}</div>
                                                                    </Media>
                                                                </Media>
                                                            )
                                                        }
                                                    </div>

                                                </CardBody>
                                            </Card>
                                        </Col>
                                    </Row>

                                    <Row className="mt-3">
                                        <Col lg={12}>
                                            <div>
                                                <h5 className="mb-3">Other products from &nbsp;
                                                    <Link to={`/store/${state.product.storeId}`}>
                                                        <span className="text-primary">{state.product.storeId}</span>
                                                    </Link> store
                                                </h5>

                                                <Row>
                                                    {
                                                        state.extraProduct.map((product, key) =>
                                                            <Col xl="4" sm="6" key={"__product__" + key}>
                                                                <Card>
                                                                    <CardBody>
                                                                        <Link to={`/${product.productId}`} onClick={e => {
                                                                            e.preventDefault();
                                                                            window.location.href = `/${product.productId}`;
                                                                        }}>
                                                                            <Row className="align-items-center">
                                                                                <Col md="4">
                                                                                    <img src={product.images[0]} alt="" className="img-fluid mx-auto d-block" />
                                                                                </Col>
                                                                                <Col md="8">
                                                                                    <div className="text-center text-md-left pt-3 pt-md-0">
                                                                                        <h5 className="mb-3 text-truncate">
                                                                                            <Link to={`/${product.productId}`} className="text-dark">{product.productname}</Link>
                                                                                        </h5>
                                                                                        <div className="text-muted mb-3">
                                                                                            <StarRatings
                                                                                                rating={product.starRating}
                                                                                                starRatedColor="#F1B44C"
                                                                                                starEmptyColor="#2D363F"
                                                                                                numberOfStars={5}
                                                                                                name='rating'
                                                                                                starDimension="14px"
                                                                                                starSpacing="3px"
                                                                                            />
                                                                                        </div>
                                                                                        
                                                                                        <h5 className="my-0">
                                                                                            <span className="text-muted mr-2">
                                                                                                <del>
                                                                                                    {Number(product.pastprice) > Number(product.currentprice) ? '$'+ product.pastprice + ' USD': ''}
                                                                                                </del>
                                                                                            </span> <b>{'$'+ product.currentprice + ' USD'}</b>
                                                                                        </h5>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </Link>
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                        )
                                                    }
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            )
                        }

                    </Container>
               )}
            </div>
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(stateWrapper(StoreProductDetail)));