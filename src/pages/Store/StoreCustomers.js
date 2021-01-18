import React, { useEffect, useState} from 'react';
import { Container, Row, Col, Card, CardBody, Table, Input, Badge, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import * as _ from 'lodash';

import stateWrapper from '../../containers/provider';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';


const StoreCustomers = props => {

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
            let result = await props.masterStore.getCustomers({
                storeId: storeId
            });

            if (_.isEmpty(result) || _.isUndefined(result)) {
                setCustomers([]);
                setTotalSize(0);
                return;
            } else {
                setCustomers(result.data)
                setTotalSize(result?.totalSize);
                console.log(result);
                console.log("Properties of this component", props);
            }
        })();
    }, []);

    const [state, setState] = useState({
        isLoading: true
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

    const [customers, setCustomers] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const [active, setActive] = useState(0);

    const getPage = async (page) => {
        let options = {
            id: storeId, //If the value is '' it would return all the products
            startAt: page * pageTracker.limit,
            limit: pageTracker.limit,
        }

        let result = await props.masterStore.getCustomers(options);

        if (_.isEmpty(result) || _.isUndefined(result)) {
            setCustomers([])
            setTotalSize(0);
            return;
        }

        setCustomers(result.data)
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
                    <div className="page-content">
                        <Container fluid>

                            <Breadcrumbs title={storeId} breadcrumbItem="Customers" />
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
                                                            <th>Email/Phone</th>
                                                            <th>Address</th>
                                                            <th>Buy Times</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {customers.map((item,idx) => {
                                                            return (
                                                                <tr>
                                                                    <td>
                                                                        <p className="mb-1">{item?.history[0]?.shipping?.phone}</p>
                                                                        <p className="mb-0">{item.customer}</p>
                                                                    </td>

                                                                    <td>
                                                                        {item?.history[0]?.shipping?.address} <br/>
                                                                        {item?.history[0]?.shipping?.state} <br/>
                                                                        {item?.history[0]?.shipping?.country}
                                                                    </td>
                                                                    <td>
                                                                        <Badge 
                                                                            color="success" 
                                                                            className="font-size-12"
                                                                        >
                                                                            <i className="mdi mdi-star mr-1"></i> {item?.history.length}
                                                                        </Badge>
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

                        </Container>
                    </div>
                )
            }
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(stateWrapper(StoreCustomers)));