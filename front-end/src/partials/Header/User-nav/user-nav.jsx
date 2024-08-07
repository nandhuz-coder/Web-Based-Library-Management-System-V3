import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserNav = () => {
    const [currentUser, setUser] = useState()
    const fetchUser = useEffect(() => {
        axios.get('/api/global/user').then((res) => {
            setUser(res.data.user);
        })
    }, [])
    fetchUser()
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-0">
            <div className="container">
                <Link className="navbar-brand" to="/user/1">Home</Link>
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

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                        <li className="nav-item px-2">
                            <Link className="nav-link" to="/books/all/all/1">Browse Books</Link>
                        </li>
                    </ul>

                    {currentUser && (
                        <ul className="navbar-nav ml-auto">
                            {currentUser.violationFlag && (
                                <li className="nav-item align-self-center mr-2">
                                    <i className="fa fa-flag text-danger"></i>
                                </li>
                            )}

                            <li className="nav-item dropdown mr-3">
                                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                                    <i className="fa fa-user"></i> Welcome {currentUser.username}
                                </a>
                                <div className="dropdown-menu">
                                    <Link to="/user/1/profile" className="dropdown-item">
                                        <i className="fa fa-user-circle"></i> Profile
                                    </Link>

                                    <Link to="/auth/user-logout" className="dropdown-item">
                                        <i className="fa fa-user-times"></i> Logout
                                    </Link>
                                </div>
                            </li>

                            <li className="nav-item">
                                <Link to="/user/1/notification" className="nav-link">
                                    <i className="fa fa-bell"></i>
                                    <span className="badge badge-danger badge-pill">2</span>
                                </Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default UserNav;
