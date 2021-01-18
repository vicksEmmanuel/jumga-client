import React from 'react';
import _ from 'lodash';
import { Container} from "reactstrap";
import Breadcrumb from '../../components/Common/Breadcrumb';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import "./home.scss";

 const Home = (props) => {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumb title={props.t('Home')} breadcrumbItem={''} />
                    </Container>
                </div>
            </React.Fragment>
        );
    }

export default withRouter(withTranslation()(Home))
