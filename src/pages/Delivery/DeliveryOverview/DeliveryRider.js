import React, { useState } from "react";

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";

import stateWrapper from '../../../containers/provider';
import { withRouter } from 'react-router-dom';

//i18n
import { withTranslation } from 'react-i18next';

const MonthlyEarning  = props => {
    const [state, setState] = useState({});

    return (
        <React.Fragment> <Card>
            <CardBody>
                <CardTitle className="mb-4">
                    Your Delivery Rider
                </CardTitle>
                <Row>
                    <Col sm="12" md="6">
                        <img src={props.userStore.state.delivery?.imageUrl} alt="" className="img-thumbnail rounded-circle" style={{width: '100px', height: '100px'}} />
                    </Col>
                    <Col sm="12" md="6">
                        <h4>{props.userStore.state.delivery?.name}</h4>
                        <h6>{props.userStore.state.delivery?.email}</h6>
                    </Col>
                </Row>
            </CardBody>
        </Card>
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(stateWrapper(MonthlyEarning)));