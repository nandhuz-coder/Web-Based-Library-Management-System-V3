import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
                            <a className="nav-link" href="/admin/bookStock/all/all/1" id="add_books">
                                Stock Out&nbsp;
                                <span className="badge badge-danger">
                                    {global.stock ? global.stock : 0}
                                </span>
                                <span className="sr-only">unread messages</span>
                            </a>
                        </li>

                        <li className="nav-item px-2">
                            <a className="nav-link" href="/admin/bookRequest/all/all/1" id="add_books">
                                Request&nbsp;
                                <span className="badge badge-success">
                                    {global.reqbook ? global.reqbook : 0}
                                </span>
                                <span className="sr-only">unread messages</span>
                            </a>
                        </li>

                        <li className="nav-item px-2">
                            <a className="nav-link" href="/admin/bookReturn/all/all/1" id="add_books">
                                Return books&nbsp;
                                <span className="badge badge-warning">
                                    {global.return ? global.return : 0}
                                </span>
                                <span className="sr-only">unread messages</span>
                            </a>
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
                                    <a href="/admin/profile" className="dropdown-item" id="profile-down">
                                        <i className="fa fa-user-circle"></i> Profile
                                    </a>
                                    <form action="/auth/admin-logout" method="post">
                                        <button type="submit" className="dropdown-item">
                                            <i className="fa fa-user-times"></i> Logout
                                        </button>
                                    </form>
                                </div>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <a href="/login" className="nav-link">Login</a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavbar;
