import React, {  useEffect } from 'react';

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from 'react-i18next';

const SidebarContent = (props) => {

    const storeId = props.match.params?.id;
    // Use ComponentDidMount and ComponentDidUpdate method symultaniously
     useEffect(() => {

        var pathName = props.location.pathname;

        const initMenu = () => {
            new MetisMenu("#side-menu");
            var matchingMenuItem = null;
            var ul = document.getElementById("side-menu");
            var items = ul.getElementsByTagName("a");
            for (var i = 0; i < items.length; ++i) {
                if (pathName === items[i].pathname) {
                    matchingMenuItem = items[i];
                    break;
                }
            }
            if (matchingMenuItem) {
                activateParentDropdown(matchingMenuItem);
            }
        }
         initMenu();
      }, [props.location.pathname]);

  
    function  activateParentDropdown(item) {
        item.classList.add("active");
        const parent = item.parentElement;

        if (parent) {
            parent.classList.add("mm-active");
            const parent2 = parent.parentElement;

            if (parent2) {
                parent2.classList.add("mm-show");

                const parent3 = parent2.parentElement;

                if (parent3) {
                    parent3.classList.add("mm-active"); // li
                    parent3.childNodes[0].classList.add("mm-active"); //a
                    const parent4 = parent3.parentElement;
                    if (parent4) {
                        parent4.classList.add("mm-active");
                    }
                }
            }
            return false;
        }
        return false;
    };

          return (
           
            <React.Fragment>
                 <div id="sidebar-menu">
                <ul className="metismenu list-unstyled" id="side-menu">
                     <li>
                        <Link to={`/store/front/${storeId}/overview`} className="waves-effect">
                            <i className="fas fa-clipboard-list text-primary"></i>
                            <span>{props.t('Overview') }</span>
                        </Link>
                     </li>
                     <li>
                         <Link to={`/store/front/${storeId}/add-products`} className="waves-effect">
                            <i className="bx bx-add-to-queue text-primary"></i>
                            <span>{props.t('Add Products') }</span>
                        </Link>
                     </li> 
                     <li>
                         <Link to={`/store/front/${storeId}/products`} className="waves-effect">
                            <i className="bx bxs-store text-primary"></i>
                            <span>{props.t('Products') }</span>
                        </Link>
                     </li> 
                     <li>
                         <Link to={`/store/front/${storeId}/orders`} className="waves-effect">
                            <i className="bx bxs-shopping-bags text-primary"></i>
                            <span>{props.t('Orders') }</span>
                        </Link>
                     </li>         
                     <li>
                         <Link to={`/store/front/${storeId}/customers`} className="waves-effect">
                            <i className="bx bx-group text-primary"></i>
                            <span>{props.t('Customers') }</span>
                        </Link>
                     </li>    
                     <li>
                         <Link to={`/store/front/${storeId}/settings`} className="waves-effect">
                            <i className="dripicons-gear text-primary"></i>
                            <span>{props.t('Settings') }</span>
                        </Link>
                     </li> 
                     <li>
                         <Link to={`/store/front/${storeId}/account`} className="waves-effect">
                            <i className="bx bxs-bank text-primary"></i>
                            <span>{props.t('Account') }</span>
                        </Link>
                     </li>
                     <li>
                         <Link to={`/store/front/${storeId}/analysis`} className="waves-effect">
                            <i className="bx bxs-network-chart text-primary"></i>
                            <span>{props.t('Analysis') }</span>
                        </Link>
                     </li>      
                </ul>
            </div>
            </React.Fragment>
          );
        }

    export default withRouter(withTranslation()(SidebarContent));


