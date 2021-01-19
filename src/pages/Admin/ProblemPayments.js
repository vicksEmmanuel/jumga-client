import React, { useEffect, useState} from 'react';
import { Container, Row, Col, Input, Button, Card, CardBody, Table, Label, Badge, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Pagination, PaginationItem, PaginationLink } from "reactstrap";

import * as _ from 'lodash';

import stateWrapper from '../../containers/provider';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import wNumb from 'wnumb';


//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';


const ProblemPayments = props => {

    const [isLoading, setLoading] = useState(true);

    const moneyFormat = wNumb({
        decimals: 2,
        mark: '.',
        thousand: ',',
        prefix: props.paymentStore.state.currency.code
    });


    useEffect(() => {
        if(!_.isNull(props.userStore.state.user)) {
            if (props.userStore.state.user?.userType !== 'Admin') return props.history.push('/');
            setLoading(false);
        }
    }, [props.userStore.state.user]);

    useEffect(() => {
        (async () => {
            let result = await props.masterStore.getProblemPayment();

            if (_.isEmpty(result) || _.isUndefined(result)) {
                setProblemPayment([]);
                setTotalSize(0);
                return;
            } else {
                setProblemPayment(result.data)
                setTotalSize(result?.totalSize);
            }
        })();
    }, []);

    const [state, setState] = useState({
        isLoading: true,
        modal: false,
        currentOrderInModal: false
    });

    const togglemodal = (order) => {
        setState({
            ...state,
            currentOrderInModal: order,
            modal: !state.modal
        });
    }

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

    const [problemPayment, setProblemPayment] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const [active, setActive] = useState(0);

    const getPage = async (page) => {
        let options = {
            startAt: page * pageTracker.limit,
            limit: pageTracker.limit,
        }

        let result = await props.masterStore.getProblemPayment(options);

        if (_.isEmpty(result) || _.isUndefined(result)) {
            setProblemPayment([])
            setTotalSize(0);
            return;
        }

        setProblemPayment(result.data)
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

    const closeModal = () => {
        setState({
            ...state,
            modal: !state.modal
        });
    }


    return (
        <React.Fragment>
            {
                isLoading ? (
                    <div style={{position: 'fixed', top: '0%', width: '100%', height: '100%', left: '0%', zIndex: 5000, backgroundColor: 'rgba(0,0,0,0.4)'}}>
                        <div style={{position: 'relative', top: '45%', left: '43%'}}>
                            <div className="lds-ring-x"><div></div><div></div><div></div><div></div></div>
                        </div>
                    </div>
                ) : (
                    <div className="page-content">
                        <Container fluid>

                            <Breadcrumbs title={"Payment Issues"} breadcrumbItem="" />
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
                                                <Table className="table-centered table-nowrap">
                                                    <thead>
                                                        <tr>
                                                            <th>PaymentRef</th>
                                                            <th>Email</th>
                                                            <th>amount to be paid</th>
                                                            <th>amount paid</th>
                                                            <th>View Details</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {problemPayment.map((item,idx) => {
                                                            return (
                                                                <tr>
                                                                    <td>
                                                                        <p className="mb-0">{item?.paymentRefData?.paymentRef}</p>
                                                                    </td>
                                                                    <td>
                                                                        <p className="mb-0">{item?.paymentRefData?.email}</p>
                                                                    </td>
                                                                    <td>
                                                                        <p className="mb-0">{item?.paymentRefData?.amount}</p>
                                                                    </td>
                                                                    <td>
                                                                        <p className="mb-0">{item?.flutterwaveData?.amount}</p>
                                                                    </td>
                                                                    <td>
                                                                        <Button 
                                                                            type="button" 
                                                                            color="primary" 
                                                                            className="btn-sm btn-rounded" 
                                                                            onClick={() => {togglemodal(item)}}
                                                                        >
                                                                            View Details
                                                                        </Button>
                                                                    </td>
                                                                    <td>
                                                                        {item?.resolved == false ? (
                                                                            <Button 
                                                                                type="button" 
                                                                                color="success" 
                                                                                className="btn-sm btn-rounded" 
                                                                                onClick={() => {alert("Not functional yet")}}
                                                                            >
                                                                                Resolve
                                                                            </Button>
                                                                        ) : (
                                                                            <div>Resolved!!</div>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </div>
                                            {setUpPagination(totalSize)}
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>

                            <Modal isOpen={state.modal} role="dialog" autoFocus={true} centered={true} className="exampleModal" tabindex="-1" toggle={closeModal}>
                                <div className="modal-content">
                                    <ModalHeader toggle={closeModal}>
                                        Payment Issues
                                        </ModalHeader >
                                    <ModalBody>
                                        <p className="mb-2">Payment Issue Id: <span className="text-primary">{state.currentOrderInModal?.id}</span></p>
                                        <p className="mb-4">Payment Ref: <span className="text-primary">{state.currentOrderInModal?.paymentRefData?.paymentRef}</span></p>

                                        {/* <div className="table-responsive">
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
                                        </div> */}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button type="button" color="secondary" onClick={closeModal}>Close</Button>
                                    </ModalFooter>
                                </div>
                            </Modal>
                        </Container>
                    </div>
                )
            }
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(stateWrapper(ProblemPayments)));