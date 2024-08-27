import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserNav = () => {
    const [currentUser, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/api/global/user');
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser();
    }, []);
    const navigate = useNavigate();
    const getUserLogout = async (e) => {
        try {
            e.preventDefault();
            await axios.get('/auth/1/user-logout');
            navigate('/');
        } catch (error) {
            navigate('/');
        }
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-0">
            <div className="container">
                <Link className="navbar-brand" to={"/user/dashboard/1"}>Home</Link>
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
                            <Link className="nav-link" to={"/books/"}>Browse Books</Link>
                        </li>
                    </ul>

                    {currentUser && currentUser.isAdmin && (
                        <ul className="navbar-nav">
                            <li className="nav-item px-2">
                                <Link className="nav-link" to={"/admin"}>Admin Dashboard</Link>
                            </li>
                        </ul>
                    )}

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
                                    <Link to={"/user/1/profile"} className="dropdown-item">
                                        <i className="fa fa-user-circle"></i> Profile
                                    </Link>
                                    <a href="" className="dropdown-item" onClick={(e) => getUserLogout(e)}>
                                        <i className="fa fa-user-times"></i> Logout
                                    </a>
                                </div>
                            </li>

                            <li className="nav-item">
                                <Link to={"/user/1/notification"} className="nav-link">
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
