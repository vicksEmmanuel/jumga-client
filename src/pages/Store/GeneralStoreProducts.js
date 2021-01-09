import React, { useEffect, useState } from 'react';
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

const GeneralStoreProducts = props => {
    const searchId = props.match.params?.id || '';
    const [products, setProducts] = useState([]);
    const [totalSize, setTotalSize] = useState(0);

    const calculatePercentage = (newPrice, oldPrice) => {
        const difference = Number(oldPrice) - Number(newPrice);
        return Math.round((difference / oldPrice) * 100);
    }

    console.log(searchId);

    const loadData = () => {
        (async () => {
            let result = await props.masterStore.searchForId({
                id: searchId, //If the value is '' it would return all the products
            });

            setProducts(result.data)
            setTotalSize(result?.totalSize);
            console.log(result);
            console.log("Properties of this component", props);
        })();
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadData();
    }, [searchId])

    const [state, setState] = useState({
        isLoading: true,
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
                    <Breadcrumbs title="Products" breadcrumbItem={searchId} />
                    <Row>
                        <Col lg="3">
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">
                                        Filter
                                    </CardTitle>
                                    <div>
                                        <h5 className="font-size-14 mb-3">Clothes</h5>
                                        {/* Render Cloth Categories */}
                                        <ul className="list-unstyled product-list">
                                            {
                                                state.FilterClothes.map((cloth, key) =>
                                                    <li key={"_li_" + key}><Link to={cloth.link}><i className="mdi mdi-chevron-right mr-1"></i>{cloth.name}</Link></li>
                                                )
                                            }
                                        </ul>
                                    </div>
                                    <div className="mt-4 pt-3">
                                        <h5 className="font-size-14 mb-4">Price</h5>
                                        <br />

                                        <Nouislider range={{ min: 0, max: 600 }} tooltips={true} start={[100, 500]} connect />

                                    </div>

                                    <div className="mt-4 pt-3">
                                        <h5 className="font-size-14 mb-3">Discount</h5>
                                        <div className="custom-control custom-checkbox mt-2">
                                            <Input type="checkbox" value="0" className="custom-control-input" id="productdiscountCheck1" />
                                            <Label className="custom-control-label" htmlFor="productdiscountCheck1">Less than 10%</Label>
                                        </div>
                                        <div className="custom-control custom-checkbox mt-2">
                                            <Input type="checkbox" value="1" className="custom-control-input" id="productdiscountCheck2" />
                                            <Label className="custom-control-label" htmlFor="productdiscountCheck2">10% or more</Label>
                                        </div>
                                        <div className="custom-control custom-checkbox mt-2">
                                            <Input type="checkbox" value="2" className="custom-control-input" id="productdiscountCheck3" defaultChecked />
                                            <Label className="custom-control-label" htmlFor="productdiscountCheck3">20% or more</Label>
                                        </div>
                                        <div className="custom-control custom-checkbox mt-2">
                                            <Input type="checkbox" value="3" className="custom-control-input" id="productdiscountCheck4" />
                                            <Label className="custom-control-label" htmlFor="productdiscountCheck4">30% or more</Label>
                                        </div>
                                        <div className="custom-control custom-checkbox mt-2">
                                            <Input type="checkbox" value="4" className="custom-control-input" id="productdiscountCheck5" />
                                            <Label className="custom-control-label" htmlFor="productdiscountCheck5">40% or more</Label>
                                        </div>
                                        <div className="custom-control custom-checkbox mt-2">
                                            <Input type="checkbox" value="5" className="custom-control-input" id="productdiscountCheck6" />
                                            <Label className="custom-control-label" htmlFor="productdiscountCheck6">50% or more</Label>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3">
                                        <h5 className="font-size-14 mb-3">Customer Rating</h5>
                                        <div>
                                            <div className="custom-control custom-checkbox mt-2">
                                                <Input type="checkbox" className="custom-control-input" id="productratingCheck1" />
                                                <Label className="custom-control-label" htmlFor="productratingCheck1">4 <i className="bx bx-star text-warning"></i>  & Above</Label>
                                            </div>
                                            <div className="custom-control custom-checkbox mt-2">
                                                <Input type="checkbox" className="custom-control-input" id="productratingCheck2" />
                                                <Label className="custom-control-label" htmlFor="productratingCheck2">3 <i className="bx bx-star text-warning"></i>  & Above</Label>
                                            </div>
                                            <div className="custom-control custom-checkbox mt-2">
                                                <Input type="checkbox" className="custom-control-input" id="productratingCheck3" />
                                                <Label className="custom-control-label" htmlFor="productratingCheck3">2 <i className="bx bx-star text-warning"></i>  & Above</Label>
                                            </div>
                                            <div className="custom-control custom-checkbox mt-2">
                                                <Input type="checkbox" className="custom-control-input" id="productratingCheck4" />
                                                <Label className="custom-control-label" htmlFor="productratingCheck4">1 <i className="bx bx-star text-warning"></i></Label>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col lg="9">
                            
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

export default withRouter(withTranslation()(stateWrapper(GeneralStoreProducts)));