import React from 'react';
import { Container, Row, Col } from "reactstrap";
import { Link } from 'react-router-dom';


const Footer = (props) => {
  return (
   <React.Fragment>
            <footer style={{
                backgroundColor: 'black',
            }} align="center">
                <div style={{width: '90%'}}>
                    <Container fluid={true}>
                        <Row>
                            <Col md={6}>
                                {new Date().getFullYear()} © Jumga.
                            </Col>
                            <Col md={6}>
                                <div className="text-sm-right d-none d-sm-block">
                                    Design & Develop by vicksemmanuel@gmail.com
                                </div>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 20}}>
                            <Col align="center" lg="6" md="6" style={{paddingLeft: 30}}>
                                <Row style={{marginTop: 20}} align="left">
                                    <Col md={6}>
                                        <Link to="/store">> Create A Store</Link>
                                    </Col>
                                </Row>
                                <Row align="left">
                                    <Col md={6}>
                                        <Link to="/">> Home</Link>
                                    </Col>
                                </Row>
                                <Row align="left">
                                    <Col md={6}>
                                        <Link to="#">> Become A Dispatcher</Link>
                                    </Col>
                                </Row>
                                <Row align="left">
                                    <Col md={6}>
                                        <Link to="/admin">> Only for Admin</Link>
                                    </Col>
                                </Row> 
                            </Col>
                            <Col lg="6" md="6" style={{cursor: 'pointer'}}>
                                <Row>
                                   <Col lg="12">
                                        <i className="bx bx-barcode text-primary" style={{fontSize: 60}}></i> &nbsp;
                                   </Col>
                                   <Col lg="12">
                                        Get our App
                                   </Col>
                                </Row>
                                <Row>
                                    <Col lg="12">
                                    <i className="bx bxl-facebook-square" style={{fontSize: 20}}></i> &nbsp;
                                    <i className="bx bxl-instagram-alt" style={{fontSize: 20}}></i>&nbsp;
                                    <i className="bx bxl-youtube" style={{fontSize: 20}}></i>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </footer>
        </React.Fragment>
  );
}

export default Footer;