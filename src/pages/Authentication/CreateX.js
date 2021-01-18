import React, { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import { withRouter, Link } from 'react-router-dom';
import { Row, Col, CardBody, Card, Alert,Container, Label } from "reactstrap";
import ErrorMessage from '../../components/Common/ErrorMessage';
import { AvForm, AvGroup, AvInput, AvFeedback} from 'availity-reactstrap-validation';
import { withTranslation } from 'react-i18next';
import stateWrapper from "../../containers/provider";
import "../../styles/Login.scss";
import logo from "../../assets/images/jumga logo.png";
import team1 from "../../assets/images/team1.png";
import team2 from "../../assets/images/team2.png";
import team3 from "../../assets/images/team3.png";
import team4 from "../../assets/images/team4.png";
import team5 from "../../assets/images/team5.png";
import stadium from "../../assets/images/stadium.jpg";
import instance from '../../helpers/axiosly';
import { configParams } from '../../config';

/**
 * TODO: Add terms and condition
 */
 const Create = (props) => {
    const [state, setState] = useState({
        loading: false,
        error: {
            email: 'Email is required',
            password: 'Password is required',
            username: 'Store name is required',
            watch: {
                email: '',
                password: '',
                username: ''
            }
        },
        email: '',
        password: '',
        username: '',
        doesStoreNameExists: true,
        doesEmailExists: true,
        imageFile: null,
        imageSrc: null,
        userType: 'Business',
        postSubmitError: false,
        postSubmitMessage: ''
    });

    const form = useRef();
    const useImageRef = useRef();
    const callImageInput = () => {
        document.getElementById("imageFile").click();
    }
  async function  handleValidSubmit(event, values) {
    event.preventDefault();
    let doesEmailExists = await processEmail(state.email);
    // let doesStoreNameExists = await processStoreName(state.username);


    if (doesEmailExists) return;
    let newValues = {
        ...values,
        imageFile: state.imageFile,
        userType: state.userType,
        downloadURL: null
    }

    let create = async () => {
            console.log(newValues);
            await props.userStore.signUp(newValues, checkError);
            props.history.push('/');
    }

    if (_.isNull(newValues.imageFile)) {
        await create();
        return;
    }
    let snaps = await props.userStore.uploadImage(newValues.imageFile, e => {});
    console.log(snaps);
    newValues.downloadURL = snaps;
    await create();
    return;
  }
  const showPreviewAndSetValue = (e) => {
    if(e.target.files && e.target.files[0]) {
        let imageFile = e.target.files[0];
        console.log(imageFile);
        if (String(imageFile.type).includes("image")) {
            const reader = new FileReader();
            reader.onload = x => {
                setState({
                    ...state,
                    imageFile,
                    imageSrc: x.target.result
                })
            }
            reader.readAsDataURL(imageFile);
        } else {
            setState({
                ...state,
                imageFile: null,
                imageSrc: null
            })
        }
    } else {
        setState({
            ...state,
            imageFile: null,
            imageSrc: null
        })
    }
  }
  const checkError =(e) => {
    console.log(e);
    setState({
        ...state,
        postSubmitError: true,
        postSubmitMessage: e
    });
  }
  const processEmail = async (e) => {

    let checker = await props.userStore.checkIfEmailExists(e);
    if (checker?.status) {
        let error = state.error;
        error.watch = {
            ...error.watch,
            email: `This email already exists`
        }
        await setState({
            ...state, 
            doesEmailExists: checker?.status, 
            error
        });
        return checker?.status;
    }

    await setState({ ...state, doesEmailExists: checker?.status});
    return checker?.status;
  }

  useEffect(() => {
        if (state.postSubmitError) {
            setTimeout(() => {setState({...state, postSubmitError: false, postSubmitMessage: ''})}, 10000);
        }
    }, [state.postSubmitError]);
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
                                                            <h5 className="text-primary text-dark">JOIN US!</h5>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <CardBody className="pt-0 border-0">
                                                <div className="p-2">

                                                    <AvForm ref={form} className="form-horizontal" onValidSubmit={(e,v) => { handleValidSubmit(e,v) }}>
                                                        <div className="business-logo">Business logo</div>
                                                        <center  className="avatar-container">
                                                            <div 
                                                                onClick={callImageInput} 
                                                                className="user-avatar"
                                                                style={{
                                                                    backgroundImage: `url(${state.imageSrc != null ? state.imageSrc : stadium})`,
                                                                    backgroundSize: 'cover',
                                                                    backgroundRepeat: 'no-repeat'
                                                                }}
                                                            >
                                                                <svg 
                                                                    version="1.1" 
                                                                    id="Layer_1" 
                                                                    xmlns="http://www.w3.org/2000/svg" 
                                                                    x="0px" y="0px"
                                                                    viewBox="0 0 512 512" 
                                                                    className="avatar-icon"
                                                                >
                                                                    <g>
                                                                        <g>
                                                                            <g>
                                                                                <circle cx="256" cy="277.333" r="106.667"/>
                                                                                <path d="M469.333,106.667h-67.656c-8.552,0-16.583-3.333-22.635-9.375l-39-39c-10.073-10.073-23.469-15.625-37.719-15.625
                                                                                    h-92.646c-14.25,0-27.646,5.552-37.719,15.625l-39,39c-6.052,6.042-14.083,9.375-22.635,9.375H42.667
                                                                                    C19.135,106.667,0,125.802,0,149.333v277.333c0,23.531,19.135,42.667,42.667,42.667h426.667
                                                                                    c23.531,0,42.667-19.135,42.667-42.667V149.333C512,125.802,492.865,106.667,469.333,106.667z M256,405.333
                                                                                    c-70.583,0-128-57.417-128-128s57.417-128,128-128s128,57.417,128,128S326.583,405.333,256,405.333z M426.667,213.333
                                                                                    c-11.76,0-21.333-9.573-21.333-21.333s9.573-21.333,21.333-21.333S448,180.24,448,192S438.427,213.333,426.667,213.333z"/>
                                                                            </g>
                                                                        </g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    <g>
                                                                    </g>
                                                                    </svg>

                                                            </div>
                                                        </center>

                                                        <AvGroup>
                                                            <Label className="form-label" for="email">EMAIL</Label>
                                                            <AvInput
                                                                onChange={e =>  setState({
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
                                                            <Label className="form-label" for="username">FULL NAME</Label>
                                                            <AvInput 
                                                                onChange={e => setState({
                                                                    ...state, 
                                                                    username: e.target.value,
                                                                    error: {
                                                                        ...state.error,
                                                                        watch: {
                                                                            ...state.error.watch,
                                                                            username: ''
                                                                        }
                                                                    }
                                                                })} 
                                                                validate={{
                                                                    minLength: { value: 3, errorMessage: "Username must be more than 3 letters"}
                                                                }}
                                                                name="username" 
                                                                id="username" 
                                                                required
                                                            />
                                                            <AvFeedback>
                                                                <i className="error-field">{state.error.username}</i>
                                                            </AvFeedback>
                                                            <i className="error-field">{state.error.watch.username}</i>
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
                                                                validate={{
                                                                    minLength: { value: 6, errorMessage: "Password must be more than 5 letters"}
                                                                }}
                                                                name="password" 
                                                                id="password" 
                                                                required 
                                                                type="password"
                                                            />
                                                            <AvFeedback><i className="error-field">{state.error.password}</i></AvFeedback>
                                                            <i className="error-field">{state.error.watch.password}</i>
                                                        </AvGroup>
                                                            
                                                        <input
                                                            ref={useImageRef} 
                                                            onChange={showPreviewAndSetValue} 
                                                            name="imageFile" 
                                                            id="imageFile"
                                                            type="file"
                                                            accept="image/*"
                                                            hidden
                                                        />

                                                        <div className="mt-3">
                                                            <button
                                                                disabled={state.loading} className="btn btn-primary btn-block waves-effect waves-light btn-dark" type="submit"
                                                                style={{backgroundColor: '#EE5C43', borderColor: '#EE5C43'}}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                        <div className="mt-3 link-ext">
                                                            By clicking the “Submit” button, you agree to Jumga’s <Link to="/terms-and-condition" className="link text-pprimary">terms of acceptable use</Link>.
                                                        </div>
                                                        <div className="mt-4 link-ext">
                                                            Have an account?<Link to="/login" className="link text-primary">Login</Link>
                                                        </div>
                                                    </AvForm>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col> 
                                <Col md={6} lg={6} xl={6} sm={12}>
                                    <img className="stadium stadium-create" src={stadium} alt="stadium" />
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

export default withRouter(withTranslation()(stateWrapper(Create)))