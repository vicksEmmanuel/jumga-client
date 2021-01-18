import React, { useEffect, useState, useRef }  from 'react';
import _ from 'lodash';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import stateWrapper from '../../containers/provider';
import storefront from "../../assets/images/store-umbrella.png";
import { withRouter, Link } from 'react-router-dom';
import './create-store.scss';
import { withTranslation } from 'react-i18next';

const CreateStore = (props) => {
    const [state, setState] = useState({
        isOpen: props.isOpen,
        store: null,
        storeId: null,
    });

    const [categories, setCat] = useState([]);
    const [checkedCat, setCheckedCat] = useState({});

    useEffect(() => {
        let x = async () => {
            let t = await props.masterStore.getAllCategories();
            let temp = {};
            let newTemp = [];
            Object.keys(t).map(i => {
                temp[i] = false;
                newTemp.push(i);
                let x = t[i];
                Object.keys(x).map(y => {
                    temp[y] = false;
                    newTemp.push(y);
                    x[y].map(z => {
                        temp[z] = false;
                        newTemp.push(z);
                    });
                })
            });

            setCheckedCat(temp);
            setCat(newTemp);
        }

        x();
    }, [props.masterStore]);

    const form = useRef();

    let timeout = null;

    useEffect(() => {
        setState({...state, isOpen: props.isOpen});
    }, [props.isOpen]);

    let drawerClasses =  state.isOpen ? 'side-drawer open' : 'side-drawer';

    const bigScreen = (children) => (
        <div style={{width: '70%',  marginTop: '4%'}} className="d-none d-md-block">
            {children}
        </div>
    );

    const smallScreen = (children) => (
        <div style={{width: '100%', marginTop: '4%'}} className="d-md-none">
            {children}
        </div>
    );

    const checkBox = item => {
        let temp = {...checkedCat};
        temp[`${item}`] = !temp[`${item}`];
        setCheckedCat(temp);
    }

    const handleValidSubmit = (e, v) => {
        e.preventDefault();
        let newValues = {
            ...v,
            categories: Object.keys(checkedCat).filter(itemx => {
                if (checkedCat[itemx] == true) return itemx;
            }),
            storeId: state.storeId,
            paymentDates: [],
            approved: false,
            userEmail: props?.userStore?.state?.user?.email,
            dispatchRiders: null,
            createdDate: Date.now(),
            dateVisited: Date.now(),
        }

        props.userStore.createStore(newValues, props);
    }

      const processStoreName = async (e) => {
        let checker = await props.userStore.checkIfStoreNameExists(props.userStore.storeNameCleanUp(e));
        console.log(checker);
        if (checker?.status) {
            await setState({
                ...state, 
                storeId: checker?.recommendation,
            });
            return;
        }

        await setState({...state, storeId: props.userStore.storeNameCleanUp(e)});
        return;
    }

    const screen = (
        <Row>
            <Col xs="12">
                <Card style={{backgroundColor: '#f8f8fb'}}>
                    <CardBody>
                        <div>
                            <i
                                 className="bx bx-arrow-back" style={{marginRight: 10, fontSize: 16, cursor: 'pointer'}}
                                 onClick={props.createStore}
                            ></i>
                            <span style={{fontSize: 16, fontWeight: 'lighter'}}>Create a store</span>
                        </div>
                        <div style={{marginTop: '10%'}}>
                            <div style={{fontSize: '23px', lineHeight: '32px', fontWeight: '500'}}>
                                Let's start with a name for your 
                                <h1 className="ml1" style={{color: '#d3212d'}}>
                                    <span className="text-wrapper">
                                        <span className="line line1"></span>
                                        <span className="letters">Store</span>
                                        <span className="line line2"></span>
                                    </span>
                                </h1>
                            </div>

                            <AvForm ref={form} className="form-horizontal" onValidSubmit={(e,v) => { handleValidSubmit(e,v) }}>
                                <AvGroup>
                                    <AvInput
                                        style={{fontSize: '23px', color: 'black', outline: 0, backgroundColor: 'inherit', fontWeight: '500'}}
                                        validate={{
                                            minLength: { value: 3, errorMessage: "Storename must be more than 3 letters"},
                                            maxLength: { value: 20, errorMessage: 'Storename must be lest than 20 letters'}
                                        }}
                                        placeholder="Enter your store name"
                                        name="store" 
                                        id="store" 
                                        required
                                        autoComplete="off"
                                        onChange={async (e) => {
                                            const { name, value} = e.target;
                                            let temp = state;
                                            await setState({
                                                ...temp, 
                                                store: value
                                            });
                                            clearTimeout(timeout);
                                            if (String(value).length >= 3) {    
                                                timeout = setTimeout(() => {
                                                    processStoreName(value);
                                                }, 1000);
                                            }
                                        }}

                                    />
                                </AvGroup>
                                
                                <div className="bg-warning" style={{padding: 3, color: 'white', borderRadius: 10, display: 'inline-block', marginBottom: '4%'}}>{state.storeId}</div>
                                    
                                <div style={{fontSize: '23px', lineHeight: '32px', fontWeight: '500', marginBottom: '4%'}}>
                                    Now choose your store categories (max of 10)
                                </div>
                                
                                <div style={{marginBottom: '5%'}}>
                                    {
                                        categories.map((item, idd) => {
                                            return (
                                                <span className="custom-control custom-checkbox mb-3" key={idd} style={{margin: 5, display: 'inline-block'}}>
                                                    <input name={item} type="checkbox" className="custom-control-input" id="CustomCheck1" onChange={() => checkBox(item)} checked={checkedCat[`${item}`]} />
                                                    <label className="custom-control-label" onClick={() => checkBox(item)} >{item}</label>
                                                </span>
                                                
                                            )
                                        })
                                    }
                                </div>

                                <div className="mt-3">
                                    <button
                                        className="btn btn-primary btn-block waves-effect waves-light" 
                                        type="submit"
                                        style={{width: 300}}
                                    >
                                        Create & Prooceed to Payment
                                    </button>
                                </div>
                            </AvForm>


                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )

    return (
        <React.Fragment>
            <div style={{width: '100%'}}>   
            <div className={drawerClasses} style={{position: state.isOpen ? 'absolute' : 'fixed'}}>
                    <div className="d-none d-md-block" style={{position: 'fixed', backgroundColor: 'white', width: '25%', height: '100%', right: '0%'}}>
                        <Row>
                            <Col xs="12">
                                <div className="page-title-box">
                                    <LazyLoadImage
                                        alt={"Store front"}
                                        src={storefront}
                                        width={300}
                                        className="d-none d-md-block store-front"
                                        style={{position:'relative', marginTop: '70%', marginRight: 10, left: -20}}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="page-content">
                        <Container fluid>
                            {bigScreen(screen)}
                            {smallScreen(screen)}
                        </Container>
                    </div>
            </div>
            </div>
        </React.Fragment>
    );
}

export const Backdrop = props => {
    return(
        <div className="backdrop" onClick={props.createStore}/>
      )
  }
  

export default withRouter(withTranslation()(stateWrapper(CreateStore)));