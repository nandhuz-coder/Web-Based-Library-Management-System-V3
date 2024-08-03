import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alert from '../../partials/Header/alert/alert';
import AdminNavbar from '../../partials/Header/Admin-nav/admin-nav';

const BookRequestInventory = ({ IfAdmin }) => {
    const [books, setBooks] = useState([]);
    const [filter, setFilter] = useState('');
    const [searchName, setSearchName] = useState('');
    const [current, setCurrent] = useState(1);
    const [pages, setPages] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchBooks(filter, searchName, current);
    }, [filter, current]);

    const fetchBooks = async (filter, value, page) => {
        try {
            if (!filter || !value || value.trim().length === 0) {
                filter = "all";
                value = "all";
            }
            const response = await axios.get(`/admin/bookRequest/${filter}/${value}/${page}`);
            setBooks(response.data.books);
            setPages(response.data.pages);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch books');
        }
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleSearchNameChange = (e) => {
        setSearchName(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrent(1);
        fetchBooks(filter, searchName, 1);
    };

    const handlePagination = (page) => {
        setCurrent(page);
    };

    const HandleAccept = (e, book) => {
        axios.get(`/api/admin/book/request/accept/${book}`).then((res) => {
            if (res.data.error)
                setError(res.data.error)
            setSuccess(res.data.success)
            fetchBooks(filter, searchName, current)
        })
    }

    const HandleDecline = (e, book) => {
        e.preventDefault()
        axios.get(`/api/admin/book/request/decline/${book}`).then((res) => {
            if (res.data.error)
                setError(res.data.error)
            setSuccess(res.data.success)
            fetchBooks(filter, searchName, current)
        })
    }

    const dismissAlert = (type) => {
        if (type === 'error') {
            setError('');
        } else if (type === 'success') {
            setSuccess('');
        }
    };

    return (
        <>
            <IfAdmin />
            <Suspense fallback={IfAdmin}>
                <AdminNavbar />
                <header id="main-header" className="py-2 bg-primary text-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <h1><i className="fa fa-pencil"></i> Request Book Inventory</h1>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ACTIONS */}
                <section id="search_bar" className="my-3 py-4 bg-light">
                    <div className="container">
                        <form onSubmit={handleSearch}>
                            <div className="row">
                                <div className="col-md-5 p-1">
                                    <select name="filter" id="book_select" className="form-control" onChange={handleFilterChange} value={filter}>
                                        <option value="" disabled>Select Option...</option>
                                        <option value="title">Title</option>
                                        <option value="author">Author</option>
                                        <option value="username">UserName</option>
                                    </select>
                                </div>

                                <div className="col-md-5 p-1">
                                    <input
                                        name="searchName"
                                        type="text"
                                        className="form-control"
                                        placeholder="Search Books"
                                        value={searchName}
                                        onChange={handleSearchNameChange}
                                    />
                                </div>

                                <div className="col-md-2 p-1">
                                    <input type="submit" className="btn btn-outline-primary btn-block" value="Search" />
                                </div>
                            </div>
                        </form>
                    </div>
                </section>

                <Alert success={success} error={error} dismissAlert={dismissAlert} />

                {/* BOOK INVENTORY */}
                <section id="bookInventory" className="mt-5">
                    <div className="container" style={{ maxWidth: '80%' }}>
                        <div className="row">
                            <div className="col">
                                <div className="card">
                                    <table className="table table-striped">
                                        <thead className="thead-inverse">
                                            <tr>
                                                <th>Title</th>
                                                <th>Author</th>
                                                <th>ISBN</th>
                                                <th>Stock</th>
                                                <th>User</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {books.map(book => (
                                                <tr key={book._id}>
                                                    <td>{book.book_info.title}</td>
                                                    <td>{book.book_info.author}</td>
                                                    <td>{book.book_info.ISBN}</td>
                                                    <td>{book.book_info.stock}</td>
                                                    <td>{book.user_id.username}</td>
                                                    <td>
                                                        <span>
                                                            {book.book_info.stock !== '0' ? (
                                                                <button
                                                                    onClick={(e) => HandleAccept(e, book._id)}
                                                                    className="btn btn-success btn-sm"
                                                                    id="to-update-book-btn"
                                                                >Accept</button>
                                                            ) : (
                                                                <button
                                                                    aria-disabled="true"
                                                                    className="btn btn-secondary btn-sm disabled"
                                                                    id="to-update-book-btn"
                                                                >
                                                                    Accept
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={(e) => HandleDecline(e, book._id)}
                                                                className="btn btn-sm btn-danger"
                                                                id="to-delete-book-btn"
                                                            >Decline</button>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {pages > 0 && (
                                        <nav className="ml-3 mb-2">
                                            <ul className="pagination justify-content-center">
                                                {current === 1 ? (
                                                    <li className="page-item disabled"><span className="page-link">First</span></li>
                                                ) : (
                                                    <li className="page-item">
                                                        <a
                                                            href="#"
                                                            className="page-link"
                                                            onClick={(e) => { e.preventDefault(); handlePagination(1); }}
                                                        >
                                                            First
                                                        </a>
                                                    </li>
                                                )}

                                                {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + (current > 5 ? current - 4 : 1)).map(page => (
                                                    <li key={page} className={`page-item ${page === current ? 'active' : ''}`}>
                                                        <a
                                                            href="#"
                                                            className="page-link"
                                                            onClick={(e) => { e.preventDefault(); handlePagination(page); }}
                                                        >
                                                            {page}
                                                        </a>
                                                    </li>
                                                ))}

                                                {current === pages ? (
                                                    <li className="page-item disabled"><span className="page-link">Last</span></li>
                                                ) : (
                                                    <li className="page-item">
                                                        <a
                                                            href="#"
                                                            className="page-link"
                                                            onClick={(e) => { e.preventDefault(); handlePagination(pages); }}
                                                        >
                                                            Last
                                                        </a>
                                                    </li>
                                                )}
                                            </ul>
                                        </nav>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Suspense>
        </>
    );
};

export default BookRequestInventory;
