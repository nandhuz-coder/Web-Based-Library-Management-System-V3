import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        try {
            const res = await axios.get(`/admin/users/${page}`);
            setUsers(res.data.users);
            setCurrentPage(res.data.current);
            setTotalPages(res.data.pages);
        } catch (err) {
            console.error(err);
        }
    };

    const searchUsers = async (searchValue) => {
        try {
            const res = await axios.post(`/admin/users/1`, { searchUser: searchValue });
            if (res.data.error) {
                setError(res.data.error);
            } else {
                setUsers(res.data.users);
                setCurrentPage(res.data.current);
                setTotalPages(res.data.pages);
                setError('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSuggestions = async (searchValue) => {
        try {
            const res = await axios.get(`/api/users/suggestions?q=${searchValue}`);
            setSuggestions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchInput(value);
        if (value) {
            debouncedFetchSuggestions(value);
        } else {
            fetchUsers(currentPage);
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchInput(suggestion.username);
        setSuggestions([]);
        searchUsers(suggestion.username);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`/admin/users/delete/${userId}`);
            fetchUsers(currentPage);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFlagUser = async (userId) => {
        try {
            await axios.post(`/admin/users/flagged/${userId}`);
            fetchUsers(currentPage);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
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
                                    <button className="btn btn-primary">Search</button>
                                </span>
                            </div>
                            {suggestions.length > 0 && (
                                <ul className="list-group">
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

            {error && <div className="alert alert-danger">{error}</div>}

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
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
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

                                {totalPages > 0 && (
                                    <nav className="mx-auto mb-2">
                                        <ul className="pagination">
                                            {currentPage === 1 ? (
                                                <li className="page-item disabled">
                                                    <span className="page-link">First</span>
                                                </li>
                                            ) : (
                                                <li className="page-item">
                                                    <button onClick={() => setCurrentPage(1)} className="page-link">
                                                        First
                                                    </button>
                                                </li>
                                            )}
                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                                                .map((page) => (
                                                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                                                        <button onClick={() => setCurrentPage(page)} className="page-link">
                                                            {page}
                                                        </button>
                                                    </li>
                                                ))}
                                            {currentPage === totalPages ? (
                                                <li className="page-item disabled">
                                                    <span className="page-link">Last</span>
                                                </li>
                                            ) : (
                                                <li className="page-item">
                                                    <button onClick={() => setCurrentPage(totalPages)} className="page-link">
                                                        Last
                                                    </button>
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
        </>
    );
};

export default UsersPage;

