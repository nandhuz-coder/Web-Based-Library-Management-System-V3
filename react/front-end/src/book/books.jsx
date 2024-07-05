import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Alert from '../partials/Header/alert/alert';

const Navbar = ({ currentUser }) => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-0 sticky-top">
        <div className="container">
            <Link className="navbar-brand" to={!currentUser ? "/" : currentUser.isAdmin ? "/admin" : "/user/1"}>Home</Link>
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
                    <li className="nav-item active px-2">
                        <Link className="nav-link" to="/books">Browse Books</Link>
                    </li>
                </ul>
                {currentUser ? (
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
                                {!currentUser.isAdmin ? (
                                    <>
                                        <Link to="/user/1/profile" className="dropdown-item">
                                            <i className="fa fa-user-circle"></i> Profile
                                        </Link>
                                        <Link to="/auth/user-logout" className="dropdown-item">
                                            <i className="fa fa-user-times"></i> Logout
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/admin/profile" className="dropdown-item">
                                            <i className="fa fa-user-circle"></i> Profile
                                        </Link>
                                        <Link to="/auth/user-logout" className="dropdown-item">
                                            <i className="fa fa-user-times"></i> Logout
                                        </Link>
                                    </>
                                )}
                            </div>
                        </li>
                        <li className="nav-item">
                            <Link to="/user/1/notification" className="nav-link">
                                <i className="fa fa-bell"></i><span className="badge badge-danger badge-pill">2</span>
                            </Link>
                        </li>
                    </ul>
                ) : (
                    <Link to="/signUp" className="btn btn-primary btn-sm ml-auto">Sign up</Link>
                )}
            </div>
        </div>
    </nav>
);

const SearchBar = ({ handleSubmit, error }) => (
    <section id="search_bar" className="my-3 py-4" style={{ background: 'rgb(52, 185, 174)' }}>
        <div className="container">
            <Alert error={error} />
            <form action="/books/all/all/1" method="POST" onSubmit={(e) => { handleSubmit(e) }}>
                <div className="row">
                    <div className="col-md-5 p-1">
                        <select name="filter" id="filter" className="form-control">
                            <option selected disabled>Select Filter...</option>
                            <option name="title">Title</option>
                            <option name="author">Author</option>
                            <option name="category">Category</option>
                            <option name="ISBN">ISBN</option>
                        </select>
                    </div>
                    <div className="col-md-5 p-1">
                        <input
                            name="searchName"
                            id="searchName"
                            type="text"
                            className="form-control"
                            placeholder="Search Books"
                        />
                    </div>
                    <div className="col-md-2 p-1">
                        <input
                            type="submit"
                            id="search-book-btn"
                            className="btn btn-warning btn-block"
                            value="Search"
                        />
                    </div>
                </div>
            </form>
        </div>
    </section>
);

const Books = ({ books, currentUser }) => (
    <section id="browse_books" className="mt-5">
        <div className="container">
            <div className="row">
                {books.map((book, i) => (
                    <div className="card col-md-3 text-center" style={{ marginBottom: '10px' }} key={i}>
                        <div className="card-body">
                            <h5 className="card-title">{book.title}</h5>
                            <p><small style={{ color: 'red' }}>Author: {book.author}</small></p>
                            <p><small style={{ color: 'rgb(20, 168, 40)' }}>Category: {book.category}</small></p>
                            <p><small style={{ color: 'rgb(52, 33, 219)' }}>In stock: {book.stock}</small></p>
                            {currentUser && book.stock >= 0 && (
                                <>
                                    {currentUser.bookIssueInfo?.some(book_info => book_info._id === book._id) ? (
                                        <>
                                            <a href="#" className="btn btn-xs btn-warning disabled" role="button" aria-disabled="true">Issued!</a>
                                            <Link to="/books/return-renew" className="btn btn-xs btn-success" role="button">Return/Renew</Link>
                                        </>
                                    ) : currentUser.bookRequestInfo?.some(book_info => book_info._id === book._id) ? (
                                        <a href="#" className="btn btn-xs btn-warning disabled" role="button" aria-disabled="true">Requested!</a>
                                    ) : (
                                        <form
                                            action={`/books/${book._id}/request/${currentUser._id}`}
                                            method="POST"
                                            className="d-inline"
                                        >
                                            <input className="btn btn-sm btn-warning" type="submit" value="request" />
                                        </form>
                                    )}
                                </>
                            )}
                            <Link to={`/books/details/${book._id}`} className="btn btn-sm btn-success">Details</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Pagination = ({ pages, current, filter, value, handlePagination }) => (
    <nav className="ml-3 mb-2" style={{ marginTop: '20px' }}>
        <ul className="pagination offset-md-3">
            {current === 1 ? (
                <li className="page-item disabled"><span className="page-link">First</span></li>
            ) : (
                <li className="page-item">
                    <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); handlePagination(`/api/books/${filter}/${value}/1`) }}>
                        First
                    </a>
                </li>
            )}

            {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + (current > 5 ? current - 4 : 1)).map(i => (
                <li className={`page-item ${i === current ? 'active' : ''}`} key={i}>
                    <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); handlePagination(`/api/books/${filter}/${value}/${i}`) }}>
                        {i}
                    </a>
                </li>
            ))}

            {current < pages && (
                <li className="page-item">
                    <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); handlePagination(`/api/books/${filter}/${value}/${pages}`) }}>
                        Last
                    </a>
                </li>
            )}
        </ul>
    </nav>
);

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [pages, setPages] = useState(0);
    const [current, setCurrent] = useState(1);
    const [filter, setFilter] = useState('all');
    const [value, setValue] = useState('all');
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('/api/books/all/all/1')
                const { books, current, pages, filter, value, user } = response.data;
                setBooks(books);
                setCurrent(current);
                setPages(pages);
                setFilter(filter);
                setValue(value);
                setCurrentUser(user);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };
        fetchBooks();
    }, []);
    const handlePagination = async (lnk) => {
        try {
            const response = await axios.get(lnk);
            const { books, current, pages, filter, value } = response.data;
            setBooks(books);
            setCurrent(current);
            setPages(pages);
            setFilter(filter);
            setValue(value);
        } catch (error) {
            console.error('Error handling pagination:', error);
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const searchParams = new URLSearchParams(formData).toString();
        try {
            const response = await axios.post(event.target.action, searchParams, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (response.data.error) return setError(response.data.error)
            const { books, current, pages, filter, value } = response.data;
            setBooks(books);
            setCurrent(current);
            setPages(pages);
            setFilter(filter);
            setValue(value);
        } catch (error) {
            console.error('Error submitting request:', error);
        }
    };

    return (
        <div>
            <Navbar currentUser={currentUser} />
            <SearchBar handleSubmit={handleSubmit} error={error} />
            <Books books={books} currentUser={currentUser} />
            {pages > 0 && <Pagination pages={pages} current={current} filter={filter} value={value} handlePagination={handlePagination} />}
        </div>
    );
};

export default BooksPage;