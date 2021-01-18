import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Input, Button, Card, CardBody, Table, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import * as _ from 'lodash';
import moment from 'moment';
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import stateWrapper from '../../containers/provider';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';


const ListOrder = props => {
    const order = props.order;
    const key = props.key;
    const [state, setState] = useState({
        notClicked: false,
        order
    });

    const sendToDeliveryTeam = () => {
        let x = state.order;
        x.isSentToDeliveryTeam = true;
        setState({...state, notClicked: true, order: x});
        props.sendToDeliveryTeam(order);
    }

    const delivered = () => {
        let x = state.order;
        x.isDelivered = true;
        setState({...state, notClicked: true, order: x});
        props.delivered(order);
    }

    const setButton = pop => {
        return (
            <>
                {
                    !pop.isSentToDeliveryTeam ? (
                        <Button 
                            type="button" 
                            color="warning" 
                            className="btn-sm btn-rounded" 
                            onClick={() => {
                                sendToDeliveryTeam();
                            }}
                        >
                            Send to Delivery Team
                        </Button>
                    ) : (<>{
                        !pop.isDelivered ? (
                            <Button 
                                type="button" 
                                color="success" 
                                className="btn-sm btn-rounded" 
                                onClick={async () => {
                                    await delivered();
                                }}
                            >
                                Delivered ?
                            </Button>
                        ) : <>Delivered!</>
                    }</>)
                }
            </>
        )
    }

    return (
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
                    onClick={() => {props.togglemodal(order)}}
                >
                    View Details
                </Button>
            </td>
            <td>
                {setButton(state.order)}
            </td>
        </tr>
    )
}

const AdminOrders = props => {

    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        if(!_.isNull(props.userStore.state.user)) {
            if (props.userStore.state.user?.userType !== 'Admin') return props.history.push('/');
            setLoading(false);
        }
    }, [props.userStore.state.user]);

    useEffect(() => {
        (async () => {
            let result = await props.masterStore.adminGetOrders({});

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
            startAt: page * pageTracker.limit,
            limit: pageTracker.limit,
        }

        let result = await props.masterStore.adminGetOrders(options);

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
                                <Breadcrumbs title="Orders" breadcrumbItem="" />
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
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                orders.map((order, key) =>
                                                                    <ListOrder 
                                                                        sendToDeliveryTeam={props.masterStore.sendToDeliveryTeam} 
                                                                        order={order} key={key} 
                                                                        togglemodal={togglemodal} 
                                                                        delivered={props.masterStore.delivered}
                                                                    />
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
                                                            <p className="text-muted mb-0"> (${state.currentOrderInModal?.currentprice} x {state.currentOrderInModal?.quantity}) x (${state.currentOrderInModal?.deliverycost} shipping  x {state.currentOrderInModal?.quantity})</p>
                                                        </div>
                                                    </td>
                                                    <td>$ {Number(state.currentOrderInModal?.total) + (Number(state.currentOrderInModal?.deliverycost) * Number(state.currentOrderInModal?.quantity))}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <h6 className="m-0 text-right">Item(s) Price:</h6>
                                                    </td>
                                                    <td>
                                                        $ {state.currentOrderInModal?.totalCostOfSales}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <h6 className="m-0 text-right">Jumga's Commission From Sale:</h6>
                                                    </td>
                                                    <td>
                                                        $ {state.currentOrderInModal?.totalCostOfCommissionOnSales}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td colspan="2">
                                                        <h6 className="m-0 text-right">Shipping Cost:</h6>
                                                    </td>
                                                    <td>
                                                        { state.currentOrderInModal?.totalCostOfDelivery <= 0 ? 'Free' : `$ ${state.currentOrderInModal?.totalCostOfDelivery}`}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td colspan="2">
                                                        <h6 className="m-0 text-right">Jumga's Shipping Commission:</h6>
                                                    </td>
                                                    <td>
                                                        { state.currentOrderInModal?.totalcostOfCommissionOnDelivery <= 0 ? 'Free' : `$ ${state.currentOrderInModal?.totalcostOfCommissionOnDelivery}`}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td colspan="2">
                                                        <h6 className="m-0 text-right">Total:</h6>
                                                    </td>
                                                    <td>
                                                        $ {Number(state.currentOrderInModal?.totalCostOfSales) +Number(state.currentOrderInModal?.totalCostOfCommissionOnSales) +Number(state.currentOrderInModal?.totalCostOfDelivery) + Number(state.currentOrderInModal?.totalcostOfCommissionOnDelivery)}
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

export default withRouter(withTranslation()(stateWrapper(AdminOrders)));
