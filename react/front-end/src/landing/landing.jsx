import React from 'react';
import './Landing.css';
import Navbar from '../partials/Header/nav/nav';
const Landing = () => {
    return (
        <>
            <Navbar />
            <div className="container-fluid" id="bannernbts">
                <div className="row">
                    <div className="col-md-2" style={{ paddingTop: '15px' }}>
                        <p className="para-blood">
                            Libraries are synonymous with education and offer countless learning opportunities...
                        </p>
                    </div>
                    <div className="col-md-8 text-center">
                        <div className="banner">
                            <div id="carouselExampleCaptions" className="carousel slide text-center" data-ride="carousel">
                                <ol className="carousel-indicators">
                                    <li data-target="#carouselExampleCaptions" data-slide-to="0" className="active"></li>
                                    <li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
                                    <li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
                                    <li data-target="#carouselExampleCaptions" data-slide-to="3"></li>
                                </ol>
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img src="/image/other/1.jpg" className="d-block w-100" alt="..." />
                                        <div className="carousel-caption d-none d-md-block">
                                            <h5 className="heading">Library Management System</h5>
                                            <p style={{ textAlign: 'justify' }}>
                                                Libraries are synonymous with education and offer countless learning opportunities...
                                            </p>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <img src="/image/other/2.jpg" className="d-block w-100" alt="..." />
                                        <div className="carousel-caption d-none d-md-block">
                                            <h5 className="heading">Library Management System</h5>
                                            <p>
                                                Libraries are synonymous with education and offer countless learning opportunities...
                                            </p>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <img src="/image/other/3.jpg" className="d-block w-100" alt="..." />
                                        <div className="carousel-caption d-none d-md-block">
                                            <h5 className="heading">Library Management System</h5>
                                            <p>
                                                Libraries are synonymous with education and offer countless learning opportunities...
                                            </p>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <img src="/image/other/4.jpg" className="d-block w-100" alt="..." />
                                        <div className="carousel-caption d-none d-md-block">
                                            <h5 className="heading">Library Management System</h5>
                                            <p>
                                                Libraries are synonymous with education and offer countless learning opportunities...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <a className="carousel-control-prev" href="#carouselExampleCaptions" role="button" data-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Previous</span>
                                </a>
                                <a className="carousel-control-next" href="#carouselExampleCaptions" role="button" data-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2" style={{ paddingTop: '15px' }}>
                        <p className="para-blood">
                            As gateways to knowledge and culture, libraries play a fundamental role in society...
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Landing;
