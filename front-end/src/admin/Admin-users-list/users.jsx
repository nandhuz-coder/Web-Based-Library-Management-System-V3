import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce';
import Alert from '../../partials/Header/alert/alert';
import AdminNavbar from '../../partials/Header/Admin-nav/admin-nav'
import Loading from '../../Loading/Loading';

const UsersPage = ({ IfAdmin }) => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [warning, setWarning] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [Render, setRender] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        setLoading(true);
        try {
            const res = await axios.get(`/admin/users/${page}`);
            setUsers(res.data.users);
            setCurrentPage(res.data.current);
            setTotalPages(res.data.pages);
            setError('');
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setRender(false);
        }
    };

    const searchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`/api/admin/users/1`, { searchUser: searchInput });
            if (res.data.error) {
                setError(res.data.error);
            } else {
                setUsers(res.data.users);
                setCurrentPage(res.data.current);
                setTotalPages(res.data.pages);
                setError('');
            }
        } catch (err) {
            setError('Search failed.');
        } finally {
            setLoading(false);
            setRender(false);
        }
    };

    const fetchSuggestions = async (searchValue) => {
        try {
            const res = await axios.get(`/api/users/suggestions?q=${searchValue}`);
            setSuggestions(res.data);
        } catch (err) {
            setError('Failed to fetch suggestions.');
        }
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchInput(value);
        if (value) {
            debouncedFetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchInput(suggestion.username);
        setSuggestions([]);
    };

    const handleSearchButtonClick = () => {
        searchUsers();
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.get(`/api/admin/users/delete/${userId}`).then((res) => {
                if (res.data.error)
                    return setError(res.data.error)
                setSuccess(res.data.success);
                fetchUsers(currentPage);
            })
        } catch (err) {
            setError('Failed to delete user...');
        }
    };

    const handleFlagUser = async (userId) => {
        try {
            await axios.get(`/api/admin/users/flagged/${userId}`).then((res) => {
                if (res.data.warning)
                    setWarning(res.data.warning)
                else
                    setSuccess(res.data.success);
                fetchUsers(currentPage);
            })
        } catch (err) {
            setError('Failed to flag user.');
        }
    };

    const dismissAlert = (type) => {
        if (type === 'error') setError('');
        if (type === 'success') setSuccess('');
        if (type === 'warning') setWarning('');
    };

    return (
        <>
            <IfAdmin />
            <Suspense fallback={<Loading />}>
                <AdminNavbar />
                <header id="main-header" className="py-2 bg-primary text-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <h1>
                                    <i className="fa fa-users"></i> Users
                                </h1>
                            </div>
                        </div>
                    </div>
                </header>
                <section id="actions" className="py-4 mb-4">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3 mr-auto">
                                <button className="btn btn-light btn-block" onClick={() => navigate('/admin')}>
                                    <i className="fa fa-arrow-left"></i> Back To Dashboard
                                </button>
                            </div>
                            <div className="col-md-6">
                                <div className="input-group">
                                    <input
                                        name="searchUser"
                                        type="text"
                                        className="form-control"
                                        placeholder="Search User by First Name, Last Name, username, E-mail"
                                        value={searchInput}
                                        onChange={handleSearchChange}
                                    />
                                    <span className="input-group-btn">
                                        <button className="btn btn-primary" onClick={handleSearchButtonClick}>
                                            Search
                                        </button>
                                    </span>
                                </div>
                                {suggestions.length > 0 && (
                                    <ul className="list-group suggestions-list" style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
                                        {suggestions.map((suggestion) => (
                                            <li
                                                key={suggestion._id}
                                                className="list-group-item list-group-item-action"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                {suggestion.firstName} {suggestion.lastName} ({suggestion.username})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <Alert
                    error={error}
                    success={success}
                    warning={warning}
                    dismissAlert={dismissAlert}
                />
                {loading && <Alert type="info" message="Loading..." dismissAlert={() => { }} />}

                <section id="users">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="card">
                                    <div className="card-header">
                                        <h4>Users</h4>
                                    </div>
                                    <table className="table table-striped">
                                        <thead className="thead-inverse">
                                            <tr>
                                                <th>Name</th>
                                                <th>Username</th>
                                                <th>Email</th>
                                                <th>Gender</th>
                                                <th>Date Registered</th>
                                                <th>Violation Flag</th>
                                                <th>Fine</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Render && <Loading />}
                                            {users.map((user) => (
                                                !user.isAdmin && (
                                                    <tr key={user._id}>
                                                        <td>{`${user.firstName} ${user.lastName}`}</td>
                                                        <td>
                                                            <a href={`/admin/users/profile/${user._id}`} title="Visit this user">
                                                                {user.username}
                                                            </a>
                                                        </td>
                                                        <td>{user.email}</td>
                                                        <td>{user.gender}</td>
                                                        <td>{new Date(user.joined).toDateString()}</td>
                                                        <td>{user.violationFlag ? 'Yes' : 'No'}</td>
                                                        <td>${user.fines}</td>
                                                        <td>
                                                            <button
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                title={
                                                                    user.bookIssueInfo.length > 0
                                                                        ? 'This user has books in possession. Are you sure to delete this user?'
                                                                        : 'Delete User'
                                                                }
                                                                className="btn btn-sm btn-danger"
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => handleFlagUser(user._id)}
                                                                title={user.violationFlag ? 'Lift the flag' : 'Warn user'}
                                                                className={`btn btn-sm ${user.violationFlag ? 'btn-warning' : 'btn-success'}`}
                                                            >
                                                                <i className="fa fa-flag"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            ))}
                                        </tbody>
                                    </table>

                                    {totalPages > 1 && (
                                        <nav className="mx-auto mb-2">
                                            <ul className="pagination">
                                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        First
                                                    </button>
                                                </li>
                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    let pageIndex;
                                                    if (currentPage <= 3) {
                                                        pageIndex = i + 1;
                                                    } else if (currentPage > totalPages - 3) {
                                                        pageIndex = totalPages - 4 + i;
                                                    } else {
                                                        pageIndex = currentPage - 2 + i;
                                                    }
                                                    if (pageIndex <= 0 || pageIndex > totalPages) return null;
                                                    return (
                                                        <li
                                                            key={pageIndex}
                                                            className={`page-item ${pageIndex === currentPage ? 'active' : ''}`}
                                                        >
                                                            <button
                                                                className="page-link"
                                                                onClick={() => setCurrentPage(pageIndex)}
                                                            >
                                                                {pageIndex}
                                                            </button>
                                                        </li>
                                                    );
                                                })}
                                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(totalPages)}
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        Last
                                                    </button>
                                                </li>
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

export default UsersPage;
