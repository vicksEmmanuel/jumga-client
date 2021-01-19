import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Input, Button, Card, CardBody, Table, Label, Badge, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import * as _ from 'lodash';
import moment from 'moment';
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import stateWrapper from '../../containers/provider';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

const StoreOrders = props => {

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
            let result = await props.masterStore.getOrders({
                storeId: storeId
            });

            if (_.isEmpty(result) || _.isUndefined(result)) {
                setOrders([]);
                setTotalSize(0);
                return;
            } else {
                setOrders(result.data)
                setTotalSize(result?.totalSize);
                console.log(result);
                console.log("Properties of this component", props);
            }
        })();
    }, []);

    const [state, setState] = useState({
        isLoading: true,
        currentOrderInModal: {},
        modal: false,
    });

    useEffect(() => {
        setTimeout(() => {
            setState({...state, isLoading: false})
        }, 3000)
    }, [])

     
    let [pageTracker, setPageTracker] = useState({
        limit: 10,
        to: 6,
        from: 1,
        tracker: 1,
        holder: 0,
        startAt: 0,
    })

    const [orders, setOrders] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const [active, setActive] = useState(0);

    const getPage = async (page) => {
        let options = {
            id: storeId, //If the value is '' it would return all the products
            startAt: page * pageTracker.limit,
            limit: pageTracker.limit,
        }

        let result = await props.masterStore.getOrders(options);

        if (_.isEmpty(result) || _.isUndefined(result)) {
            setOrders([])
            setTotalSize(0);
            return;
        }

        setOrders(result.data)
        setTotalSize(result?.totalSize);
    }

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

    const togglemodal = (order) => {
        setState({
            ...state,
            currentOrderInModal: order,
            modal: !state.modal
        });
    }
    const closeModal = () => {
        setState({
            ...state,
            modal: !state.modal
        });
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
                ) : (
                    <>
                        <div className="page-content">
                            <Container fluid>
                                <Breadcrumbs title={storeId} breadcrumbItem="Orders" />
                                <Row>
                                    <Col xs="12">
                                        <Card>
                                            <CardBody>
                                                <Row className="mb-2">
                                                    <Col sm="4">
                                                        <div className="search-box mr-2 mb-2 d-inline-block">
                                                            <div className="position-relative">
                                                                <Input type="text" className="form-control" placeholder="Search..." />
                                                                <i className="bx bx-search-alt search-icon"></i>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <div className="table-responsive">
                                                    <Table className="table table-centered table-nowrap">
                                                        <thead className="thead-light">
                                                            <tr>
                                                                <th>Order ID</th>
                                                                <th>Billing Email</th>
                                                                <th>Date</th>
                                                                <th>Sub Total</th>
                                                                <th>Delivery Status</th>
                                                                <th>View Details</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                orders.map((order, key) =>
                                                                    <tr key={"_order_" + key}>
                                                                        <td><Link to="#" className="text-body font-weight-bold">{order.id}</Link></td>
                                                                        <td>{order.email}</td>
                                                                        <td>
                                                                            {moment(order.orderDate).format('MMM ddd, YY')}
                                                                        </td>
                                                                        <td>
                                                                            ${order.totalCostOfSales}
                                                                        </td>
                                                                        <td>
                                                                            <Badge 
                                                                                className={"font-size-12 badge-soft-" + order.isDelivered? order.refunded? 'danger':'success': 'warning'} 
                                                                                color={order.isDelivered? order.refunded? 'danger':'success': 'warning'} 
                                                                                pill
                                                                            >{order.isDelivered? order.refunded? 'Refunded':'Delivered': 'Not Delivered'}
                                                                            </Badge>
                                                                        </td>
                                                                        <td>
                                                                            <Button 
                                                                                type="button" 
                                                                                color="primary" 
                                                                                className="btn-sm btn-rounded" 
                                                                                onClick={() => {togglemodal(order)}}
                                                                            >
                                                                                View Details
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }

                                                        </tbody>
                                                    </Table>
                                                </div>
                                                {setUpPagination(totalSize)}
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                        </div>

                        <Modal isOpen={state.modal} role="dialog" autoFocus={true} centered={true} className="exampleModal" tabindex="-1" toggle={closeModal}>
                            <div className="modal-content">
                                <ModalHeader toggle={closeModal}>
                                    Order Details
                                    </ModalHeader >
                                <ModalBody>
                                    <p className="mb-2">Product id: <span className="text-primary">{state.currentOrderInModal?.id}</span></p>
                                    <p className="mb-4">Billing Email: <span className="text-primary">{state.currentOrderInModal?.email}</span></p>

                                    <div className="table-responsive">
                                        <Table className="table table-centered table-nowrap">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Product</th>
                                                    <th scope="col">Product Name</th>
                                                    <th scope="col">Price</th>
                                                </tr>
                                            </thead>
                                           {_.isEmpty(state.currentOrderInModal) ? <></> : (
                                                <tbody>
                                                <tr>
                                                    <th scope="row">
                                                        <div>
                                                            <img src={state.currentOrderInModal?.images[0]} alt="" className="avatar-sm" />
                                                        </div>
                                                    </th>
                                                    <td>
                                                        <div>
                                                            <h5 className="text-truncate font-size-14">
                                                                {state.currentOrderInModal?.productname} &nbsp;
                                                                <>
                                                                    {
                                                                        state.currentOrderInModal?.variation ? (
                                                                            <>
                                                                                {state.currentOrderInModal?.variation?.key} :   ({state.currentOrderInModal?.variation?.value})
                                                                            </>
                                                                        ) : (<></>)
                                                                    }
                                                                </>
                                                            </h5>
                                                            <p className="text-muted mb-0">$ {state.currentOrderInModal?.currentprice} x {state.currentOrderInModal?.quantity}</p>
                                                        </div>
                                                    </td>
                                                    <td>$ {state.currentOrderInModal?.totalCostOfSales}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <h6 className="m-0 text-right">Sub Total:</h6>
                                                    </td>
                                                    <td>
                                                        $ {state.currentOrderInModal?.totalCostOfSales}
                                                        </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <h6 className="m-0 text-right">Shipping:</h6>
                                                    </td>
                                                    <td>
                                                        { state.currentOrderInModal?.totalCostOfDelivery <= 0 ? 'Free' : `$ ${state.currentOrderInModal?.totalCostOfDelivery}`}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <h6 className="m-0 text-right">Total:</h6>
                                                    </td>
                                                    <td>
                                                        $ {Number(state.currentOrderInModal?.totalCostOfSales) + Number(state.currentOrderInModal?.totalCostOfDelivery)}
                                                        </td>
                                                </tr>
                                            </tbody>
                                           )}
                                        </Table>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type="button" color="secondary" onClick={closeModal}>Close</Button>
                                </ModalFooter>
                            </div>
                        </Modal>           
                    </>
                )
            }
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(stateWrapper(StoreOrders)));
