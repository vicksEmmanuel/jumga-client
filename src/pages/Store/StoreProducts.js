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
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";


//Import Product Images
import product1 from "../../assets/images/product/img-1.png";
import product2 from "../../assets/images/product/img-2.png";
import product3 from "../../assets/images/product/img-3.png";
import product4 from "../../assets/images/product/img-4.png";
import product5 from "../../assets/images/product/img-5.png";
import product6 from "../../assets/images/product/img-6.png";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

const StoreProducts = props => {

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

    const [state, setState] = useState({
        FilterClothes: [
            { id: 1, name: "T-shirts", link: "#" },
            { id: 2, name: "Shirts", link: "#" },
            { id: 3, name: "Jeans", link: "#" },
            { id: 4, name: "Jackets", link: "#" },
        ],
        Products: [
            { id: 1, image: product1, name: "Half sleeve T-shirt", link: "#", rating: 5, oldPrice: 500, newPrice: 450, isOffer: true, offer: -25 },
            { id: 2, image: product2, name: "Light blue T-shirt", link: "#", rating: 4, oldPrice: 240, newPrice: 225, isOffer: false, offer: 0 },
            { id: 3, image: product3, name: "Black Color T-shirt", link: "#", rating: 4, oldPrice: 175, newPrice: 152, isOffer: true, offer: -20 },
            { id: 4, image: product4, name: "Hoodie (Blue)", link: "#", rating: 4, oldPrice: 150, newPrice: 145, isOffer: false, offer: 0 },
            { id: 5, image: product5, name: "Half sleeve T-Shirt", link: "#", rating: 4, oldPrice: 145, newPrice: 138, isOffer: true, offer: -22 },
            { id: 6, image: product6, name: "Green color T-shirt", link: "#", rating: 4, oldPrice: 138, newPrice: 135, isOffer: true, offer: -28 },
        ],
        activeTab: '1',
    });

    const toggleTab = (tab) => {
        if (state.activeTab !== tab) {
            setState({
                activeTab: tab
            });
        }
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Ecommerce" breadcrumbItem="Product" />
                    <Row>
                        <Col lg="12">

                            <Row className="mb-3">
                                <Col xl="4" sm="6">
                                    <div className="mt-2">
                                        <h5>Clothes</h5>
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
                                        <Nav className="product-view-nav" pills>
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
                                                    onClick={() => { this.toggleTab('2'); }}
                                                >
                                                    <i className="bx bx-list-ul"></i>
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                {
                                    state.Products.map((product, key) =>
                                        <Col xl="4" sm="6" key={"_col_" + key}>
                                            <Card>
                                                <CardBody>
                                                    <div className="product-img position-relative">
                                                        {
                                                            product.isOffer
                                                                ? <div className="avatar-sm product-ribbon">
                                                                    <span className="avatar-title rounded-circle  bg-primary">
                                                                        {product.offer + "%"}
                                                                    </span>
                                                                </div>
                                                                : null
                                                        }

                                                        <img src={product.image} alt="" className="img-fluid mx-auto d-block" />
                                                    </div>
                                                    <div className="mt-4 text-center">
                                                        <h5 className="mb-3 text-truncate"><Link to={"/ecommerce-product-detail/" + product.id} className="text-dark">{product.name} </Link></h5>
                                                        <div className="text-muted mb-3">
                                                            <StarRatings
                                                                rating={product.rating}
                                                                starRatedColor="#F1B44C"
                                                                starEmptyColor="#2D363F"
                                                                numberOfStars={5}
                                                                name='rating'
                                                                starDimension="14px"
                                                                starSpacing="3px"
                                                            />
                                                        </div>
                                                        <h5 className="my-0"><span className="text-muted mr-2"><del>${product.oldPrice}</del></span> <b>${product.newPrice}</b></h5>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    )
                                }
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