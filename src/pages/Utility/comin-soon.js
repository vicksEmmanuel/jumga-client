import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

//Import Images

class ComingSoon extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="account-pages my-5 pt-5" style={{position: 'relative', top: 20}}>
                    <Container>
                        <Row>
                            <Col lg="12">
                                <div className="text-center mb-5">
                                    <h1 className="display-1 font-weight-medium">Coming S<i className="bx bx-buoy bx-spin text-primary display-3"></i><i className="bx bx-buoy bx-spin text-primary display-3"></i>n</h1>
                                    <h4 className="display-2" style={{fontSize:16, marginTop: 20, fontFamily: 'Sriracha, cursive'}}>This feature is in the development stack</h4>
                                    <div className="mt-5 text-center">
                                        <Link 
                                            className="btn btn-success waves-effect waves-light" 
                                            to="#"
                                            onClick={e => {
                                                e.preventDefault();
                                                this.props.history.goBack();
                                            }}
                                        >Go Back</Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default ComingSoon;