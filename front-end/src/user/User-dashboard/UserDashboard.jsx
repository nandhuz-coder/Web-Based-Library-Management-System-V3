import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import UserNav from '../../partials/Header/User-nav/user-nav';
import Alert from '../../partials/Header/alert/alert';
import Loading from '../../Loading/Loading';

const UserDashboard = ({ IsUser }) => {
    const { page } = useParams();
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState([]);
    const [pages, setPages] = useState(0);
    const [current, setCurrent] = useState(Number(page) || 1);
    const [render, setRender] = useState(true)
    useEffect(() => {
        axios.get(`/api/user/${current}`)
            .then(response => {
                setUser(response.data.user);
                setActivities(response.data.activities);
                setPages(response.data.pages);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            }).finally(() => setRender(false))
    }, [current]);

    const renderActivities = () => {
        return activities.map(activity => {
            const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            if (activity.category === 'Issue') {
                return (
                    <tr key={activity._id}>
                        <td>
                            You have <span className="table-text">issued</span>
                            <span style={{ color: 'rgb(41, 0, 135)' }} className="table-text">
                                {activity.info.title}
                            </span>
                        </td>
                        <td>{activity.category}</td>
                        <td>
                            <p>Issue: {new Date(activity.time.issueDate).toLocaleDateString(undefined, dateOptions)}</p>
                            <p>Return: {new Date(activity.time.returnDate).toLocaleDateString(undefined, dateOptions)}</p>
                        </td>
                    </tr>
                );
            } else if (activity.category === 'Return') {
                return (
                    <tr key={activity._id}>
                        <td>
                            You have <span className="table-text">returned</span>
                            <span style={{ color: 'rgb(41, 0, 135)' }} className="table-text">
                                {activity.info.title}
                            </span>
                        </td>
                        <td>{activity.category}</td>
                        <td>
                            <p>Return Date: {new Date(activity.time.returnDate).toLocaleDateString(undefined, dateOptions)}</p>
                        </td>
                    </tr>
                );
            } else if (activity.category === 'Fine') {
                return (
                    <tr key={activity._id}>
                        <td>
                            You have <span className="table-text">paid a fine</span>
                            for <span style={{ color: 'rgb(41, 0, 135)' }} className="table-text">
                                {activity.info.title}
                            </span>
                        </td>
                        <td>{activity.category}</td>
                        <td>
                            <p>Amount: ₹{activity.info.amount}</p>
                            <p>Paid on: {new Date(activity.time.paidDate).toLocaleDateString(undefined, dateOptions)}</p>
                        </td>
                    </tr>
                );
            } else if (activity.category === 'Renewal') {
                return (
                    <tr key={activity._id}>
                        <td>
                            You have <span className="table-text">renewed</span>
                            <span style={{ color: 'rgb(41, 0, 135)' }} className="table-text">
                                {activity.info.title}
                            </span>
                        </td>
                        <td>{activity.category}</td>
                        <td>
                            <p>Renewal Date: {new Date(activity.time.renewalDate).toLocaleDateString(undefined, dateOptions)}</p>
                            <p>New Return Date: {new Date(activity.time.newReturnDate).toLocaleDateString(undefined, dateOptions)}</p>
                        </td>
                    </tr>
                );
            }
            return null;
        });
    };

    const renderPagination = () => {
        const pageItems = [];
        let start = current > 5 ? current - 4 : 1;
        if (start !== 1) {
            pageItems.push(
                <li key="ellipsis-start" className="page-item disabled"><span className="page-link">...</span></li>
            );
        }
        for (let i = start; i <= current + 4 && i <= pages; i++) {
            pageItems.push(
                <li key={i} className={`page-item ${i === current ? 'active' : ''}`}>
                    <a className="page-link" onClick={() => setCurrent(i)}>{i}</a>
                </li>
            );
            if (i === current + 4 && i < pages) {
                pageItems.push(
                    <li key="ellipsis-end" className="page-item disabled"><span className="page-link">...</span></li>
                );
            }
        }
        return (
            <nav className="pagination-container">
                <ul className="pagination">
                    {current === 1 ? (
                        <li className="page-item disabled"><span className="page-link">First</span></li>
                    ) : (
                        <li className="page-item"><a className="page-link" onClick={() => setCurrent(1)}>First</a></li>
                    )}
                    {pageItems}
                    {current === pages ? (
                        <li className="page-item disabled"><span className="page-link">Last</span></li>
                    ) : (
                        <li className="page-item"><a className="page-link" onClick={() => setCurrent(pages)}>Last</a></li>
                    )}
                </ul>
            </nav>
        );
    };
    if (render) return (
        <>
            < IsUser />
            <Loading />
        </>
    );
    return (
        <div className="dashboard-container">
            <IsUser />
            <UserNav />
            <header id="main-header" className="py-2 bg-primary text-white">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h1><i className="fa fa-gear"></i> Dashboard</h1>
                        </div>
                    </div>
                </div>
            </header>
            <Alert />
            <section id="actions" className="py-4 mb-4 bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <a href="/books/all/all/1" className="btn btn-primary btn-block">
                                <i className="fa fa-plus"></i> Request Book
                            </a>
                        </div>
                        <div className="col-md-4">
                            <a href="/books/return-renew" className="btn btn-info btn-block">
                                <i className="fa fa-retweet"></i> Renew/Return Book
                            </a>
                        </div>
                        <div className="col-md-4">
                            <a
                                href=""
                                className="btn btn-danger btn-block"
                                data-toggle="modal"
                                data-target="#payFineModal"
                            >
                                <i className="fa fa-credit-card"></i> Pay fines
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section id="home" className="mt-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                < img
                                    src={`/images/user-profile/${user.image}`}
                                    className="card-img-top p-1"
                                    alt="Profile"
                                />
                                <div className="card-body">
                                    <p>Name: {user.firstName} {user.lastName}</p>
                                    <p>Email: {user.email}</p>
                                    <p>Books Issued: {user.bookIssueInfo.length}</p>
                                    <p>Due: ₹{user.fines}</p>
                                    <p>Flagged: {user.violationFlag}</p>
                                    <p>Joined: {new Date(user.joined).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="card">
                                <div className="card-header text-center">
                                    <h4>Recent Activities</h4>
                                </div>
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Category</th>
                                            <th>Details</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderActivities()}
                                    </tbody>
                                </table>
                                {renderPagination()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="modal fade" id="payFineModal">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title" id="payFineModalLabel">Pay Fine</h5>
                            <button className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="amount">Amount to Pay</label>
                                    <input type="number" className="form-control" id="amount" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="paymentMethod">Payment Method</label>
                                    <select className="form-control" id="paymentMethod" required>
                                        <option value="cash">Cash</option>
                                        <option value="card">Card</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">Pay</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
