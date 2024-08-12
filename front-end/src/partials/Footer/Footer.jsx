import React from 'react';
import './footer.css'
function Footer() {
    return (
        <>
            <section className="foot">
                <div className="container-fluid">
                    <h3 className="contact-topic">Contact Us</h3>
                    <div className="row">
                        <div
                            className="col-lg-6 col-md-6 col-sm-6 footer-col"
                            style={{ paddingLeft: '20px' }}
                            data-aos="flip-left"
                        >
                            <div>
                                <p className="p1 text-center">Give Us Feedback</p>
                                <form method="post" name="sentMessage" id="contactForm">
                                    <div className="form-group">
                                        <label className="contact-p1">Full Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            id="name"
                                            required
                                            style={{ backgroundColor: 'transparent' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="contact-p1">Phone Number:</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            name="phone"
                                            id="phone"
                                            required
                                            style={{ backgroundColor: 'transparent' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="contact-p1">Email Address:</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            id="email"
                                            required
                                            style={{ backgroundColor: 'transparent' }}
                                        />
                                    </div>
                                    <input
                                        type="submit"
                                        name="sub"
                                        value="Send Now"
                                        className="btn btn-primary"
                                    />
                                </form>
                            </div>
                            <div>
                                <ul className="list-unstyled list-inline text-center">
                                    <li className="list-inline-item">
                                        <a
                                            href="https://www.facebook.com/"
                                            className="btn-floating btn-gplus mx-1"
                                        >
                                            <i className="fa fa-facebook-f"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a
                                            href="https://twitter.com/"
                                            className="btn-floating btn-gplus mx-1"
                                        >
                                            <i className="fa fa-twitter"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a
                                            href="https://plus.google.com/u/0/"
                                            className="btn-floating btn-gplus mx-1"
                                        >
                                            <i className="fa fa-google-plus-g"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div
                            className="col-lg-6 col-md-6 col-sm-6 footer-col"
                            data-aos="flip-right"
                            style={{ paddingLeft: '50px' }}
                        >
                            <p className="contact-para">
                                <strong className="contact-strong">Phone :</strong>
                                <span className="abcd">
                                    General : +94 112369931-4<br />
                                    Inquiry Section : +94 117220677
                                </span>
                            </p>
                            <br />
                            <p className="contact-para">
                                <strong className="contact-strong">Fax :</strong>
                                <span style={{ float: 'right', marginRight: '50%' }}>+94 112369939</span>
                            </p>
                            <p className="contact-para">
                                <strong className="contact-strong">Email : </strong>
                                <a href="mailto:name@example.com">
                                    <span style={{ float: 'right', marginRight: '55%', color: '#fff' }}>
                                        info@lib.lk
                                    </span>
                                </a>
                            </p>
                            <p className="contact-para">
                                <strong className="contact-strong">Address : </strong>
                                <span className="abcde">
                                    Colombo Library Center<br />
                                    No 222/5D<br />
                                    Elvitigala mawatha<br />
                                    Narahenpita<br />
                                    Colombo 05<br />
                                    Sri Lanka.
                                </span>
                            </p>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>

                <div className="footer-copyright text-center py-3 copy">
                    <p>
                        Copyright © 2021 Library Management System. All Rights Reserved{' '}
                        <a href="/homepage">Library Management System</a>
                    </p>
                </div>
            </section>
        </>
    );
}

export default Footer;
