import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import Navbar from '../partials/Header/nav/nav';
import Loading from '../Loading/Loading';

const Landing = ({ IfUser }) => {
    return (
        <>
            <div className="body1">
                <IfUser />
                <Suspense fallback={<Loading />}>
                    <Navbar />
                    <div className="container-fluid" id="hero-section">
                        <div className="row align-items-center">
                            <div className="col-md-12 text-center text-md-leftc p-3">
                                <h1 className="display-4">Welcome to Our Library</h1>
                                <p className="lead">Explore a world of knowledge and culture.</p>
                                <Link to="/books" className="btn btn-primary btn-lg">Browse Books</Link>
                            </div>
                        </div>
                    </div>
                    <div className="container my-5" id="about-section">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <h2>About Our Library</h2>
                                <p className="lead">
                                    As gateways to knowledge and culture, libraries play a fundamental role in society. The resources and services they offer create opportunities for learning, support literacy and education, and help shape the new ideas and perspectives that are central to a creative and innovative society.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="container my-5" id="services-section">
                        <div className="row">
                            <div className="col-md-4 text-center">
                                <h3>Our Services</h3>
                                <p>We offer a wide range of services including book lending, digital resources, and community events.</p>
                            </div>
                            <div className="col-md-4 text-center">
                                <h3>Testimonials</h3>
                                <p>"The library has been a great resource for my studies. The staff are always helpful and the collection is extensive." - Jane Doe</p>
                            </div>
                            <div className="col-md-4 text-center">
                                <h3>Join Us</h3>
                                <p>Become a member today and start exploring the vast resources available at our library.</p>
                                <Link to="/auth/user-signup" className="btn btn-secondary btn-lg">Sign Up</Link>
                            </div>
                        </div>
                    </div>
                </Suspense>
            </div>
        </>
    );
}

export default Landing;