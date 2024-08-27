import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../Loading/Loading';
import UserNav from '../../partials/Header/User-nav/user-nav';
import Alert from '../../partials/Header/alert/alert';

const RenewReturn = ({ IsUser }) => {
    const [books, setBooks] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [render, setRender] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const fetchBook = () => {
        axios.get('/user/books/1/return-renew')
            .then(response => {
                setBooks(response.data.user);
                setCurrentUser(response.data.currentUser);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Failed to fetch books. Please try again later.');
            }).finally(() => setRender(false));
    };

    useEffect(() => {
        fetchBook();
    }, []);

    const handleRenew = (bookId) => {
        axios.post(`/api/user/books/${bookId}/renew`)
            .then(response => {
                console.log('Book renewed successfully:', response.data);
                fetchBook();
                if (response.data.success) setSuccess(response.data.success);
                else setError(response.data.error);
            })
            .catch(error => {
                console.error('Error renewing book:', error);
                setError('Failed to renew the book. Please try again later.');
            }).finally(() => setRender(false));
    };

    const handleReturn = (bookId) => {
        axios.post(`/api/user/books/return/${bookId}`)
            .then(response => {
                console.log('Book returned successfully:', response.data);
                fetchBook();
                if (response.data.success) setSuccess(response.data.success);
                else setError(response.data.error);
            })
            .catch(error => {
                console.error('Error returning book:', error);
                setError('Failed to return the book. Please try again later.');
            }).finally(() => setRender(false));
    };

    const dismissAlert = (type) => {
        if (type === 'error') {
            setError('');
        } else if (type === 'success') {
            setSuccess('');
        }
    };

    if (render) return <Loading />;

    return (
        <>
            <IsUser />
            <UserNav />
            <header id="main-header" className="py-2 bg-info text-white">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h1><i className="fa fa-retweet"></i> Renew/Return</h1>
                        </div>
                    </div>
                </div>
            </header>
            <Alert success={success} error={error} dismissAlert={dismissAlert} />
            <section className="mt-4 py-3">
                <div className="container" style={{ maxWidth: '80%' }}>
                    <div className="col mx-auto">
                        <div className="card">
                            <div className="card-header text-center">
                                <h4>All Renewables/Returnables</h4>
                            </div>
                            <table className="table table-striped">
                                <thead className="thead-inverse">
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Issue date</th>
                                        <th>Return date</th>
                                        <th>Category</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map(book => (
                                        <tr key={book._id}>
                                            <td>{book.book_info.title}</td>
                                            <td>{book.book_info.author}</td>
                                            <td>{new Date(book.book_info.issueDate).toDateString()}</td>
                                            <td>{new Date(book.book_info.returnDate).toDateString()}</td>
                                            <td>{book.book_info.category}</td>
                                            <td>
                                                {book.book_info.isRenewed ? (
                                                    !book.book_info.isReturn && (
                                                        <button
                                                            className="btn btn-xs btn-warning disabled"
                                                            aria-disabled="true"
                                                        >
                                                            Renewed!
                                                        </button>
                                                    )
                                                ) : (
                                                    currentUser?.violationFlag && new Date(book.book_info.returnDate) < Date.now() ? (
                                                        <button
                                                            className="btn btn-xs btn-warning"
                                                            title="You can't renew book when you are flagged"
                                                        >
                                                            Renew
                                                        </button>
                                                    ) : (
                                                        book.book_info.isReturn ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-xs btn-warning disabled"
                                                                    aria-disabled="true"
                                                                >
                                                                    Renew
                                                                </button>
                                                                <button
                                                                    className="btn btn-xs btn-info disabled"
                                                                    aria-disabled="true"
                                                                >
                                                                    Return
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className="btn btn-xs btn-warning"
                                                                    onClick={() => handleRenew(book.book_info.id)}
                                                                >
                                                                    Renew
                                                                </button>
                                                                <button
                                                                    className="btn btn-xs btn-info"
                                                                    onClick={() => handleReturn(book.book_info.id)}
                                                                >
                                                                    Return
                                                                </button>
                                                            </>
                                                        )
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default RenewReturn;
