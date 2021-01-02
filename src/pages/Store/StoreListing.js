import React  from 'react';
import _ from 'lodash';
import { Container, Row, Col, Button, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Media, Table } from "reactstrap";
import Breadcrumb from '../../components/Common/Breadcrumb';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

const StoreListing = (props) => {

    const bigScreen = (children) => (
        <div style={{width: '60%'}} className="d-none d-md-block">
            {children}
        </div>
    );

    const smallScreen = (children) => (
        <div style={{width: '100%'}} className="d-md-none">
            {children}
        </div>
    );

    const storelisting = () => {
        return (
            <div style={{width: '100%', marginTop: 30}}>
                <Breadcrumb title={props.t('Home')} breadcrumbItem={''} />
            </div>
        )
    }

    return (
          <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <center>
                            {bigScreen(storelisting())}
                            {smallScreen(storelisting())}
                        </center>
                    </Container>
                </div>
            </React.Fragment>
          );
    }
        
export default withRouter(withTranslation()(StoreListing));