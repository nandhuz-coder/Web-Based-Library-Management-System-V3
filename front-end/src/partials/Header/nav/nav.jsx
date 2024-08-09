import React from 'react';
import { Link } from 'react-router-dom'
import './nav.css'
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <a className="navbar-brand" href="#">
        <img
          src="/image/other/purepng.com-booksbookillustratedwrittenprintedliteratureclipart-1421526451707uyace.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt=""
        />
        Library Management System
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item"><Link className='btn btn-success' to={'/auth/admin-login'}>Admin Login</Link></li>
          <li className="nav-item pl-2"><Link className='btn btn-success' to={'/auth/user-login'}>user Login</Link></li>
          <li className="nav-item pl-2"><Link className='btn btn-success' to={'/auth/user-signup'}>User Sign Up</Link></li>
          <li className="nav-item pl-2"><Link className='btn btn-success' to={'/books/'}>Browse Books</Link></li>
        </ul>
        <form className="form-inline my-2 my-lg-0">
          <div className="input-group">
            <input
              className="form-control mr-sm-2"
              type="text"
              placeholder="Search"
              aria-label="Search"
              style={{ marginRight: '0px' }}
            />
            <div className="input-group-append">
              <button className="btn btn-secondary btn-search" type="button">
                <i className="fa fa-search"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
