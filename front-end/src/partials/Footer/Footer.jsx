import React from 'react';
import './footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <section className="bg-secondary2 text-white text-center py-3">
            <div className="container">
                <div className="footer-nav mb-3">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/books" className="nav-link">Books</Link>
                    <Link to="/about" className="nav-link">About Us</Link>
                    <Link to="/contact" className="nav-link">Contact Us</Link>
                    <Link to="/privacy" className="nav-link">Privacy Policy</Link>
                </div>
                <div className="footer-additional-info mb-3">
                    <p className="mb-1">Contact us: <a href="mailto:support@example.com" className="text-primary">support@example.com</a></p>
                    <p className="mb-1">Follow us on:
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary mx-1">Facebook</a> |
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-primary mx-1">Twitter</a> |
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary mx-1">Instagram</a>
                    </p>
                </div>
                <p className="copyright mb-0">
                    &copy; {currentYear} Library Management System. All Rights Reserved.
                </p>
            </div>
        </section>
    );
}

export default Footer;
