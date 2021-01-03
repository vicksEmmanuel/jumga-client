import React, { useEffect, useState }  from 'react';
import _ from 'lodash';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import CreateStore, {Backdrop} from './CreateStore';
import { Container, Row, Col, Button, Card, CardBody, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Media, Table } from "reactstrap";
import stateWrapper from '../../containers/provider';
import storefront from "../../assets/images/store-umbrella.png";
import storefront2 from "../../assets/images/store-umbrella1.png";
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './store.scss';

var randomColor = require('randomcolor');

const StoreDetails = (props) => {

    return (
          <React.Fragment>
                <div>Hello</div>
            </React.Fragment>
          );
    }
        
export default withRouter(withTranslation()(stateWrapper(StoreDetails)));