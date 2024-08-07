import React, { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../../Loading/Loading';
import AdminNavbar from '../../partials/Header/Admin-nav/admin-nav';
import Alert from '../../partials/Header/alert/alert';

const StockOut = ({ IfAdmin }) => {
    const [books, setBooks] = useState([]);
    const [filter, setFilter] = useState(' ');
    const [searchName, setSearchName] = useState(' ');
    const [current, setCurrent] = useState(1);
    const [pages, setPages] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchBooksRef = useRef(() => { });

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    useEffect(() => {
        fetchBooks(filter, searchName, current);
        fetchBooksRef.current = () => fetchBooks(filter, searchName, current);
    }, [current, filter, searchName]);

    const fetchBooks = useCallback(async (filter, value, page) => {
        try {
            const response = await axios.get(`/admin/bookstock/out/${filter}/${value}/${page}`);
            setBooks(response.data.books);
            setPages(response.data.pages);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleFilterChange = useCallback((e) => {
        setFilter(e.target.value);
    }, []);

    const handleSearchNameChange = useCallback((e) => {
        setSearchName(e.target.value);
    }, []);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        setCurrent(1);
        fetchBooks(filter, searchName, 1);
    }, [filter, searchName, fetchBooks]);

    const handlePagination = useCallback((page) => {
        setCurrent(page);
    }, []);

    const DeleteBook = useCallback(async (id) => {
        try {
            await delay(300);
            const res = await axios.get(`/api/admin/book/delete/${id}`);
            if (res.data.error) setError(res.data.error);
            if (res.data.success) setSuccess(res.data.success);
            fetchBooksRef.current();
        } catch (error) {
            setError('Error deleting book');
        }
    }, []);

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
            <Suspense fallback={<Loading />}>
                <AdminNavbar />
                <Alert success={success} error={error} dismissAlert={dismissAlert} />
                <div>
                    <header id="main-header" className="py-2 bg-primary text-white">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                    <h1><i className="fa fa-pencil"></i> Stock out Book Inventory</h1>
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
                                        <select
                                            name="filter"
                                            id="book_select"
                                            className="form-control"
                                            value={filter}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="" disabled>Select Option...</option>
                                            <option value="title">Title</option>
                                            <option value="author">Author</option>
                                            <option value="category">Category</option>
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
                                        <input
                                            type="submit"
                                            className="btn btn-outline-primary btn-block"
                                            value="Search"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>

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
                                                    <th>Category</th>
                                                    <th>In Stock</th>
                                                    <th>Edit</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {books.map(book => (
                                                    <tr key={book._id}>
                                                        <td>{book.title}</td>
                                                        <td>{book.author}</td>
                                                        <td>{book.ISBN}</td>
                                                        <td>{book.category}</td>
                                                        <td>{book.stock}</td>
                                                        <td>
                                                            <span>
                                                                <Link
                                                                    to={`/admin/books/1/update/${book._id}`}
                                                                    className="btn btn-info btn-sm"
                                                                >
                                                                    Update
                                                                </Link>
                                                                <button
                                                                    onClick={() => DeleteBook(book._id)}
                                                                    className="btn btn-sm btn-danger"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {pages > 0 && (
                                            <nav className="ml-3 mb-2">
                                                <ul className="pagination offset-md-3">
                                                    {current === 1 ? (
                                                        <li className="page-item disabled">
                                                            <a className="page-link">First</a>
                                                        </li>
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
                                                        <li className="page-item disabled">
                                                            <a className="page-link">Last</a>
                                                        </li>
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
                </div>
            </Suspense>
        </>
    );
};

export default StockOut;
