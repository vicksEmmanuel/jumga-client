import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Input, Nav, NavItem, NavLink, TabContent, TabPane, Card, Form, FormGroup, Label, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import Select from "react-select";
import { Link, withRouter } from "react-router-dom";
import ErrorMessage from '../../components/Common/ErrorMessage';
import * as _ from 'lodash';
import stateWrapper from '../../containers/provider';
//i18n
import { withTranslation } from 'react-i18next';
import './store.scss';


import classnames from 'classnames';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

const Checkout = props => {
    const [state, setState] = useState({
        orderSummary: props.masterStore.state.cart,
        activeTab: '1',
        name: null,
        email: props.userStore.state.user?.email,
        phone: props.userStore.state.user?.phone || null,
        address: null,
        country: null,
        state: null,
        note: null,
        isError: false,
        errMsg: '',
        clicked: false,
        paybutton: 'btn btn-success',
        url: null,
        currency: props.paymentStore.state.currency?.code,
        currencyPricePerDollar: props.paymentStore.state.currency?.pricePerDollar
    });

    const getAddUpValues = (value) => {
        let x = 0;
        state.orderSummary.forEach(item => {
            x += Number(item[value]);
        });

        return x;
    }

    useEffect(() => {
        if (_.isEmpty(props.userStore.state.user) || _.isNull(props.userStore.state.user) || _.isEmpty(props.masterStore.state.cart)) props.history.goBack();
    }, []);

    useEffect(() => {
        if (state.isError) {
            setTimeout(() => {setState({...state, isError: false, errMsg: ''})}, 10000);
        }
    }, [state.isError]);

    const toggleTab = (tab) => {
        if (state.activeTab !== tab) {
            setState({
                ...state,
                activeTab: tab
            });
            window.scrollTo(0,0);
        }
    }

    const getDeliveryCost = () => {
        let delivery = 0;
        state.orderSummary.forEach(item => {
            delivery += (Number(item?.deliverycost) * item?.quantity);
        })
        return delivery;
    }

    const getTotal = () => {
        let discount = getDeliveryCost();
        let totalprice = getAddUpValues('total');

        return Number(discount) + Number(totalprice);
    }

    let windowRef = null;

    const openNewWindow = (url) => {
        windowRef = window.open(url, 'Payment', 'statusbar=no,height=600,width=400');    
    }

    const trackPayment = () => {
        props.userStore.trackPaymentForGoods(() => {
            props.masterStore.setState({...props.masterStore.state, cart: []});
            props.history.push('/history');
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            validateSubmit();
            setState({...state, paybutton: 'btn btn-warning', clicked: true});

            const options = {
                email: state.email,
                name: state.name,
                paymentTitle: `Payment for Order`,
                description: `${props.userStore.state.user.username} is to pay ${getTotal()} for goods ordered`,
                currency: state.currency,
                currencyPricePerDollar: state.currencyPricePerDollar,
                sell: true,
                email: state.email,
                phone: state.phone,
                address: state.address,
                country: state.country,
                state: state.state,
                note: state.note,
            };

            let payment = await  props.paymentStore.initiatePayment(options);
            const { link } = payment?.data?.data;
            setState({
                ...state,
                paybutton: 'btn btn-success',
                clicked: false,
                url: link
            });
            openNewWindow(link);

            trackPayment();

        } catch (e) {
            setState({...state, isError: true, errMsg: e?.message, clicked: false});
        }
    }

    const validateSubmit = () => {
        setState({...state, clicked: true});
        if (cleanUpName(state.name).length <= 3) throw new Error ("Enter a valid name");
        // if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(state.email))) throw new Error("Enter a valid email");
        if (String(state.address).length <= 5) throw new Error("Enter a valid address.. Address string length must be > 5");
        if (_.isNull(state.country)) throw new Error("Select a country");
        if (_.isNull(state.state || cleanUpName(state.state).length <= 3)) throw new Error("Enter a valid state value");

    }

    const cleanUpName = (name) => {
        return String(name).replace(/[\@\"\']+/g, '');
    }

    return (
        <React.Fragment>
            <div onClick={() => {setState({...state, errMsg: '', isError: false})}}>
                <ErrorMessage isError={state.isError} message={state.errMsg} />
            </div>
            <div className="page-content">
                <Container fluid>

                    {/* Render Breadcrumb */}
                    <Breadcrumbs title="Checkout" breadcrumbItem="" />

                    <div className="checkout-tabs">
                        <Row>
                        <Col lg="10">
                                <Card>
                                    <CardBody>
                                        <TabContent activeTab={state.activeTab}>
                                            <TabPane tabId="1">
                                                <div>
                                                    <CardTitle>Delivery information</CardTitle>
                                                    <CardSubtitle className="mb-3">Fill all information below</CardSubtitle>
                                                    <Form>
                                                        <FormGroup className="mb-4" row>
                                                            <Label htmlFor="billing-name" md="2" className="col-form-label">Name</Label>
                                                            <Col md="10">
                                                                <Input value={state.name} onChange={e => setState({...state, name: e.target.value})} type="text" className="form-control" id="billing-name" placeholder="Enter your name" />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup className="mb-4" row>
                                                            <Label htmlFor="billing-email-address" md="2" className="col-form-label">Email Address</Label>
                                                            <Col md="10">
                                                                <Input 
                                                                    value={state.email} 
                                                                    // onChange={e => setState({...state, email: e.target.value})} 
                                                                    disabled
                                                                    type="email" className="form-control" id="billing-email-address" placeholder="Enter your email" />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup className="mb-4" row>
                                                            <Label htmlFor="billing-phone" md="2" className="col-form-label">Phone</Label>
                                                            <Col md={10}>
                                                                <input value={state.phone} onChange={e => setState({...state, phone: e.target.value})} type="text" className="form-control" id="billing-phone" placeholder="Enter your Phone no." />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup className="mb-4" row>
                                                            <Label htmlFor="billing-address" md="2" className="col-form-label">Address</Label>
                                                            <Col md="10">
                                                                <textarea value={state.address} onChange={e => setState({...state, address: e.target.value})} className="form-control" id="billing-address" rows="3" placeholder="Enter full address"></textarea>
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup className="mb-4" row>
                                                            <Label md="2" className="col-form-label">Country</Label>
                                                            <Col md="10">
                                                                <select value={state.country} onChange={e => setState({...state, country: e.target.value})} className="form-control select2" title="Country">
                                                                    <option value="0">Select Country</option>
                                                                    <option value="AF">Afghanistan</option>
                                                                    <option value="AL">Albania</option>
                                                                    <option value="DZ">Algeria</option>
                                                                    <option value="AS">American Samoa</option>
                                                                    <option value="AD">Andorra</option>
                                                                    <option value="AO">Angola</option>
                                                                    <option value="AI">Anguilla</option>
                                                                    <option value="AQ">Antarctica</option>
                                                                    <option value="AR">Argentina</option>
                                                                    <option value="AM">Armenia</option>
                                                                    <option value="AW">Aruba</option>
                                                                    <option value="AU">Australia</option>
                                                                    <option value="AT">Austria</option>
                                                                    <option value="AZ">Azerbaijan</option>
                                                                    <option value="BS">Bahamas</option>
                                                                    <option value="BH">Bahrain</option>
                                                                    <option value="BD">Bangladesh</option>
                                                                    <option value="BB">Barbados</option>
                                                                    <option value="BY">Belarus</option>
                                                                    <option value="BE">Belgium</option>
                                                                    <option value="BZ">Belize</option>
                                                                    <option value="BJ">Benin</option>
                                                                    <option value="BM">Bermuda</option>
                                                                    <option value="BT">Bhutan</option>
                                                                    <option value="BO">Bolivia</option>
                                                                    <option value="BW">Botswana</option>
                                                                    <option value="BV">Bouvet Island</option>
                                                                    <option value="BR">Brazil</option>
                                                                    <option value="BN">Brunei Darussalam</option>
                                                                    <option value="BG">Bulgaria</option>
                                                                    <option value="BF">Burkina Faso</option>
                                                                    <option value="BI">Burundi</option>
                                                                    <option value="KH">Cambodia</option>
                                                                    <option value="CM">Cameroon</option>
                                                                    <option value="CA">Canada</option>
                                                                    <option value="CV">Cape Verde</option>
                                                                    <option value="KY">Cayman Islands</option>
                                                                    <option value="CF">Central African Republic</option>
                                                                    <option value="TD">Chad</option>
                                                                    <option value="CL">Chile</option>
                                                                    <option value="CN">China</option>
                                                                    <option value="CX">Christmas Island</option>
                                                                    <option value="CC">Cocos (Keeling) Islands</option>
                                                                    <option value="CO">Colombia</option>
                                                                    <option value="KM">Comoros</option>
                                                                    <option value="CG">Congo</option>
                                                                    <option value="CK">Cook Islands</option>
                                                                    <option value="CR">Costa Rica</option>
                                                                    <option value="CI">Cote d'Ivoire</option>
                                                                    <option value="HR">Croatia (Hrvatska)</option>
                                                                    <option value="CU">Cuba</option>
                                                                    <option value="CY">Cyprus</option>
                                                                    <option value="CZ">Czech Republic</option>
                                                                    <option value="DK">Denmark</option>
                                                                    <option value="DJ">Djibouti</option>
                                                                    <option value="DM">Dominica</option>
                                                                    <option value="DO">Dominican Republic</option>
                                                                    <option value="EC">Ecuador</option>
                                                                    <option value="EG">Egypt</option>
                                                                    <option value="SV">El Salvador</option>
                                                                    <option value="GQ">Equatorial Guinea</option>
                                                                    <option value="ER">Eritrea</option>
                                                                    <option value="EE">Estonia</option>
                                                                    <option value="ET">Ethiopia</option>
                                                                    <option value="FK">Falkland Islands (Malvinas)</option>
                                                                    <option value="FO">Faroe Islands</option>
                                                                    <option value="FJ">Fiji</option>
                                                                    <option value="FI">Finland</option>
                                                                    <option value="FR">France</option>
                                                                    <option value="GF">French Guiana</option>
                                                                    <option value="PF">French Polynesia</option>
                                                                    <option value="GA">Gabon</option>
                                                                    <option value="GM">Gambia</option>
                                                                    <option value="GE">Georgia</option>
                                                                    <option value="DE">Germany</option>
                                                                    <option value="GH">Ghana</option>
                                                                    <option value="GI">Gibraltar</option>
                                                                    <option value="GR">Greece</option>
                                                                    <option value="GL">Greenland</option>
                                                                    <option value="GD">Grenada</option>
                                                                    <option value="GP">Guadeloupe</option>
                                                                    <option value="GU">Guam</option>
                                                                    <option value="GT">Guatemala</option>
                                                                    <option value="GN">Guinea</option>
                                                                    <option value="GW">Guinea-Bissau</option>
                                                                    <option value="GY">Guyana</option>
                                                                    <option value="HT">Haiti</option>
                                                                    <option value="HN">Honduras</option>
                                                                    <option value="HK">Hong Kong</option>
                                                                    <option value="HU">Hungary</option>
                                                                    <option value="IS">Iceland</option>
                                                                    <option value="IN">India</option>
                                                                    <option value="ID">Indonesia</option>
                                                                    <option value="IQ">Iraq</option>
                                                                    <option value="IE">Ireland</option>
                                                                    <option value="IL">Israel</option>
                                                                    <option value="IT">Italy</option>
                                                                    <option value="JM">Jamaica</option>
                                                                    <option value="JP">Japan</option>
                                                                    <option value="JO">Jordan</option>
                                                                    <option value="KZ">Kazakhstan</option>
                                                                    <option value="KE">Kenya</option>
                                                                    <option value="KI">Kiribati</option>
                                                                    <option value="KR">Korea, Republic of</option>
                                                                    <option value="KW">Kuwait</option>
                                                                    <option value="KG">Kyrgyzstan</option>
                                                                    <option value="LV">Latvia</option>
                                                                    <option value="LB">Lebanon</option>
                                                                    <option value="LS">Lesotho</option>
                                                                    <option value="LR">Liberia</option>
                                                                    <option value="LY">Libyan Arab Jamahiriya</option>
                                                                    <option value="LI">Liechtenstein</option>
                                                                    <option value="LT">Lithuania</option>
                                                                    <option value="LU">Luxembourg</option>
                                                                    <option value="MO">Macau</option>
                                                                    <option value="MG">Madagascar</option>
                                                                    <option value="MW">Malawi</option>
                                                                    <option value="MY">Malaysia</option>
                                                                    <option value="MV">Maldives</option>
                                                                    <option value="ML">Mali</option>
                                                                    <option value="MT">Malta</option>
                                                                    <option value="MH">Marshall Islands</option>
                                                                    <option value="MQ">Martinique</option>
                                                                    <option value="MR">Mauritania</option>
                                                                    <option value="MU">Mauritius</option>
                                                                    <option value="YT">Mayotte</option>
                                                                    <option value="MX">Mexico</option>
                                                                    <option value="MD">Moldova, Republic of</option>
                                                                    <option value="MC">Monaco</option>
                                                                    <option value="MN">Mongolia</option>
                                                                    <option value="MS">Montserrat</option>
                                                                    <option value="MA">Morocco</option>
                                                                    <option value="MZ">Mozambique</option>
                                                                    <option value="MM">Myanmar</option>
                                                                    <option value="NA">Namibia</option>
                                                                    <option value="NR">Nauru</option>
                                                                    <option value="NP">Nepal</option>
                                                                    <option value="NL">Netherlands</option>
                                                                    <option value="AN">Netherlands Antilles</option>
                                                                    <option value="NC">New Caledonia</option>
                                                                    <option value="NZ">New Zealand</option>
                                                                    <option value="NI">Nicaragua</option>
                                                                    <option value="NE">Niger</option>
                                                                    <option value="NG">Nigeria</option>
                                                                    <option value="NU">Niue</option>
                                                                    <option value="NF">Norfolk Island</option>
                                                                    <option value="MP">Northern Mariana Islands</option>
                                                                    <option value="NO">Norway</option>
                                                                    <option value="OM">Oman</option>
                                                                    <option value="PW">Palau</option>
                                                                    <option value="PA">Panama</option>
                                                                    <option value="PG">Papua New Guinea</option>
                                                                    <option value="PY">Paraguay</option>
                                                                    <option value="PE">Peru</option>
                                                                    <option value="PH">Philippines</option>
                                                                    <option value="PN">Pitcairn</option>
                                                                    <option value="PL">Poland</option>
                                                                    <option value="PT">Portugal</option>
                                                                    <option value="PR">Puerto Rico</option>
                                                                    <option value="QA">Qatar</option>
                                                                    <option value="RE">Reunion</option>
                                                                    <option value="RO">Romania</option>
                                                                    <option value="RU">Russian Federation</option>
                                                                    <option value="RW">Rwanda</option>
                                                                    <option value="KN">Saint Kitts and Nevis</option>
                                                                    <option value="LC">Saint LUCIA</option>
                                                                    <option value="WS">Samoa</option>
                                                                    <option value="SM">San Marino</option>
                                                                    <option value="ST">Sao Tome and Principe</option>
                                                                    <option value="SA">Saudi Arabia</option>
                                                                    <option value="SN">Senegal</option>
                                                                    <option value="SC">Seychelles</option>
                                                                    <option value="SL">Sierra Leone</option>
                                                                    <option value="SG">Singapore</option>
                                                                    <option value="SK">Slovakia (Slovak Republic)</option>
                                                                    <option value="SI">Slovenia</option>
                                                                    <option value="SB">Solomon Islands</option>
                                                                    <option value="SO">Somalia</option>
                                                                    <option value="ZA">South Africa</option>
                                                                    <option value="ES">Spain</option>
                                                                    <option value="LK">Sri Lanka</option>
                                                                    <option value="SH">St. Helena</option>
                                                                    <option value="PM">St. Pierre and Miquelon</option>
                                                                    <option value="SD">Sudan</option>
                                                                    <option value="SR">Suriname</option>
                                                                    <option value="SZ">Swaziland</option>
                                                                    <option value="SE">Sweden</option>
                                                                    <option value="CH">Switzerland</option>
                                                                    <option value="SY">Syrian Arab Republic</option>
                                                                    <option value="TW">Taiwan, Province of China</option>
                                                                    <option value="TJ">Tajikistan</option>
                                                                    <option value="TZ">Tanzania, United Republic of</option>
                                                                    <option value="TH">Thailand</option>
                                                                    <option value="TG">Togo</option>
                                                                    <option value="TK">Tokelau</option>
                                                                    <option value="TO">Tonga</option>
                                                                    <option value="TT">Trinidad and Tobago</option>
                                                                    <option value="TN">Tunisia</option>
                                                                    <option value="TR">Turkey</option>
                                                                    <option value="TM">Turkmenistan</option>
                                                                    <option value="TC">Turks and Caicos Islands</option>
                                                                    <option value="TV">Tuvalu</option>
                                                                    <option value="UG">Uganda</option>
                                                                    <option value="UA">Ukraine</option>
                                                                    <option value="AE">United Arab Emirates</option>
                                                                    <option value="GB">United Kingdom</option>
                                                                    <option value="US">United States</option>
                                                                    <option value="UY">Uruguay</option>
                                                                    <option value="UZ">Uzbekistan</option>
                                                                    <option value="VU">Vanuatu</option>
                                                                    <option value="VE">Venezuela</option>
                                                                    <option value="VN">Viet Nam</option>
                                                                    <option value="VG">Virgin Islands (British)</option>
                                                                    <option value="VI">Virgin Islands (U.S.)</option>
                                                                    <option value="WF">Wallis and Futuna Islands</option>
                                                                    <option value="EH">Western Sahara</option>
                                                                    <option value="YE">Yemen</option>
                                                                    <option value="ZM">Zambia</option>
                                                                    <option value="ZW">Zimbabwe</option>
                                                                </select>
                                                            </Col>
                                                        </FormGroup>

                                                        <FormGroup className="select2-container mb-4" row>
                                                            <Label md="2" className="col-form-label">State</Label>
                                                            <Col md="10">
                                                                <input value={state.state} onChange={e => setState({...state, state: e.target.value})} type="text" className="form-control" id="sate" placeholder="Enter your State/City" />
                                                            </Col>
                                                        </FormGroup>
                                                        <FormGroup className="mb-0" row>
                                                            <Label htmlFor="example-textarea" md="2" className="col-form-label">Order Notes:</Label>
                                                            <Col md="10">
                                                                <textarea value={state.note} onChange={e => setState({...state, note: e.target.value})} className="form-control" id="example-textarea" rows="3" placeholder="Write some note.."></textarea>
                                                            </Col>
                                                        </FormGroup>
                                                    </Form>
                                                </div>
                                            </TabPane>
                                            <TabPane tabId="2" id="v-pills-payment" role="tabpanel" aria-labelledby="v-pills-payment-tab">
                                                <div>
                                                    <CardTitle>Payment information</CardTitle>
                                                    <CardSubtitle className="mb-3">Fill all information below</CardSubtitle>
                                                    <div>
                                                        <div className="custom-control custom-radio custom-control-inline mr-4">
                                                            <Input type="radio" value="1" id="customRadioInline1" name="customRadioInline1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="customRadioInline1"><i className="fab fa-cc-mastercard mr-1 font-size-20 align-top"></i> Credit / Debit Card</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio custom-control-inline mr-4">
                                                            <Input type="radio" value="2" id="customRadioInline2" name="customRadioInline1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="customRadioInline2"><i className="fab fa-cc-paypal mr-1 font-size-20 align-top"></i> Paypal</Label>
                                                        </div>
                                                        <div className="custom-control custom-radio custom-control-inline mr-4">
                                                            <Input type="radio" value="3" id="customRadioInline3" defaultChecked name="customRadioInline1" className="custom-control-input" />
                                                            <Label className="custom-control-label" htmlFor="customRadioInline3"><i className="far fa-money-bill-alt mr-1 font-size-20 align-top"></i> Cash on Delivery</Label>
                                                        </div>
                                                    </div>

                                                    <h5 className="mt-5 mb-3 font-size-15">For card Payment</h5>
                                                    <div className="p-4 border">
                                                        <Form>
                                                            <FormGroup className="mb-0">
                                                                <Label htmlFor="cardnumberInput">Card Number</Label>
                                                                <Input type="text" className="form-control" id="cardnumberInput" placeholder="0000 0000 0000 0000" />
                                                            </FormGroup>
                                                            <Row>
                                                                <Col lg="6">
                                                                    <FormGroup className="mt-4 mb-0">
                                                                        <Label htmlFor="cardnameInput">Name on card</Label>
                                                                        <Input type="text" className="form-control" id="cardnameInput" placeholder="Name on Card" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col lg="3">
                                                                    <FormGroup className=" mt-4 mb-0">
                                                                        <Label htmlFor="expirydateInput">Expiry date</Label>
                                                                        <Input type="text" className="form-control" id="expirydateInput" placeholder="MM/YY" />
                                                                    </FormGroup>
                                                                </Col>
                                                                <Col lg="3">
                                                                    <FormGroup className="mt-4 mb-0">
                                                                        <Label htmlFor="cvvcodeInput">CVV Code</Label>
                                                                        <Input type="text" className="form-control" id="cvvcodeInput" placeholder="Enter CVV Code" />
                                                                    </FormGroup>
                                                                </Col>
                                                            </Row>
                                                        </Form>
                                                    </div>
                                                </div>
                                            </TabPane>
                                            <TabPane tabId="3" id="v-pills-confir" role="tabpanel">
                                                <Card className="shadow-none border mb-0">
                                                    <CardBody>
                                                        <CardTitle className="mb-4">Order Summary</CardTitle>

                                                        <div className="table-responsive">
                                                            <Table className="table-centered mb-0 table-nowrap">
                                                                <thead className="thead-light">
                                                                    <tr>
                                                                        <th scope="col">Product</th>
                                                                        <th scope="col">Product Desc</th>
                                                                        <th scope="col">Price</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        state.orderSummary.map((orderitem, key) =>
                                                                            <tr key={"_orderSummary_" + key}>
                                                                                <th scope="row"><img src={orderitem.images[0]} alt="product-img" title="product-img" className="avatar-md" /></th>
                                                                                <td>
                                                                                    <h5 className="font-size-14 text-truncate"><a href="#" className="text-dark">{orderitem.productname} {!_.isEmpty(orderitem.variation) ? `(${orderitem.variation?.value})` : ''} </a></h5>
                                                                                    <p className="text-muted mb-0"> {props.paymentStore.formatToIntCurrency(orderitem.currentprice)} x {orderitem.quantity}</p>
                                                                                </td>
                                                                                <td>{props.paymentStore.formatToIntCurrency(orderitem?.total)}</td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                    <tr>
                                                                        <td colSpan="2">
                                                                            <h6 className="m-0 text-right">Sub Total:</h6>
                                                                        </td>
                                                                        <td>
                                                                            {props.paymentStore.formatToIntCurrency(getAddUpValues('total'))}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan="3">
                                                                            <div className="bg-soft-primary p-3 rounded">
                                                                                <h5 className="font-size-14 text-primary mb-0"><i className="fas fa-shipping-fast mr-2"></i> Shipping <span className="float-right">{getDeliveryCost() > 0 ? props.paymentStore.formatToIntCurrency(getDeliveryCost()) : 'Free'}</span></h5>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan="2">
                                                                            <h6 className="m-0 text-right">Total:</h6>
                                                                        </td>
                                                                        <td>
                                                                            {props.paymentStore.formatToIntCurrency(getTotal())}
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>

                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="2">
                                <Nav className="flex-column" pills>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: state.activeTab === '1' })}
                                            onClick={() => { toggleTab('1'); }}
                                        >
                                            <i className="bx bxs-truck d-block check-nav-icon mt-4 mb-2"></i>
                                            <p className="font-weight-bold mb-4">Shipping Info</p>
                                        </NavLink>
                                    </NavItem>
                                    {/* <NavItem>
                                        <NavLink
                                            className={classnames({ active: state.activeTab === '2' })}
                                            onClick={() => { toggleTab('2'); }}
                                        >
                                            <i className="bx bx-money d-block check-nav-icon mt-4 mb-2"></i>
                                            <p className="font-weight-bold mb-4">Payment Info</p>
                                        </NavLink>
                                    </NavItem> */}
                                    <NavItem>
                                        <NavLink
                                            className={classnames({ active: state.activeTab === '3' })}
                                            onClick={() => { toggleTab('3'); }}
                                        >
                                            <i className="bx bx-badge-check d-block check-nav-icon mt-4 mb-2"></i>
                                            <p className="font-weight-bold mb-4">Confirmation</p>
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>
                        </Row>
                        <Row className="my-4">
                            <Col sm="4">
                                <Link to="/cart" className="btn text-muted d-none d-sm-inline-block btn-link">
                                    <i className="mdi mdi-arrow-left mr-1"></i> Back to Shopping Cart </Link>
                            </Col>
                            <Col sm="6">
                                <div className="text-sm-right">
                                    <Link to="#" 
                                        onClick={handleSubmit} 
                                        className={state.paybutton}
                                        style={{
                                            borderRadius: 20, 
                                            fontFamily: 'Sriracha, cursive',
                                            transition: 'all 0.5s ease'
                                        }}
                                    >
                                        <i className="mdi mdi-truck-fast mr-1"></i> Pay {state.clicked? (
                                                                        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                                                                    ): <></>}
                                    </Link>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="10">
                                <div align="center">
                                    {
                                        _.isNull(state.url) ? <></> : (
                                            <span style={{color: 'black', fontSize: '18'}}>
                                                If window does not open click this &nbsp; 
                                                <a target="_blank" style={{color: 'dodgerblue'}} href={state.url}>Link</a>
                                            </span>
                                        )
                                    }
                                </div>
                            </Col>
                        </Row>
                    </div>

                </Container>
            </div>
        </React.Fragment>
    )
}

export default withRouter(withTranslation()(stateWrapper(Checkout)));