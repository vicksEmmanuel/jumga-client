import React, { useState, useEffect } from 'react';
import { Link, withRouter } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import * as _ from 'lodash';
import stateWrapper from '../../../containers/provider';
//i18n
import { withTranslation } from 'react-i18next';


const Cart = (props) => {

  const [state, setState] = useState({
    cart: props.masterStore.state.cart
  });

  useEffect(() => {
    console.log("Cart ==", props.masterStore.state.cart);
    setState({cart: props.masterStore.state.cart});
  }, [props.masterStore.state.cart])

  useEffect(() => {
    if (_.isNull((props.userStore.state.user))) return;
    props.masterStore.getCart(props.userStore.state.user.email);
}, [props.userStore.state.user]);


 // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  return (
    <>
        <Link to={"/cart"}>
          <Dropdown
            isOpen={menu}
            toggle={() => setMenu(!menu)}
            className="dropdown d-inline-block"
            tag="li"
          >
            <DropdownToggle
              className="btn header-item noti-icon waves-effect"
              tag="button" id="page-header-notifications-dropdown">
              <i className={`bx bx-cart ${state.cart.length > 0 ? 'bx-tada' : ''}`}></i>
              <span className="badge badge-danger badge-pill">{state.cart.length > 0 ? state.cart.length : ''}</span>
            </DropdownToggle>

            {/* <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0" right>
              <div className="p-3">
                <Row className="align-items-center">
                  <Col>
                    <h6 className="m-0"> {props.t('Notifications')} </h6>
                  </Col>
                  <div className="col-auto">
                    <a href="#!" className="small"> View All</a>
                  </div>
                </Row>
              </div>

              <SimpleBar style={{ height: "230px" }}>
                <Link to="" className="text-reset notification-item">
                  <div className="media">
                    <div className="avatar-xs mr-3">
                      <span className="avatar-title bg-primary rounded-circle font-size-16">
                        <i className="bx bx-cart"></i>
                      </span>
                    </div>
                    <div className="media-body">
                      <h6 className="mt-0 mb-1">{props.t('Your order is placed')}</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">{props.t('If several languages coalesce the grammar')}</p>
                        <p className="mb-0"><i className="mdi mdi-clock-outline"></i> {props.t('3 min ago')} </p>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link to="" className="text-reset notification-item">
                  <div className="media">
                    <img src={avatar3} className="mr-3 rounded-circle avatar-xs" alt="user-pic" />
                    <div className="media-body">
                      <h6 className="mt-0 mb-1">James Lemire</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">{props.t('It will seem like simplified English') + "."}</p>
                        <p className="mb-0"><i className="mdi mdi-clock-outline"></i>{props.t('1 hours ago')} </p>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link to="" className="text-reset notification-item">
                  <div className="media">
                    <div className="avatar-xs mr-3">
                      <span className="avatar-title bg-success rounded-circle font-size-16">
                        <i className="bx bx-badge-check"></i>
                      </span>
                    </div>
                    <div className="media-body">
                      <h6 className="mt-0 mb-1">{props.t('Your item is shipped')}</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">{props.t('If several languages coalesce the grammar')}</p>
                        <p className="mb-0"><i className="mdi mdi-clock-outline"></i> {props.t('3 min ago')}</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to="" className="text-reset notification-item">
                  <div className="media">
                    <img src={avatar4} className="mr-3 rounded-circle avatar-xs" alt="user-pic" />
                    <div className="media-body">
                      <h6 className="mt-0 mb-1">Salena Layfield</h6>
                      <div className="font-size-12 text-muted">
                        <p className="mb-1">{props.t('As a skeptical Cambridge friend of mine occidental') + "."}</p>
                        <p className="mb-0"><i className="mdi mdi-clock-outline"></i>{props.t('1 hours ago')} </p>
                      </div>
                    </div>
                  </div>
                </Link>

              </SimpleBar>
              <div className="p-2 border-top">
                <Link
                  className="btn btn-sm btn-link font-size-14 btn-block text-center"
                  to="#"
                >
                  {" "}
                {props.t('View all')}{" "}
                </Link>
              </div>
            </DropdownMenu> */}

          </Dropdown>
        </Link>
    </>
  );
}

export default withRouter(withTranslation()(stateWrapper(Cart)));