import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Form, Label, Input, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import * as _ from 'lodash';
import stateWrapper from '../../containers/provider';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import wNumb from 'wnumb';

//Import Star Ratings
import StarRatings from 'react-star-ratings';

// RangeSlider
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";



//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

const GeneralStoreProducts = props => {
    const searchId = props.match.params?.id || '';

    const moneyFormat = wNumb({
        decimals: 2,
        mark: '.',
        thousand: ',',
        prefix: props.paymentStore.state.currency.code
    });

    const calculatePercentage = (newPrice, oldPrice) => {
        const difference = Number(oldPrice) - Number(newPrice);
        return Math.round((difference / oldPrice) * 100);
    }

    const loadData = () => {
        (async () => {
            let result = await props.masterStore.searchForCategoriesProducts({
                id: searchId, //If the value is '' it would return all the products
            });
            console.log("Here ==", result);

            if (_.isEmpty(result) || _.isUndefined(result)) {
                setProducts([])
                setTotalSize(0);
                setState({...state, isLoading: false});
                return;
            }

            setProducts(result.data)
            setTotalSize(result?.totalSize);
            setState({...state, isLoading: false})
            console.log(result);

            console.log("Pagination counting", )
        })();
    }

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadData();
    }, [searchId])

    const getPage = async (page) => {
        let options = {
            id: searchId, //If the value is '' it would return all the products
            startAt: page * pageTracker.limit,
            limit: pageTracker.limit,
            filter: state.filter,
            filterPriceMinRange: state.filterPriceMinRange,
            filterPriceMaxRange: state.filterPriceMaxRange,
            filterDiscountRate: state.filterDiscountRate,
            filterCustomerRating: state.filterCustomerRating,
        }

        let result = await props.masterStore.searchForCategoriesProducts(options);

        if (_.isEmpty(result) || _.isUndefined(result)) {
            setProducts([])
            setTotalSize(0);
            return;
        }

        setProducts(result.data)
        setTotalSize(result?.totalSize);
    }

    const getDiscountFilter = () => {
        if (state.discount1) return 10;
        if (state.discount2) return 20;
        if (state.discount3) return 30;
        if (state.discount4) return 50;
        if (state.discount5) return 70;
        if (state.discount6) return 90;
    }

    const filterOut = async () => {
        let options = {
            id: searchId, //If the value is '' it would return all the products
            startAt: 0,
            limit: pageTracker.limit,
            filter: state.filter,
            filterPriceMinRange: moneyFormat.from(state.filterPriceMinRange) ? moneyFormat.from(state.filterPriceMinRange) / props.paymentStore.state.currency.pricePerDollar : 0,
            filterPriceMaxRange: moneyFormat.from(state.filterPriceMaxRange) ? moneyFormat.from(state.filterPriceMaxRange)  / props.paymentStore.state.currency.pricePerDollar : 1000000,
            filterDiscountRate: (state.discount1 || state.discount2 || state.discount3 || state.discount4 || state.discount5 || state.discount6)? getDiscountFilter() : state.filterDiscountRate,
            // filterCustomerRating: state.filterCustomerRating,
        }

        console.log(moneyFormat.from(state.filterPriceMaxRange));

        let result = await props.masterStore.searchForCategoriesProducts(options);

        if (_.isEmpty(result) || _.isUndefined(result)) {
            setProducts([])
            setTotalSize(0);
            return;
        }

        setProducts(result.data)
        setTotalSize(result?.totalSize);
    }

    const [state, setState] = useState({
        isLoading: true,
        startAt: 0,
        filter: false,
        filterPriceMinRange: 0,
        filterPriceMaxRange: 1000000000,
        filterDiscountRate: 50,
        filterCustomerRating: 5,
        activeTab: '1',
        discount1: false,
        discount2: false,
        discount3: false,
        discount4: false,
        discount5: false,
        discount6: false,
    });
    
    let [pageTracker, setPageTracker] = useState({
        limit: 10,
        to: 6,
        from: 1,
        tracker: 1,
        holder: 0
    })

    const [products, setProducts] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const [active, setActive] = useState(0);

    const setUpPagination = numOfPages => {
        if (numOfPages <= 0) return;

        const pagination = Math.ceil(numOfPages/pageTracker.limit);

        return (
            <Pagination className="pagination pagination-rounded justify-content-center mt-4">
                <PaginationItem 
                    disabled={active <= 0}
                    onClick={async () => {
                        if(active <= 0) {
                            return;
                        }
                        let activeCopy = active;
                        await setActive(active - 1);
                        await getPage(activeCopy - 1 );
                    }}
                >
                    <PaginationLink previous/>
                </PaginationItem>
                {new Array(pagination).fill(null).map((i, idx) => {
                    return (
                        <PaginationItem 
                            active={idx == active}
                            key={idx}
                            onClick={async () => {
                                // await getPage({
                                //     collection: 'articles', 
                                //     page: i - 1, 
                                //     query: searchText
                                // });
                                await setActive(idx);
                            }}
                        >
                            <PaginationLink>
                                {idx + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })}
                <PaginationItem 
                    disabled={(active >= pagination - 1) || numOfPages <= pageTracker.limit}
                    onClick={async () => {
                        if ((active >= pagination - 1) || (numOfPages <= pageTracker.limit)) {
                            return;
                        }
                        let activeCopy = active;
                        await setActive(activeCopy + 1);
                        await getPage(activeCopy + 1);
                    }}
                >
                    <PaginationLink next />
                </PaginationItem>
            </Pagination>
        )

    }

    return (
        <React.Fragment>
            {
                state.isLoading ? (
                    <div style={{position: 'fixed', top: '0%', width: '100%', height: '100%', left: '0%', zIndex: 5000, backgroundColor: 'rgba(0,0,0,0.4)'}}>
                        <div style={{position: 'relative', top: '45%', left: '43%'}}>
                            <div className="lds-ring-x"><div></div><div></div><div></div><div></div></div>
                        </div>
                    </div>
                ) :
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumbs title="Products" breadcrumbItem={searchId} />
                        <Row>
                            <Col lg="3">
                                <Card>
                                    <CardBody>
                                        <CardTitle className="mb-4">
                                            <Row>
                                                <Col lg="8" md="9" sm="6" xs="6">Filter</Col>
                                                <Col lg="4" md="3" sm="6" xs="6" align="right">
                                                    <button onClick={filterOut} className="btn btn-warning" style={{fontSize: 11, borderRadius: 20}}>Apply</button>
                                                </Col>
                                            </Row>
                                        </CardTitle>
                                        <div className="mt-4 pt-3">
                                            <h5 className="font-size-14 mb-4">Price</h5>
                                            <br />

                                            <Nouislider 
                                                range={{ min: 0, max: 4000000 }} 
                                                tooltips={true} 
                                                start={[0, 4000000]} 
                                                connect 
                                                onChange={ e => {
                                                    setState({...state, filter: true, filterPriceMinRange: e[0], filterPriceMaxRange: e[1]})
                                                }} 
                                                format={ moneyFormat} 
                                            />

                                        </div>

                                        <div className="mt-4 pt-3">
                                            <h5 className="font-size-14 mb-3">Discount</h5>
                                            <div className="custom-control custom-checkbox mt-2">
                                                <Input 
                                                    checked={state.discount1} 
                                                    type="checkbox" 
                                                    value="0" 
                                                    className="custom-control-input" 
                                                    id="productdiscountCheck1" 
                                                    onChange={e => setState({...state, discount1: !state.discount1, discount2: false, discount3: false, discount4: false, discount5: false, discount6: false})}
                                                />
                                                <Label className="custom-control-label" htmlFor="productdiscountCheck1">Less than 10%</Label>
                                            </div>
                                            <div  className="custom-control custom-checkbox mt-2">
                                                <Input 
                                                    type="checkbox" 
                                                    checked={state.discount2}
                                                    value="1" 
                                                    className="custom-control-input" 
                                                    id="productdiscountCheck2" 
                                                    onChange={e => setState({...state, discount2: !state.discount2, discount1: false, discount3: false, discount4: false, discount5: false, discount6: false})} 
                                                />
                                                <Label className="custom-control-label" htmlFor="productdiscountCheck2">10% or more</Label>
                                            </div>
                                            <div  className="custom-control custom-checkbox mt-2">
                                                <Input 
                                                    checked={state.discount3}
                                                    type="checkbox" 
                                                    value="2" 
                                                    className="custom-control-input" 
                                                    id="productdiscountCheck3" 
                                                    onChange={e => setState({...state, discount3: !state.discount3, discount2: false, discount1: false, discount4: false, discount5: false, discount6: false})}/>
                                                <Label className="custom-control-label" htmlFor="productdiscountCheck3">20% or more</Label>
                                            </div>
                                            <div 
                                                checked={state.discount4} 
                                                className="custom-control custom-checkbox mt-2">
                                                <Input 
                                                    checked={state.discount4} 
                                                    type="checkbox" 
                                                    value="3" 
                                                    className="custom-control-input" 
                                                    id="productdiscountCheck4" 
                                                    onChange={e => setState({...state, discount4: !state.discount4, discount2: false, discount3: false, discount1: false, discount5: false, discount6: false})}
                                                />
                                                <Label className="custom-control-label" htmlFor="productdiscountCheck4">30% or more</Label>
                                            </div>
                                            <div  className="custom-control custom-checkbox mt-2">
                                                <Input 
                                                    type="checkbox" 
                                                    value="4" 
                                                    checked={state.discount5}
                                                    className="custom-control-input" 
                                                    id="productdiscountCheck5" 
                                                    onChange={e => setState({...state, discount5: !state.discount5, discount2: false, discount3: false, discount4: false, discount1: false, discount6: false})}
                                                 />
                                                <Label className="custom-control-label" htmlFor="productdiscountCheck5">40% or more</Label>
                                            </div>
                                            <div  className="custom-control custom-checkbox mt-2">
                                                <Input 
                                                    type="checkbox" 
                                                    value="5" 
                                                    checked={state.discount6}
                                                    className="custom-control-input" 
                                                    id="productdiscountCheck6" 
                                                    onChange={e => setState({...state, discount6: !state.discount6, discount2: false, discount3: false, discount4: false, discount5: false, discount1: false})}
                                                />
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
                                                <Col md="12">
                                                    <Card>
                                                        <CardBody>
                                                            <h4 className="mt-1 mb-3 text-center">No Poducts with such name or Categories exist</h4>
                                                            <div className="mt-5 text-center">
                                                                <Link 
                                                                    className="btn btn-success waves-effect waves-light" 
                                                                    to="#"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        props.history.goBack();
                                                                    }}
                                                                >Go Back</Link>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
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
                                                                <h5 className="my-0"><span className="text-muted mr-2"><del>{props.paymentStore.formatToIntCurrency(product?.pastprice)}</del></span> <b>{props.paymentStore.formatToIntCurrency(product?.currentprice)}</b></h5>
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
                                        {setUpPagination(totalSize)}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </div>
            }
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(stateWrapper(GeneralStoreProducts)));