import React, { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col, CardBody, Card, Container, Label } from "reactstrap";
import { withTranslation } from 'react-i18next';
import { AvForm, AvGroup, AvInput, AvFeedback} from 'availity-reactstrap-validation';
import "../../styles/Login.scss";
import logo from "../../assets/images/jumga logo.png";
import team1 from "../../assets/images/team1.png";
import team2 from "../../assets/images/team2.png";
import team3 from "../../assets/images/team3.png";
import team4 from "../../assets/images/team4.png";
import team5 from "../../assets/images/team5.png";
import stadium from "../../assets/images/stadium.jpg";
import stateWrapper from '../../containers/provider';
import ErrorMessage from '../../components/Common/ErrorMessage';


 const Login = (props) => {
    const [state, setState] = useState({
        loading: false,
        doesEmailExists: true,
        postSubmitError: false,
        postSubmitMessage: '',
        error: {
            email: 'Email is required',
            password: 'Password is required',
            watch: {
                email: '',
                password: ''
            }
        },
        email: '',
        password: ''
    });
    const form = useRef();
    async function  handleValidSubmit(event, values) {
        event.preventDefault();
        console.log(values);
        let doesEmailExists = await processEmail(state.email);
        if (!doesEmailExists) return;
        let done = await props.userStore.signIn(values, props);
        if (!done.status) {
            await checkError(done?.message);
            return;
        }

        props.history.push('/');
    }

    // useEffect(() => {
    //     props.userStore.logOut(props);
    //     console.log('jerr')
    // }, [])

    useEffect(() => {
        if (state.postSubmitError) {
            setTimeout(() => {setState({...state, postSubmitError: false, postSubmitMessage: ''})}, 10000);
        }
    }, [state.postSubmitError]);

    const processEmail = async (e) => {

        let checker = await props.userStore.checkIfEmailExists(e);
        if (!checker?.status) {
            let error = state.error;
            error.watch = {
                ...error.watch,
                email: `This email does not exist`
            }
            await setState({
                ...state, 
                doesEmailExists: !checker?.status, 
                error
            });
            return checker?.status;
        }
    
        await setState({ ...state, doesEmailExists: !checker?.status});
        return checker?.status;
      }

    const checkError = async (e) => {
        await setState({
            ...state,  
            postSubmitError: true,
            postSubmitMessage: e,
        });
    }

    return (
        <React.Fragment>  
            <div onClick={() => {setState({...state, postSubmitMessage: '', postSubmitError: false})}}>
                <ErrorMessage isError={state.postSubmitError} message={state.postSubmitMessage} />
            </div>
            <div>
                <Link to="/">
                    <img className="logo d-none d-md-inline-block" src={logo} alt="logo" />
                    <img className="logo-small d-md-none" src={logo} alt="logo" />
                </Link>
            </div>
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <div>
                        <img className="avatar  team1 d-none d-md-inline-block" src={team1} alt="team1" />
                        <img className="avatar team2 d-none d-md-inline-block" src={team2} alt="team2" />
                        <img className="avatar team3 d-none d-md-inline-block" src={team3} alt="team3" />
                        <img className="avatar team4 d-none d-md-inline-block" src={team4} alt="team4" />
                        <img className="avatar team5 d-none d-md-inline-block" src={team5} alt="team5" />
                        <img className="avatar  team1-small d-md-none" src={team1} alt="team1" />
                        <img className="avatar team2-small d-md-none" src={team2} alt="team2" />
                        <img className="avatar team3-small d-md-none" src={team3} alt="team3" />
                        <img className="avatar team4-small d-md-none" src={team4} alt="team4" />
                        <img className="avatar team5-small d-md-none" src={team5} alt="team5" />
                    </div>
                    <Row className="justify-content-center overflow-hidden">
                        <Col className="box" style={{padding:0}} lg={9} md={12} sm={12}>
                            <Row>
                                <Col style={{padding: 30}} md={6} lg={4} xl={6} sm={12}>
                                        <Card className="overflow-hidden border-0">
                                            <div>
                                                <Row>
                                                    <Col className="col-12">
                                                        <div className="text-primary text-center text-dark">
                                                            <h5 className="text-primary text-dark">Welcome back !</h5>
                                                            <p>We're so excited to see you again!</p>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <CardBody className="pt-0 border-0">
                                                <div className="p-2">

                                                    <AvForm ref={form} className="form-horizontal" onValidSubmit={(e,v) => { handleValidSubmit(e,v) }}>
                                                        <AvGroup>
                                                            <Label className="form-label" for="email">EMAIL</Label>
                                                            <AvInput 
                                                                onChange={e =>
                                                                    setState({
                                                                    ...state, 
                                                                    email: e.target.value,
                                                                    error: {
                                                                        ...state.error,
                                                                        watch: {
                                                                            ...state.error.watch,
                                                                            email: ''
                                                                        }
                                                                    }
                                                                })} 
                                                                name="email" 
                                                                id="email" 
                                                                required 
                                                                type="email"
                                                            />
                                                            <AvFeedback><i className="error-field">{state.error.email}</i></AvFeedback>
                                                            <i className="error-field">{state.error.watch.email}</i>
                                                        </AvGroup>

                                                        <AvGroup>
                                                            <Label className="form-label" for="password">PASSWORD</Label>
                                                            <AvInput 
                                                                onChange={e => 
                                                                    setState({
                                                                        ...state, 
                                                                        password: e.target.value,
                                                                        error: {
                                                                            ...state.error,
                                                                            watch: {
                                                                                ...state.error.watch,
                                                                                password: ''
                                                                            }
                                                                        }
                                                                    })
                                                                } 
                                                                name="password" 
                                                                validate={{
                                                                    minLength: { value: 6, errorMessage: "Password must be more than 5 letters"}
                                                                }}
                                                                id="password" 
                                                                required 
                                                                type="password"
                                                            />
                                                            <AvFeedback><i className="error-field">{state.error.password}</i></AvFeedback>
                                                            <i className="error-field">{state.error.watch.password}</i>
                                                        </AvGroup>

                                                        <div className="mt-4">
                                                            <Link to="/forgot-password" className="text-muted text-primary link"><i className="mdi mdi-lock mr-1"></i> Forgot your password?</Link>
                                                        </div>
                                                        <div className="mt-3">
                                                            <button
                                                                disabled={state.loading} className="btn btn-primary btn-block waves-effect waves-light btn-dark" type="submit" style={{backgroundColor: '#EE5C43', borderColor: '#EE5C43'}}>
                                                                Login
                                                            </button>
                                                        </div>
                                                        <div className="mt-4 link-ext">
                                                            Need an account?<Link to="/register" className="link text-primary"> Register</Link>
                                                        </div>
                                                    </AvForm>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col> 
                                <Col md={6} lg={6} xl={6} sm={12}>
                                    <img className="stadium" src={stadium} alt="stadium" />
                                    <div className="writing">
                                        <div className="text-to-show">
                                            A market place for all
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
     );
    }

export default withRouter(withTranslation()(stateWrapper(Login)))