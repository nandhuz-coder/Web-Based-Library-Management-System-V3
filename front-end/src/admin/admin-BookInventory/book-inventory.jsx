import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Loading from '../../Loading/Loading';
import AdminNavbar from '../../partials/Header/Admin-nav/admin-nav';
import debounce from 'lodash.debounce';
import Alert from '../../partials/Header/alert/alert';
import { Link } from 'react-router-dom';

const BookInventory = () => {
    const [books, setBooks] = useState([]);
    const [pages, setPages] = useState(0);
    const [current, setCurrent] = useState(1);
    const [filter, setFilter] = useState('all');
    const [searchName, setSearchName] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchBooksRef = useRef();

    const fetchBooks = useCallback(
        debounce(async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/admin/bookInventory/${filter}/${searchName}/${current}`);
                setBooks(response.data.books);
                setPages(response.data.pages);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }, 300),
        [filter, searchName, current]
    );

    fetchBooksRef.current = fetchBooks;

    useEffect(() => {
        fetchBooksRef.current();
    }, [filter, searchName, current]);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrent(1);
    };

    const handleSearchNameChange = (event) => {
        if (!event.target.value) return setSearchName("all");
        setSearchName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setCurrent(1);
    };

    const DeleteBook = useCallback(async (id) => {
        try {
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

    const renderPagination = () => {
        const pageNumbers = [];
        const maxPagesToShow = 6;
        let startPage = Math.max(1, current - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(pages, startPage + maxPagesToShow - 1);
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return (
            <nav className="ml-3 mb-2">
                <ul className="pagination offset-md-3">
                    {current > 1 ? (
                        <li className="page-item">
                            <button onClick={() => setCurrent(1)} className="page-link" aria-label="Go to first page">First</button>
                        </li>
                    ) : (
                        <li className="page-item disabled" aria-disabled="true">
                            <span className="page-link">First</span>
                        </li>
                    )}
                    {pageNumbers.map((number) => (
                        <li key={number} className={`page-item ${number === current ? 'active' : ''}`}>
                            <button onClick={() => setCurrent(number)} className="page-link" aria-label={`Go to page ${number}`} disabled={loading}>{number}</button>
                        </li>
                    ))}
                    {current < pages ? (
                        <li className="page-item">
                            <button onClick={() => setCurrent(pages)} className="page-link" aria-label="Go to last page" disabled={loading}>
                                {loading ? 'Loading...' : 'Last'}
                            </button>
                        </li>
                    ) : (
                        <li className="page-item disabled" aria-disabled="true">
                            <span className="page-link">Last</span>
                        </li>
                    )}
                </ul>
            </nav>
        );
    };
    return (
        <>
            <AdminNavbar />
            <div>
                <header id="main-header" className="py-2 bg-primary text-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <h1><i className="fa fa-book"></i> Book Inventory</h1>
                            </div>
                        </div>
                    </div>
                </header>
                <section id="search_bar" className="my-3 py-4 bg-light">
                    <div className="container">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-5 p-1">
                                    <select name="filter" id="book_select" className="form-control" value={filter} onChange={handleFilterChange}>
                                        <option value="all" disabled>Select Option...</option>
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
                                        value={searchName === 'all' ? '' : searchName}
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
                <Alert success={success} error={error} dismissAlert={dismissAlert} />
                <section id="bookInventory" className="mt-2">
                    <div className="container" style={{ width: '85%', maxWidth: 'none' }}>
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
                                            {loading && <Loading />}
                                            {books.map((book) => (
                                                <tr key={book._id}>
                                                    <td>{book.title}</td>
                                                    <td>{book.author}</td>
                                                    <td>{book.ISBN}</td>
                                                    <td>{book.category}</td>
                                                    <td>{book.stock}</td>
                                                    <td>
                                                        <span>
                                                            <Link to={`/admin/books/1/update/${book._id}`} className="btn btn-info btn-sm" id="to-update-book-btn"> Update </Link>
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); DeleteBook(book._id) }}
                                                                className="btn btn-sm btn-danger"
                                                                id="to-delete-book-btn"> Delete
                                                            </button>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {pages > 0 && renderPagination()}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default BookInventory;
