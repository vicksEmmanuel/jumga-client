import React, { useState } from 'react';

import { Row, Col } from "reactstrap";

import { Route,Redirect,withRouter, Link } from "react-router-dom";
import {  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

// Import menuDropdown
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import logo from "../../assets/images/jumga basket logo.png";
import logoDark from "../../assets/images/jumga logo.png";



//i18n
import { withTranslation } from 'react-i18next';
import stateWrapper from '../../containers/provider';


const Header = (props) => {
  const [search, setsearch] = useState(false);
  const [megaMenu, setmegaMenu] = useState(false);
  const [socialDrp, setsocialDrp] = useState(false);

  const storeId = props.match.params?.id;

  const isMobile =  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const processStoreListiing = () => {
    let x = props.userStore.state.stores.filter(item => {
      return item.storeId !== storeId;
    })

    return x.length > 0 ? x.map((item, id) => {
      return (
        <div key={id}>
          <Link to={`/store/front/${item.storeId}`}>
            {item.store}
          </Link>
        </div>
      )
    }) : (
      <div>Nothing Here</div>
    )
  }

      return (
       <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm" style={{position: 'relative', left: '-60%'}}>
                    <img src={logo} alt="" height="30" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoDark} alt="" height="30" />
                  </span>
                </Link>
              </div>

              <div>
                  <UncontrolledDropdown>
                      <DropdownToggle href="#" className="card-drop" tag="i">
                        <span className="d-none d-lg-inline-block">Stores</span>
                      <button 
                         type="button"
                         className="btn btn-sm px-3 font-size-16 header-item waves-effect" id="vertical-menu-btn"
                         style={{display: 'inline-block'}}
                         >
                        <i className="fa fa-fw fa-bars"></i>
                      </button>
                      </DropdownToggle>
                      <DropdownMenu left>
                          <DropdownItem href="#" onClick={e => e.preventDefault()}>
                              {processStoreListiing()}
                          </DropdownItem>
                      </DropdownMenu>
                  </UncontrolledDropdown>
              </div>
            </div>
            <div className="d-flex">
              <NotificationDropdown />
              <ProfileMenu />
            </div>
          </div>
        </header>
      </React.Fragment>
      );
    }

export default withRouter(withTranslation()(stateWrapper(Header)));
