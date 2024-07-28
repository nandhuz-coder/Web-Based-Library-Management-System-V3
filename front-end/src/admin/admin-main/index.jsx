import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import './index.css';
import AdminNavbar from '../../partials/Header/Admin-nav/admin-nav';
import Loading from '../../Loading/Loading';

const AdminIndex = ({ IfAdmin }) => {
    const [activities, setActivities] = useState([]);
    const [pages, setPages] = useState(0);
    const [current, setCurrent] = useState(1);
    const [booksCount, setBooksCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/admin/1');
                const data = response.data;
                setActivities(data.activities);
                setPages(data.pages);
                setCurrent(data.current);
                setBooksCount(data.books_count);
                setUsersCount(data.users_count);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };
        fetchData();
    }, []);

    const handlePagination = useCallback(async (lnk) => {
        try {
            const response = await axios.get(lnk);
            const data = response.data;
            setActivities(data.activities);
            setPages(data.pages);
            setCurrent(data.current);
            setBooksCount(data.books_count);
            setUsersCount(data.users_count);
        } catch (error) {
            console.error('Error handling pagination:', error);
        }
    }, []);

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
                                    <i className="fa fa-gear"></i> Dashboard
                                </h1>
                            </div>
                        </div>
                    </div>
                </header>

                <section id="actions" className="py-4">
                    <div className="container">
                        <div className="row justify-content-end">
                            <div className="col-md-6">
                                <form action="/admin" method="POST">
                                    <div className="input-group">
                                        <input
                                            name="searchUser"
                                            type="text"
                                            id="search"
                                            className="form-control"
                                            placeholder="Find activities by username, category"
                                        />
                                        <span className="input-group-btn">
                                            <button className="btn btn-primary">Search</button>
                                        </span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="posts" className="my-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-9">
                                <div className="card">
                                    <div className="card-header text-center">
                                        <h4>Recent User Activities</h4>
                                    </div>
                                    <table className="table table-striped">
                                        <thead className="thead-inverse">
                                            <tr>
                                                <th>Info</th>
                                                <th>Category</th>
                                                <th>Date Posted</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activities.map((activity, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <Link to={`/admin/users/profile/${activity.user_id.id}`} title="Visit profile">
                                                            {activity.user_id.username || 'This user'}
                                                        </Link>{' '}
                                                        {activity.category === 'Issue' && `issued ${activity.info.title}`}
                                                        {activity.category === 'Return' && `returned ${activity.info.title}`}
                                                        {activity.category === 'Request' && `requested ${activity.info.title}`}
                                                        {activity.category === 'Return apply' && `requested to return ${activity.info.title}`}
                                                        {activity.category === 'Return decline' && `admin declined ${activity.info.title}`}
                                                        {activity.category === 'Decline' && (
                                                            <>
                                                                request of {' '}
                                                                <span style={{ color: 'red' }}>{activity.info.title}</span> declined by admin {' '}
                                                            </>
                                                        )}
                                                        {activity.category === 'Renew' && `renewed ${activity.info.title}`}
                                                        {activity.category === 'Update Profile' && `updated profile`}
                                                        {activity.category === 'Update Password' && `updated password`}
                                                        {activity.category === 'Upload Photo' && `uploaded profile photo`}
                                                        {activity.category === 'Comment' && `commented ${activity.info.title}`}
                                                        {activity.category === 'Update Comment' && `updated comment on ${activity.info.title}`}
                                                        {activity.category === 'Delete Comment' && `deleted comment on ${activity.info.title}`}
                                                    </td>
                                                    <td>{activity.category}</td>
                                                    <td>{new Date(activity.entryTime).toDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {pages > 0 && (
                                        <nav className="mx-auto mb-2">
                                            <ul className="pagination">
                                                {current === 1 ? (
                                                    <li className="page-item disabled">
                                                        <button className="page-link" disabled>First</button>
                                                    </li>
                                                ) : (
                                                    <li className="page-item">
                                                        <button
                                                            onClick={() => handlePagination('/admin/1')}
                                                            className="page-link"
                                                        >
                                                            First
                                                        </button>
                                                    </li>
                                                )}
                                                {Array.from({ length: pages }, (_, i) => i + 1).map((page) =>
                                                    page === current ? (
                                                        <li className="page-item active" key={page}>
                                                            <button className="page-link" disabled>{page}</button>
                                                        </li>
                                                    ) : (
                                                        <li className="page-item" key={page}>
                                                            <button
                                                                className="page-link"
                                                                onClick={() => handlePagination(`/admin/${page}`)}
                                                            >
                                                                {page}
                                                            </button>
                                                        </li>
                                                    )
                                                )}
                                                {current === pages ? (
                                                    <li className="page-item disabled">
                                                        <button className="page-link" disabled>Last</button>
                                                    </li>
                                                ) : (
                                                    <li className="page-item">
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePagination(`/admin/${pages}`)}
                                                        >
                                                            Last
                                                        </button>
                                                    </li>
                                                )}
                                            </ul>
                                        </nav>
                                    )}

                                </div>
                            </div>

                            <div className="col-md-3 mt-5">
                                <div className="card text-center bg-primary text-white p-3 mb-3">
                                    <div className="card-block">
                                        <h3>Books</h3>
                                        <h1 className="display-4">
                                            <i className="fa fa-pencil"></i> {booksCount}
                                        </h1>
                                        <Link to="/admin/bookInventory/" id="add_books" className="btn btn-outline-light">
                                            View
                                        </Link>
                                    </div>
                                </div>

                                <div className="card text-center bg-success text-white p-3 mb-3">
                                    <div className="card-block">
                                        <h3>Users</h3>
                                        <h1 className="display-4">
                                            <i className="fa fa-users"></i> {usersCount}
                                        </h1>
                                        <Link to="/admin/users/1" className="btn btn-outline-light">
                                            Users
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Suspense>
        </>
    );
};

export default AdminIndex;
