import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import StoreHeader from './StoreHeader';

class StoreLayout extends Component {
    constructor(props) {
        super(props);
        this.state={};
        this.capitalizeFirstLetter.bind(this);
    }
    
    capitalizeFirstLetter = string => {
        return string.charAt(1).toUpperCase() + string.slice(2);
    };

    componentDidMount(){
        let currentage = this.capitalizeFirstLetter(this.props.location.pathname);

        document.title =
          currentage + " | Jugma";
    }
    render() {
        return <React.Fragment>
            <div id="layout-wrapper">
                <StoreHeader/>
                {this.props.children}
            </div>
        </React.Fragment>;
    }
}

export default (withRouter(StoreLayout));