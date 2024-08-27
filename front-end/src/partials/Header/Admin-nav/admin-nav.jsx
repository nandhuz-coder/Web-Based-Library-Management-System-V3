import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
const AdminNavbar = () => {
    const [global, setGlobal] = useState([]);
    const [currentUser, setCurrentUser] = useState();

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/global');
            const data = await response.data;
            setGlobal(data.global);
            setCurrentUser(data.currentUser);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 60000);
        return () => clearInterval(interval);
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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-0 sticky-top">
            <div className="container">
                <a className="navbar-brand" href="/admin">Home</a>
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
                            <Link to={`/admin/books/bookInventory/`} id="book_inventory" title="Book Inventory" className="nav-link">Book Inventory</Link>
                        </li>

                        <li className="nav-item px-2">
                            <Link to={`/admin/1/users/`} id="users_list" title="Users" className="nav-link">Users</Link>
                        </li>

                        <li className="nav-item px-2">
                            <Link to={`/admin/1/addbook`} id="add_book" title="Add Books" className="nav-link">Add Books</Link>
                        </li>

                        <li className="nav-item px-2">
                            <Link to={`/admin/1/book/stockout`} id="stock_out" title="Stock Out" className="nav-link">StockOut&nbsp;
                                <span className="badge badge-danger">
                                    {global.stock ? global.stock : 0}
                                </span>
                            </Link>
                        </li>

                        <li className="nav-item px-2">
                            <Link to={`/admin/1/book/request`} id="request" title="request" className="nav-link">Request&nbsp;
                                <span className="badge badge-success">
                                    {global.reqbook ? global.reqbook : 0}
                                </span>
                            </Link>
                        </li>

                        <li className="nav-item px-2">
                            <Link to={`/admin/1/book/return`} id="return" title="return" className="nav-link">Return&nbsp;
                                <span className="badge badge-warning">
                                    {global.return ? global.return : 0}
                                </span>
                            </Link>
                        </li>

                        <li className="nav-item px-2">
                            <Link to={`/books`} title="Browse Books" className="nav-link">
                                Browse Books
                            </Link>
                        </li>
                    </ul>

                    <ul className="navbar-nav ml-auto">
                        {currentUser ? (
                            <li className="nav-item dropdown mr-3">
                                <a
                                    href="#"
                                    className="nav-link dropdown-toggle"
                                    data-toggle="dropdown"
                                    id="admin-drop-down"
                                >
                                    <i className="fa fa-user"></i> Welcome {currentUser.username}
                                </a>
                                <div className="dropdown-menu">
                                    <Link to={`/admin/1/profile`} title="profile" className="dropdown-item">
                                        <i className="fa fa-user-circle"></i> Profile
                                    </Link>
                                    <a href="" onClick={(e) => getUserLogout(e)} className="dropdown-item">
                                        <i className="fa fa-user-times"></i> Logout
                                    </a>
                                    <Link className="dropdown-item" to={"/user/dashboard/1"}>
                                        <i className="fa fa-gear"></i> User Dashboard</Link>
                                </div>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <a href="/login" className="nav-link">
                                    <i className="fa fa-gear"></i> ProfileLogin
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavbar;
