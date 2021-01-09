import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { Container, Row, Col, Card, CardBody, CardTitle, Form, Label, Input, Nav, NavItem, NavLink, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import classnames from 'classnames';
import stateWrapper from '../../containers/provider';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

//Import Star Ratings
import StarRatings from 'react-star-ratings';

// RangeSlider
import "nouislider/distribute/nouislider.css";


//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

const StoreProducts = props => {
    const [products, setProducts] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const calculatePercentage = (newPrice, oldPrice) => {
        const difference = Number(oldPrice) - Number(newPrice);
        return Math.round((difference / oldPrice) * 100);
    }
    const storeId = props.match.params?.id;
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
        setState({...state, isLoading: false});
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
            }
        });
    }, []);

    useEffect(() => {
        (async () => {
            let result = await props.masterStore.getProducts({
                storeId: storeId
            });
            setProducts(result.data)
            setTotalSize(result?.totalSize);
            console.log(result);
            console.log("Properties of this component", props);
        })();
    }, []);

    const [state, setState] = useState({
        isLoading: true
    });

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title={storeId} breadcrumbItem="Product" />
                    <Row>
                        <Col lg="12">

                            <Row className="mb-3">
                                <Col xl="4" sm="6">
                                    <div className="mt-2">
                                    </div>
                                </Col>
                                <Col lg="8" sm="6">
                                    <Form className="mt-4 mt-sm-0 float-sm-right form-inline">
                                        <div className="search-box mr-2">
                                            <div className="position-relative">
                                                <Input type="text" className="form-control border-0" placeholder="Search..." />
                                                <i className="bx bx-search-alt search-icon"></i>
                                            </div>
                                        </div>
                                        {/* <Nav className="product-view-nav" pills>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({ active: state.activeTab === '1' })}
                                                    onClick={() => { toggleTab('1'); }}
                                                >
                                                    <i className="bx bx-grid-alt"></i>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({ active: state.activeTab === '2' })}
                                                    onClick={() => { toggleTab('2'); }}
                                                >
                                                    <i className="bx bx-list-ul"></i>
                                                </NavLink>
                                            </NavItem>
                                        </Nav> */}
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                {
                                    products.length <= 0
                                      ? (
                                        <Row>
                                            <Col md="3"></Col>
                                            <Col md="6">
                                                <Card>
                                                <CardBody>
                                                    <h4 className="mt-1 mb-3">No Poducts as been added</h4>
                                                </CardBody>
                                            </Card>
                                            </Col>
                                            <Col md="3"></Col>
                                        </Row>
                                      ) : products.map((product, key) =>
                                        <Col xl="3" sm="4" key={"_col_" + key}>
                                            <Link to={`/${product?.productId}`}>
                                                <Card>
                                                    <CardBody>
                                                        <div className="product-img position-relative">
                                                            {
                                                                Number(product?.currentprice) < Number(product?.pastprice)
                                                                    ? <div className="avatar-sm product-ribbon">
                                                                        <span className="avatar-title rounded-circle  bg-primary">
                                                                            {calculatePercentage(product?.currentprice, product?.pastprice) + "%"}
                                                                        </span>
                                                                    </div>
                                                                    : null
                                                            }

                                                            <img src={product?.images[0]} alt="" className="img-fluid mx-auto d-block"  style={{height: 150}}/>
                                                        </div>
                                                        <div className="mt-4 text-center">
                                                            <h5 className="mb-3 text-truncate"><Link to={"/" + product?.productId} className="text-dark">{product?.productname} </Link></h5>
                                                            <div className="text-muted mb-3">
                                                                <StarRatings
                                                                    rating={product?.starRating}
                                                                    starRatedColor="#F1B44C"
                                                                    starEmptyColor="#2D363F"
                                                                    numberOfStars={5}
                                                                    name='rating'
                                                                    starDimension="14px"
                                                                    starSpacing="3px"
                                                                />
                                                            </div>
                                                            <h5 className="my-0"><span className="text-muted mr-2"><del>${product?.pastprice}</del></span> <b>${product?.currentprice}</b></h5>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Link>
                                        </Col>
                                    )
                                }
                            </Row>
                            <Row>
                                <div className="flex-center">{
                                    totalSize > 0 ? (
                                      <span className="w-100">
                                          Displaying 1 {products.length === 1 ? null : `to ${products.length}`} of {totalSize} item(s)
                                      </span>
                                    ) : null
                                }</div>
                            </Row>
                            <Row>
                                <Col lg="12">
                                    <Pagination className="pagination pagination-rounded justify-content-center">
                                        <PaginationItem disabled>
                                            <PaginationLink previous href="#" />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">
                                                1
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem active>
                                            <PaginationLink href="#">
                                                2
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">
                                                3
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">
                                                4
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">
                                                5
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink next href="#" />
                                        </PaginationItem>
                                    </Pagination>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(stateWrapper(StoreProducts)));
