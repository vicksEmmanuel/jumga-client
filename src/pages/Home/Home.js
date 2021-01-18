import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Container, Row, Col, Button, Card, CardBody } from "reactstrap";
import { usePalette } from 'react-palette'
import Lottie from 'react-lottie';
import {Carousel} from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import { withTranslation } from 'react-i18next';
import * as animationData from '../../assets/images/36196-fruit-basket -grey.json';
import svg from '../../svgs';
import logo from '../../assets/images/jumga basket logo.png';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import "./home.scss";
import stateWrapper from "../../containers/provider";
import image from '../../assets/images/oliver-pecker-HONJP8DyiSM-unsplash.png';
import image2 from '../../assets/images/henry-co-cp-VMJ-mdKs-unsplash.png';
import image3 from '../../assets/images/toa-heftiba-7JaOPU9FrJA-unsplash.jpg';
import image4 from '../../assets/images/denise-jans-HoqYAnwR-1g-unsplash.jpg';
import image5 from '../../assets/images/manja-vitolic-7tOV35hnkao-unsplash.jpg';
import image7 from '../../assets/images/eric-prouzet-zv6utzkYjEY-unsplash.jpg';
import image8 from '../../assets/images/tamanna-rumee-mIqyYpSNq3o-unsplash.png';
import image9 from '../../assets/images/inside-weather-dbH_vy7vICE-unsplash.png';

 const Home = (props) => {

    const GetPallete = (image) => {
        const { data} = usePalette(image);
        return data;
    }

    const defaultOptions = {
        loop: 1,
        autoplay: true, 
        animationData: animationData.default,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }

    const bigScreen = (children) => (
        <div style={{width: '95%'}} className="d-none d-md-block">
            {children}
        </div>
    );

    const smallScreen = (children) => (
        <div style={{width: '100%'}} className="d-md-none">
            {children}
        </div>
    );

    const largeCustomIntro = () => {
        return (
            <Row className="d-none d-md-flex">
                <Col lg="6" md="6">
                    { !state.isAnimationDone ? (
                        <div style={{width: '100%', position: 'relative', top: '-40%', left: '-20%'}}>
                            <Lottie 
                                options={defaultOptions}
                                height={300}
                                width={300}
                                eventListeners={[
                                    {
                                        eventName: 'complete',
                                        callback: () => setState({...state, isAnimationDone: true})
                                    }
                                ]}
                            />
                        </div>
                    ) : (
                        <img src={logo} style={{width: 300}} />
                    )}
                </Col>
                <Col lg="6" md="6">
                    <div align="left"  style={{fontSize: '50px', lineHeight: '60px', fontWeight: '700', top: '-30%', left: '-15%', position: 'relative', color:'#D5371C'}}>
                        Jumga
                    </div>
                </Col>
            </Row>
        )
    }
    const smallCustomIntro = () => {
        return (
            <Row className="d-md-none">
                <Col lg="6" md="6" sm="6" xs="6">
                    { !state.isAnimationDone ? (
                        <div style={{width: '100%', position: 'relative', top: '-75%', left: '-30%'}}>
                            <Lottie 
                                options={defaultOptions}
                                height={200}
                                width={200}
                                eventListeners={[
                                    {
                                        eventName: 'complete',
                                        callback: () => setState({...state, isAnimationDone: true})
                                    }
                                ]}
                            />
                        </div>
                    ) : (
                        <img src={logo} style={{width: 150, top: '-75%', position: 'relative', paddingBottom: 30}} />
                    )}
                </Col>
                <Col lg="6" md="6" sm="6" xs="6">
                    <div align="left"  style={{fontSize: '30px', lineHeight: '40px', fontWeight: '700', top: '-70%', position: 'relative', color:'#D5371C', left: '-30%'}}>
                        Jumga
                    </div>
                </Col>
            </Row>
        )
    }

    const [state, setState] = useState({
        isAnimationDone: false,
        popularProducts: props.masterStore.state.popularProducts,
        recentProducts: props.masterStore.state.recentProducts,
        selected: 'itemp0',
        selectedx: 'itemx0',
        selectedp: 'itemt0',
        alignCenter: true,
        clickWhenDrag: false,
        dragging: true,
        hideArrows: true,
        hideSingleArrow: true,
        // itemsCount: list.length,
        scrollToSelected: false,
        translate: 0,
        transition: 0.3,
        wheel: true,
    });

    const slides = [
        {
            img: image9,
            pallete: GetPallete(image9),
            click: () => {
                props.history.push('/categories/Furnitures');
            }
        },
        {
            img: image8,
            pallete: GetPallete(image8),
            click: () => {
                props.history.push('/search/');
            }
        },
        {
            img: image2,
            pallete: GetPallete(image2),
            click: () => {
                props.history.push('/categories/Clothing');
            }
        },
        {
            img: image,
            pallete: GetPallete(image),
            click: () => {
                props.history.push('/categories/Computer');
            }
        }
    ]

    const onSelect = key => {
        setState({ ...state, selected: key });
    }

    const onSelectX = key => {
        setState({ ...state, selectedx: key });
    }

    const onSelectP = key => {
        setState({ ...state, selectedp: key });
    }

    const temp =  [
    { name: "item0" },
    { name: "item1" },
    { name: "item2" },
    { name: "item3" },
    { name: "item4" },
    { name: "item5" },
    { name: "item6" },
    { name: "item7" },
    { name: "item8" },
    { name: "item9" },
    { name: "item10" },];

    const loadData = async () => {
       if (props.masterStore.state.popularProducts.length > 0) return;

        let recentProducts = await props.masterStore.getRecentProducts();
        let popularProducts = await props.masterStore.getPopularProducts();

        setState({
            ...state,
            popularProducts,
            recentProducts
        });

        console.log("Recent product", recentProducts);
        console.log("Popular product", popularProducts);
    };
    
    useEffect(() => {
        loadData();
    }, []);

    const ArrowLeft = () => {
        return (
            <div>
                <i className="bx bxs-left-arrow-square" style={{fontSize: 14}}></i>
            </div>
        )
    };

    const ArrowRight = () => {
        return (
            <div>
                <i className="bx bxs-right-arrow-square" style={{fontSize: 14}}></i>
            </div>
        )
    }

    const AnimatedMenuItem = ({text, selected}) => {
        return (
            <div
            className={`menu-item ${selected ? 'active' : ''}`}
            >
              <Link to={`/#`}>
                <Card
                    style={{width: 180, height: 200, marginLeft: 10, backgroundColor: 'rgba(225,225,225,0.6)'}}
                    className="opa" 
                >
                    <CardBody>
                    </CardBody>
                </Card>
            </Link>
          </div>
        )
    }

    const calculatePercentage = (newPrice, oldPrice) => {
        const difference = Number(oldPrice) - Number(newPrice);
        return Math.round((difference / oldPrice) * 100);
    }

    const MenuItem = ({
        productId,
        images,
        productname,
        currentprice,
        pastprice,
        selected
    }) => {
        return (
            <div
                className={`menu-item ${selected ? 'active' : ''}`}
            >
                <Link to={`/${productId}`}>
                    <Card>
                        <CardBody>
                            <div className="product-img position-relative">
                                {
                                    Number(currentprice) < Number(pastprice)
                                        ? <div className="avatar-sm product-ribbon">
                                            <span className="avatar-title rounded-circle  bg-primary">
                                                {calculatePercentage(currentprice, pastprice) + "%"}
                                            </span>
                                        </div>
                                        : null
                                }

                                <img src={images} alt="" className="img-fluid mx-auto d-block"  style={{height: 70}}/>
                            </div>
                            <div className="mt-4 text-center">
                                <h5 className="mb-3 text-truncate"><Link to={"/" + productId} className="text-dark">{productname} </Link></h5>
                                <h5 className="my-0">
                                    <div className="text-muted mr-2"><del>{props.paymentStore.formatToIntCurrency(pastprice)}</del></div> 
                                    <b>{props.paymentStore.formatToIntCurrency(currentprice)}</b></h5>
                            </div>
                        </CardBody>
                    </Card>
                </Link>
         </div>
        )
    }

    const AnimatedMenu = (list, selected) =>{
        return list.map((el, id) => {
            const {name} = el;
        
            return <AnimatedMenuItem text={name} key={name} selected={selected} />;
        });
    }

    const Menu = (list, selected) => {
        return list.map((el, id) => {
            const {
                name, 
                productId,
                images,
                productname,
                pastprice,
                currentprice
            } = el;
        
            return <MenuItem 
                productId={productId}
                images={images}
                productname={productname}
                pastprice={pastprice}
                currentprice={currentprice}
                key={name} 
                selected={selected}
                 />;
        });
    }

    const categories = [
        {
            name: 'itemt0',
            img: image3,
            categoryname: 'Furniture'
        },
        {
            name: 'itemt1',
            img: image4,
            categoryname: 'Games'
        },
        {
            name: 'itemt2',
            img: image5,
            categoryname: 'Decorations'
        },
        {
            name: 'itemt4',
            img: image7,
            categoryname: 'Comics'
        }
    ]

    const CategoriesItem = ({
        categoryname,
        image,
        selected
    }) => {
        return (
            <div
            className={`menu-item ${selected ? 'active' : ''}`}
            >
              <Link to={`/categories/${categoryname}`}>
                <Card
                    style={{width: '500px', height: '500px', borderRadius: 20}}
                >
                    <CardBody>
                        <h6>{categoryname}</h6>
                        <LazyLoadImage
                            style={{width: '90%', height: '90%', borderRadius: 20}}
                            src={image}
                        />
                    </CardBody>
                </Card>
            </Link>
          </div>
        )
    }

    const Categories = (list, selected) => {
        return list.map((el, id) => {
            const {
                name, 
                categoryname,
                img
            } = el;
        
            return <CategoriesItem 
                    categoryname={categoryname}
                    image={img}
                    key={name} 
                    selected={selected}
                 />;
        });
    }

    const homeBig = () => {
        return (
            <div style={{width: '100%', marginTop: '2%'}}>
                <Row>
                    <Col xs="12">
                        <div style={{width: '100%', margin: 0}} align="left">
                            <Row style={{marginBottom: '5%'}}>
                                <Col lg="4" md="6" sm="12">
                                    <Row>
                                        <Col lg="12">
                                            <div className="page-title-box d-flex align-items-center justify-content-between" style={{margin: 0, padding: 0}}>
                                                <div className="mb-0" style={{fontSize: '20px', lineHeight: '32px', fontWeight: '700', zIndex: 400, color: '#0f1c70'}}>{props.t("Buy anything, anytime, anywhere")}</div>
                                            </div>
                                            <div style={{position: 'relative', top: '-35%', opacity: 0.9, left: '-50px', height: 150}} align="left">
                                                <svg.zigzag width="200px" height="200px"/>
                                            </div>
                                        </Col>
                                    </Row>
                                    {largeCustomIntro()}
                                    {smallCustomIntro()}
                                </Col>
                                <Col lg="8" md="6" sm="12" align="right">
                                    <Row>
                                        <Col lg="2" md="2" sm="12"></Col>
                                        <Col>
                                            <Carousel 
                                                // className="dropshadow"
                                            >
                                                {slides.map((item, id) => {
                                                        return (
                                                            <Carousel.Item key={id}>
                                                                 <LazyLoadImage
                                                                    style={{width: '100%', height: '400px', borderRadius: 5}}
                                                                    src={item.img}
                                                                />
                                                                <Carousel.Caption>
                                                                    <Button 
                                                                        onClick={item.click}
                                                                        style={{color: item.pallete?.lightMuted, backgroundColor: item.pallete?.vibrant, outline: 0, border: 0}}>
                                                                        Shop Now
                                                                    </Button>
                                                                </Carousel.Caption>
                                                            </Carousel.Item>
                                                        )
                                                    })}
                                            </Carousel>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="12">
                                    <div style={{width: '100%', }}>
                                      <Row style={{backgroundColor: 'blue', color: 'white', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                                          <Col lg="9" md="9" sm="8" xs="8">
                                              Recent Items
                                          </Col>
                                          <Col 
                                                lg="3" md="3" sm="4" xs="4" align="right" style={{cursor: 'pointer'}} 
                                                onClick={() => {
                                                    props.history.push('/search/');
                                                }}
                                            >View all <i className="bx bxs-right-arrow-alt"></i> </Col>
                                      </Row>
                                      <Row style={{backgroundColor: 'white'}}>
                                        <Col lg="12">
                                            {state.recentProducts.length > 0 ? (
                                                <ScrollMenu
                                                    data={Menu(state.recentProducts, 'itemx0')}
                                                    arrowLeft={ArrowLeft()}
                                                    arrowRight={ArrowRight()}
                                                    selected={state.selectedx}
                                                    onSelect={onSelectX}
                                                    alignCenter={state.alignCenter}
                                                    clickWhenDrag={state.clickWhenDrag}
                                                    transition={+state.transition}
                                                    translate={state.translate}
                                                    wheel={state.wheel}
                                                />
                                            ) : (
                                                <ScrollMenu
                                                    data={AnimatedMenu(temp, 'item0')}
                                                    arrowLeft={ArrowLeft()}
                                                    arrowRight={ArrowRight()}
                                                    selected={state.selectedx}
                                                    onSelect={onSelectX}
                                                    alignCenter={state.alignCenter}
                                                    clickWhenDrag={state.clickWhenDrag}
                                                    transition={+state.transition}
                                                    translate={state.translate}
                                                    wheel={state.wheel}
                                                />
                                            )}
                                        </Col>
                                      </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="12">
                                    <div style={{width: '100%', }}>
                                      <Row style={{backgroundColor: 'red', color: 'white', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                                          <Col lg="9" md="9" sm="8" xs="8">
                                              Popular Items
                                          </Col>
                                          <Col 
                                            lg="3" md="3" sm="4" xs="4" align="right" style={{cursor: 'pointer'}}
                                            onClick={() => {
                                                props.history.push('/search/');
                                            }}
                                            >View all <i className="bx bxs-right-arrow-alt"></i> </Col>
                                      </Row>
                                      <Row style={{backgroundColor: 'white'}}>
                                        <Col lg="12">
                                            {state.popularProducts.length > 0 ? (
                                                <ScrollMenu
                                                    data={Menu(state.popularProducts, 'itemp0')}
                                                    arrowLeft={ArrowLeft()}
                                                    arrowRight={ArrowRight()}
                                                    selected={state.selected}
                                                    onSelect={onSelect}
                                                    alignCenter={state.alignCenter}
                                                    clickWhenDrag={state.clickWhenDrag}
                                                    transition={+state.transition}
                                                    translate={state.translate}
                                                    wheel={state.wheel}
                                                />
                                            ) : (
                                                <ScrollMenu
                                                    data={AnimatedMenu(temp, 'item0')}
                                                    arrowLeft={ArrowLeft()}
                                                    arrowRight={ArrowRight()}
                                                    selected={state.selected}
                                                    onSelect={onSelect}
                                                    alignCenter={state.alignCenter}
                                                    clickWhenDrag={state.clickWhenDrag}
                                                    transition={+state.transition}
                                                    translate={state.translate}
                                                    wheel={state.wheel}
                                                />
                                            )}
                                        </Col>
                                      </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Row style={{backgroundColor: 'white'}}>
                                <Col lg="12">
                                    <div style={{width: '100%', }}>
                                      <Row style={{borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
                                          <Col lg="9" md="9" sm="8" xs="8">
                                                <h4>Categories</h4>
                                          </Col>
                                      </Row>
                                      <Row style={{backgroundColor: 'white'}}>
                                        <Col lg="12">
                                            <ScrollMenu
                                                data={Categories(categories, 'itemt0')}
                                                selected={state.selectedp}
                                                onSelect={onSelectP}
                                                alignCenter={state.alignCenter}
                                                clickWhenDrag={state.clickWhenDrag}
                                                transition={+state.transition}
                                                translate={state.translate}
                                                wheel={state.wheel}
                                                arrowLeft={ArrowLeft()}
                                                arrowRight={ArrowRight()}
                                            />
                                        </Col>
                                      </Row>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <center>
                            {bigScreen(homeBig())}
                            {smallScreen(homeBig())}
                        </center>
                    </Container>
                </div>
            </React.Fragment>
        );
    }

export default withRouter(withTranslation()(stateWrapper(Home)))
