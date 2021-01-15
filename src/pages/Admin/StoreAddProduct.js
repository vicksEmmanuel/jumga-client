import React, { useEffect, useRef, useState } from 'react';
import * as _ from 'lodash';
import { Container, Row, Col, Form, FormGroup, Input, Card, CardBody, CardTitle, CardSubtitle, Button, Label } from "reactstrap";
import Select from 'react-select';
import Dropzone from 'react-dropzone';
import stateWrapper from '../../containers/provider';
import { withRouter, Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import ErrorMessage from '../../components/Common/ErrorMessage';

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

const  StoreAddProduct = (props) => {
    const storeId = props.match.params?.id;
    const cleanUpCategories = (cat) => {
        let tmp = []
        Object.keys(cat).map(item => {
            tmp.push({value: item, label: item});
            Object.keys(cat[item]).map((item2, idx) => {
                let x = cat[item];
                tmp.push({value: item2, label: item2});
                _.isArray(x[item2]) ? x[item2].map(val => {
                    tmp.push({value: val, label: val});
                }) : (()=> {})();
            })
        });
        return tmp;
    }
    const [state, setState] = useState({
        selectedFiles: [],
        isLoading: true,
        productname: '',
        manufacturename: '',
        manufacturebrand: '',
        pastprice: 0.00,
        currentprice: 0.00,
        isError: false,
        errMsg: '',
        productdesc: '',
        metaname: '',
        metakeywords: '',
        metadescription: '',
        categories: [],
        isSubmitted: false,
        transferRate: '',
        deliverycost: 0.00,
        stock: 1,
        options: cleanUpCategories(props.masterStore.state.categories)
    });

    const removeImage = (f, i) => {
        let newImageFile = state.selectedFiles.filter((item, id) => {
            return item !== f && id !== i
        });

        setState({
            selectedFiles: newImageFile
        });
    }

    useEffect(() => {
        if (!props.userStore.state.storeLoaded) return;
        const checkifApproved = (storeId) => {
            let checkApproval = props.userStore.state.stores.filter(item => {
                return item.storeId == storeId && item.approved == true
            });

            if (checkApproval.length > 0) return true;
            return false;
        }
        if (!checkifApproved(storeId)) props.history.push(`/store/get-approved/${storeId}`);
        setState({...state, isLoading: false});
    }, [props.userStore.state.storeLoaded, props.userStore.state.stores])

    useEffect(() => {
        props.userStore.trackApproval(storeId, (result) => {
            if (_.isUndefined(result)) return;
            if (result.approved == false) {
               (async () => {
                if (_.isNull(props.userStore.state.user)) return;
                await props.userStore.getUserStore();
                props.history.push(`/store/get-approved/${storeId}`);
               })();
            }
        });
    }, []);

    useEffect(() => {
        if (_.isEmpty(Object.keys(props.masterStore.state.categories))) return;
        if (state.options.length > 0) return;
        setState({...state, options: cleanUpCategories(props.masterStore.state.categories)});
    }, [props.masterStore.state.categories]);

    const handleAcceptedFiles = (files) => {
        let newFiles = files.filter(item => {
            return String(item.type).includes('image');
        })
        newFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file),
            formattedSize: formatBytes(file.size)
        }));

        setState({ ...state, selectedFiles: newFiles });
    }

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const cancel = () => {
        setState({
            ...state, 
            selectedFiles: [],
            productname: '',
            manufacturename: '',
            manufacturebrand: '',
            pastprice: 0.00,
            currentprice: 0.00,
            isError: false,
            errMsg: '',
            productdesc: '',
            metaname: '',
            metakeywords: '',
            metadescription: '',
            categories: [],
            transferRate: '',
            deliverycost: 0.00,
            stock: 1
        });
    }

    const cancelForm = e => {
        e.preventDefault();
        cancel();
    }

    
    useEffect(() => {
        if (state.isError) {
            setTimeout(() => {setState({...state, isError: false, errMsg: ''})}, 10000);
        }
    }, [state.isError]);

    const submitProduct = async (e) => {
        e.preventDefault();
        setState({...state, isSubmitted: true});
        if (!(parseInt(state.currentprice) > 0)) return setState({...state, isError: true, errMsg: 'Add a valid price', isSubmitted: false});
        if (!(parseInt(state.deliverycost) > 0)) return setState({...state, isError: true, errMsg: 'Add a valid delivery cost. >', isSubmitted: false});
        if (_.isEmpty(state.productname) || String(state.productname).length <= 3) return setState({...state, isError: true, errMsg: 'Enter a valid product name', isSubmitted: false});
        if (_.isEmpty(state.productdesc) || String(state.productdesc).length < 10) return setState({...state, isError: true, errMsg: 'Make your product description presentable', isSubmitted: false});
        if (!(state.selectedFiles.length > 0)) return setState({...state, isError: true, errMsg: 'Add at least one image', isSubmitted: false});
        if (!_.isEmpty(state.metaname)) {
            if (String(state.metaname).length <= 3) return setState({...state, isError: true, errMsg: 'Add valid meta tags information', isSubmitted: false});
            if (_.isEmpty(state.metakeywords) || String(state.metakeywords).length < 2) return setState({...state, isError: true, errMsg: 'Add valid meta tags information', isSubmitted: false});
        }

        let values = {
            selectedFiles: state.selectedFiles,
            productname: state.productname,
            manufacturename: state.manufacturename,
            manufacturebrand: state.manufacturebrand,
            pastprice: state.pastprice,
            currentprice: state.currentprice,
            productdesc: state.productdesc,
            metaname: state.metaname,
            metakeywords: state.metakeywords,
            metadescription: state.metadescription,
            categories: state.categories,
            deliverycost: state.deliverycost,
            storeId: storeId,
            stock: state.stock,
        }
        try {
            
            let images = [];
            await Promise.all(values.selectedFiles.map(async (files) => {
                let url = await props.userStore.uploadImage(files, transferRate => {
                    setState({...state, transferRate: transferRate, isSubmitted: true});
                });
                images.push(url);
            }));

            values['images'] = images;
            let result = await props.userStore.createProduct(values);
            cancel();
            props.history.push(`/${result}`);

        } catch(err) {
            console.log(err);
            setState({...state, isError: true, errMsg: 'An error as occurred', isSubmitted: false});
        }
    }

    return (
        <React.Fragment>
            {
                state.isLoading ? (
                    <div style={{position: 'fixed', top: '0%', width: '100%', height: '100%', left: '0%', backgroundColor: '#f8f8fb'}}>
                        <div style={{position: 'relative', top: '45%', left: '50%'}} className="d-none d-md-block">
                            <div className="lds-ring-x"><div></div><div></div><div></div><div></div></div>
                        </div>
                        <div style={{position: 'relative', top: '45%', left: '40%'}} className="d-md-none">
                            <div className="lds-ring-x"><div></div><div></div><div></div><div></div></div>
                        </div>
                    </div>
                ) : (
                    <div className="page-content">
                         <div onClick={() => {setState({...state, errMsg: '', isError: false})}}>
                            <ErrorMessage isError={state.isError} message={state.errMsg} />
                        </div>
                        <Container fluid>

                            {/* Render Breadcrumb */}
                            <Breadcrumbs title={storeId} breadcrumbItem="Add Product" />
                            
                            <Row>
                                <Col xs="12">
                                    <Card>
                                        <CardBody>

                                            <CardTitle>Provide Product Information</CardTitle>
                                            <CardSubtitle className="mb-3">
                                                Fill all information below
                                            </CardSubtitle>

                                            <Form>
                                                <Row>
                                                    <Col sm="6">
                                                        <FormGroup>
                                                            <Label htmlFor="productname">Product Name</Label>
                                                            <Input 
                                                                onChange={e => setState({...state, productname: e.target.value})} 
                                                                id="productname" name="productname" type="text" className="form-control" value={state.productname} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="manufacturername">Manufacturer Name</Label>
                                                            <Input 
                                                                onChange={e => setState({...state, manufacturename: e.target.value})}
                                                                id="manufacturername" name="manufacturername" type="text" className="form-control" value={state.manufacturename} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="manufacturerbrand">Manufacturer Brand</Label>
                                                            <Input 
                                                                onChange={e => setState({...state, manufacturebrand: e.target.value})}
                                                                id="manufacturerbrand" name="manufacturerbrand" type="text" className="form-control" value={state.manufacturebrand} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="price">Past Price ($)</Label>
                                                            <Input 
                                                                onChange={e => setState({...state, pastprice: e.target.value})}
                                                                id="pastprice" name="pastprice" type="number" className="form-control" value={state.pastprice} />
                                                        </FormGroup>
                                                    </Col>

                                                    <Col sm="6">
                                                        <FormGroup>
                                                            <Label htmlFor="price">Current Price ($)</Label>
                                                            <Input 
                                                                onChange={e => setState({...state, currentprice: e.target.value})}
                                                                id="price" name="price" type="number" className="form-control" value={state.currentprice} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="productdesc">Product Description</Label>
                                                            <textarea 
                                                                onChange={e => setState({...state, productdesc: e.target.value})}
                                                                className="form-control" id="productdesc" rows="5" value={state.productdesc}></textarea>
                                                        </FormGroup>
                                                        <FormGroup className="select2-container">
                                                            <Label className="control-label">Features</Label>
                                                            <Select 
                                                                onChange={e => {
                                                                    setState({...state, categories: e.map(i => i.value)});
                                                                }}
                                                                classNamePrefix="select2-selection" placeholder="Choose Category" title="Category" options={state.options} isMulti />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Form>

                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardBody>
                                            <CardTitle className="mb-3">Product Images</CardTitle>
                                            <Form>
                                                <Dropzone
                                                    onDrop={acceptedFiles =>
                                                        handleAcceptedFiles(acceptedFiles)
                                                    }
                                                >
                                                    {({ getRootProps, getInputProps }) => (
                                                        <div className="dropzone">
                                                            <div
                                                                className="dz-message needsclick"
                                                                {...getRootProps()}
                                                            >
                                                                <input {...getInputProps()} />
                                                                <div className="dz-message needsclick">
                                                                    <div className="mb-3">
                                                                        <i className="display-4 text-muted bx bxs-cloud-upload"></i>
                                                                    </div>
                                                                    <h4>Drop files here or click to upload.</h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Dropzone>
                                                <div
                                                    className="dropzone-previews mt-3"
                                                    id="file-previews"
                                                >
                                                    {state.selectedFiles.map((f, i) => {
                                                        return (
                                                            <Card
                                                                onClick={e => removeImage(f, i)}
                                                                className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                                key={i + "-file"}
                                                            >
                                                                <div className="p-2">
                                                                    <Row className="align-items-center">
                                                                        <Col className="col-auto">
                                                                            <img
                                                                                data-dz-thumbnail=""
                                                                                height="80"
                                                                                className="avatar-sm rounded bg-light"
                                                                                alt={f.name}
                                                                                src={f.preview}
                                                                            />
                                                                        </Col>
                                                                        <Col>
                                                                            <Link
                                                                                to="#"
                                                                                className="text-muted font-weight-bold"
                                                                            >
                                                                                {f.name}
                                                                            </Link>
                                                                            <p className="mb-0">
                                                                                <strong>{f.formattedSize}</strong>
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </Card>
                                                        );
                                                    })}
                                                </div>
                                            </Form>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardBody>

                                            <CardTitle>Meta Data</CardTitle>
                                            <Form>
                                                <Row>
                                                    <Col sm={6}>
                                                        <FormGroup>
                                                            <Label htmlFor="metatitle">Meta title</Label>
                                                            <Input 
                                                                onChange={e => setState({...state, metaname: e.target.value})}
                                                                id="metatitle" name="metadataname" placeholder="E.g Color, Size" type="text" className="form-control" value={state.metaname} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="metakeywords">Meta Keywords (Seperate with comma [,])</Label>
                                                            <Input 
                                                                onChange={e => setState({...state, metakeywords: e.target.value})}
                                                                id="metakeywords" name="metadatavalue" placeholder="E.g Red, Black, XL, XS" type="text" className="form-control" value={state.metakeywords} />
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="price">How many are in stock</Label>
                                                            <Input 
                                                                onChange={e => setState({...state, stock: e.target.value})}
                                                                id="price" name="price" type="number" className="form-control" value={state.stock} />
                                                        </FormGroup>
                                                    </Col>

                                                    <Col sm={6}>
                                                        <FormGroup>
                                                            <Label htmlFor="metadescription">Meta Description</Label>
                                                            <textarea 
                                                                onChange={e => setState({...state, metadescription: e.target.value})}
                                                                className="form-control" id="metadescription" rows="5" value={state.metadescription}></textarea>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label htmlFor="price">Delivery Cost($)</Label>
                                                            <Input 
                                                                onChange={e => setState({...state, deliverycost: e.target.value})}
                                                                id="price" name="price" type="number" className="form-control" value={state.deliverycost} />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>

                                                <Button
                                                    onClick={() => {
                                                            setState({...state, isSubmitted: true});
                                                    }}
                                                     disabled={state.isSubmitted} type="submit" onClick={submitProduct} color="primary" className="mr-1 waves-effect waves-light">Save Changes</Button>
                                                <Button disabled={state.isSubmitted} type="submit" onClick={cancelForm} color="secondary" className="waves-effect">Cancel</Button>

                                                {state.isSubmitted == true ? (
                                                    <div 
                                                        style={{
                                                            fontSize: 15, 
                                                            fontFamily: 'Sriracha, cursive',
                                                         }}>
                                                        Loading... <div className="lds-ring"><div></div><div></div><div></div><div></div></div> {state.transferRate}
                                                    </div>
                                                ) : null}
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                )
            }
        </React.Fragment>
    );
}

export default withRouter(withTranslation()(stateWrapper(StoreAddProduct)));