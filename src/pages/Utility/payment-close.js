import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

//Import Images
import thank from "../../assets/images/thank-you.jpg";

class PaymentClose extends Component {
    onClose() {
        window.close();
    }
    render() {
        return (
            <React.Fragment>
                <div className="account-pages my-5 pt-5">
                    <Container>
                        <Row>
                            <Col lg="12">
                                <div className="text-center mb-5">
                                    <h1 className="display-2 font-weight-medium">Thank y<i className="bx bx-buoy bx-spin text-primary display-3"></i>u</h1>
                                    <div className="mt-5 text-center">
                                        <Link className="btn btn-success waves-effect waves-light" to="/">Go Home</Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md="8" xl="6">
                                <div>
                                    <img src={thank} alt="" className="img-fluid" />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default PaymentClose;