import React, { useEffect, useState }  from 'react';
import _ from 'lodash';
import 'react-perfect-scrollbar/dist/css/styles.css';
import stateWrapper from '../../containers/provider';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import './store.scss';


const AdminDetails = (props) => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        if(!_.isNull(props.userStore.state.user)) {
            if (props.userStore.state.user?.userType !== 'Admin') return props.history.push('/');
            props.history.push(`/admin/overview`);
            setLoading(false);
        }
    }, [props.userStore.state.user])

    return (
          <React.Fragment>
                {
                    isLoading ? (
                        <div style={{position: 'fixed', top: '0%', width: '100%', height: '100%', left: '0%', zIndex: 5000, backgroundColor: '#f8f8fb'}}>
                            <div style={{position: 'relative', top: '45%', left: '43%'}}>
                                <div className="lds-ring-x"><div></div><div></div><div></div><div></div></div>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )
                }
            </React.Fragment>
          );
    }
        
export default withRouter(withTranslation()(stateWrapper(AdminDetails)));