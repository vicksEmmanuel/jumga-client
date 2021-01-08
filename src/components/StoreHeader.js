import React, { useState, useEffect } from 'react';
import * as _ from 'lodash';

import { Row, Col } from "reactstrap";

import { Link, withRouter } from "react-router-dom";

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

// Import menuDropdown
import NotificationDropdown from "./CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "./CommonForBoth/TopbarDropdown/ProfileMenu";

import logo from "../assets/images/jumga basket logo.png";
import logoDark from "../assets/images/jumga logo.png";
import megamenuImg from "../assets/images/megamenu-img.png";




//i18n
import { withTranslation } from 'react-i18next';
import stateWrapper from '../containers/provider';


const StoreHeader = (props) => {

  const [search, setsearch] = useState(false);
  const [searchtext, setSearchText] = useState('');
  const [megaMenuDrp, setmegaMenu] = useState(false);
  const [cat, setCat] = useState({});
  const [socialDrp, setsocialDrp] = useState(false);
  const searchFor = (e) => {
    e.preventDefault();
  }

  const trimAndReplaceSpaces = (text) => {
      return String(text).trim().replace(/\s/g, '-').toLowerCase();
  }

  useEffect(() => {
      let x = async () => await props.masterStore.getAllCategories();
      x();
  }, []);

  useEffect(() => {
    setCat(props.masterStore.state.categories);
  }, [props.masterStore.state.categories]);

      return (
       <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box" style={{position: 'relative', left: 0, paddingLeft: 0}}>
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logo} alt="" height="30" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoDark} alt="" height="30" />
                  </span>
                </Link>
              </div>

              <form onSubmit={searchFor} className="app-search d-none d-lg-block">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control"
                    onChange={e => setSearchText(e.target.value)}
                    value={searchtext}
                    placeholder="Search..."
                  />
                  <span className="bx bx-search-alt"></span>
                </div>
              </form>

              <Dropdown className="dropdown-mega d-none d-lg-block ml-2" isOpen={megaMenuDrp} toggle={() => { setmegaMenu( !megaMenuDrp ) }}>
                <DropdownToggle className="btn header-item waves-effect" caret tag="button"> 
              {props.t('Categories')}  {" "}
                  <i className="mdi mdi-chevron-down"></i></DropdownToggle>
                <DropdownMenu className="dropdown-megamenu">
                    {
                        <Row>
                            <Col sm={10}>  
                                {
                                    Object.keys(cat).map((item, id) => {
                                        return (
                                            <div key={id} className="list-unstyled megamenu-list">
                                                <Link to={`/categories/${trimAndReplaceSpaces(item)}`}>
                                                    <h5 className="font-size-14 mt-0">{props.t(item)}</h5>
                                                </Link>
                                                {
                                                    Object.keys(cat[item]).map((item2, idx) => {
                                                        let x = cat[item];
                                                        return (
                                                            <div key={idx} style={{float: 'left', margin: 20}}>
                                                                <Link to={`/categories/${trimAndReplaceSpaces(item2)}`}><h6 className="font-size-14 mt-0">{props.t(item2)}</h6></Link>
                                                                <div style={{width: '100%', borderColor: 'black', borderWidth: 1, height: 1, backgroundColor: 'slategray'}}>&nbsp;</div>
                                                                {_.isArray(x[item2])? x[item2].map((val, valKey) => {
                                                                    return (
                                                                        <Link key={valKey} to={`/categories/${trimAndReplaceSpaces(val)}`}><div className="font-size-14">{val}</div></Link>
                                                                    )
                                                                }) : <></>}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </Col>
                            <Col sm={2}>
                                <Row>
                                    <Col sm={5}>
                                        <div>
                                            <img
                                            src={megamenuImg}
                                            alt=""
                                            className="img-fluid mx-auto d-block"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    }
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="d-flex">
                <div className="dropdown d-inline-block d-lg-none ml-2">
                    <button
                        type="button"
                        className="btn header-item noti-icon waves-effect"
                        id="page-header-search-dropdown"
                        onClick={() => { setsearch(!search); }}>
                        <i className="mdi mdi-magnify"></i>
                    </button>
                    <div
                    className={search ? "dropdown-menu dropdown-menu-lg dropdown-menu-right p-0 show" : "dropdown-menu dropdown-menu-lg dropdown-menu-right p-0"}
                    aria-labelledby="page-header-search-dropdown"
                    >
                    <form className="p-3" onSubmit={searchFor}>
                        <div className="form-group m-0">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={props.t('Search') + "..."}
                                value={searchtext}
                                onChange={e => setSearchText(e.target.value)}
                                aria-label="Recipient's username"
                            />
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="submit">
                                    <i className="mdi mdi-magnify"></i>
                                </button>
                            </div>
                        </div>
                        </div>
                    </form>
                    </div>
                </div>

              <NotificationDropdown />
              <ProfileMenu />
            </div>
          </div>
        </header>
      </React.Fragment>
      );
    }

export default withRouter(withTranslation()(stateWrapper(StoreHeader)));

