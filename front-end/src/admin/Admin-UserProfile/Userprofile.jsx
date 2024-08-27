import React, { useState, useEffect, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Alert from '../../partials/Header/alert/alert';
import AdminNav from '../../partials/Header/Admin-nav/admin-nav';
import Loading from '../../Loading/Loading';
import './errorAnimation.css';

const UserProfile = () => {
    const { user_id } = useParams();
    const [user, setUser] = useState({});
    const [issues, setIssues] = useState([]);
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [render, setRender] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/admin/1/users/profile/${user_id}`)
            .then((response) => {
                if (response.data.NoRender) {
                    setRender(false);
                    setError(response.data.error);
                } else {
                    const { user, issues, activities } = response.data;
                    setUser(user);
                    setIssues(issues);
                    setActivities(activities);
                }
            })
            .catch((error) => {
                setError('Error fetching data');
                console.error(error);
            }).finally(() => setLoading(false))
    }, [user_id]);

    const dismissAlert = (type) => {
        if (type === 'error') {
            setError('');
        } else if (type === 'success') {
            setSuccess('');
        }
    };

    if (!render) {
        return (
            <>
                <AdminNav />
                <div className="container d-flex justify-content-center align-items-center min-vh-100">
                    <div className="error-section text-center">
                        <div className="search-icon">🔍</div>
                        <div className="error-text">User Not Available</div>
                        <div className="error-description">
                            We searched the entire database but couldn't find the user you were looking for.
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div>
            <Suspense fallback={<Loading />}>
                <AdminNav />
                <div className="container mt-5 pt-2">
                    {success && <Alert success={success} dismissAlert={dismissAlert} />}
                    {error && <Alert error={error} dismissAlert={dismissAlert} />}
                    {loading && <Loading />}
                    <div className="row" style={{ marginBottom: '20px' }}>
                        <div className="col-md-3">
                            <img
                                src={`/images/user-profile/${user.image}`}
                                className="card-img-top"
                                alt="User Profile"
                            />
                        </div>
                        <div className="col-md-6" style={{ border: '1px solid black' }}>
                            <h4 className="text-center card-header pb-3" style={{ background: 'rgb(219, 167, 35)' }}>
                                Personal Information
                            </h4>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">First Name: {user.firstName}</li>
                                <li className="list-group-item">Last Name: {user.lastName}</li>
                                <li className="list-group-item">Username: {user.username}</li>
                                <li className="list-group-item">Joined: {new Date(user.joined).toDateString()}</li>
                                <li className="list-group-item">Email: {user.email}</li>
                                <li className="list-group-item">
                                    Issued books: {issues.map((issue, index) => (
                                        <span key={index}>{issue.book_info.title}{index < issues.length - 1 ? ', ' : ''}</span>
                                    ))}
                                </li>
                                <li className="list-group-item">Address: {user.address}</li>
                                <li className="list-group-item text-danger font-weight-bold">
                                    Violation Flag: {user?.violationFlag ? user.violationFlag.toString() : "False"}
                                </li>
                                <li className="list-group-item">Due Fines: ${user.fines}</li>
                            </ul>
                        </div>
                        <div className="col-md-3">
                            <div className="card" style={{ width: '18rem' }}>
                                <div className="card-header text-center">
                                    <strong>Recent activities</strong>
                                </div>
                                <ul className="list-group list-group-flush">
                                    {activities.slice(0, 5).map((activity, index) => (
                                        <li className="list-group-item" key={index}>
                                            {activity.category === 'Issue' && (
                                                <>
                                                    {user.username} issued {activity.info.title} at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                            {activity.category === 'Return' && (
                                                <>
                                                    {user.username} returned {activity.info.title} at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                            {activity.category === 'Request' && (
                                                <>
                                                    {user.username} requested {activity.info.title} at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                            {activity.category === 'Decline' && (
                                                <>
                                                    Admin declined {activity.info.title} request of {user.username} at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                            {activity.category === 'Renew' && (
                                                <>
                                                    {user.username} renewed {activity.info.title} at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                            {activity.category === 'Rturn apply' && (
                                                <>
                                                    {user.username} return request {activity.info.title} at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                            {activity.category === 'Return decline' && (
                                                <>
                                                    Admin denied {user.username}'s return of {activity.info.title} at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                            {activity.category === 'Update Profile' && (
                                                <>
                                                    {user.username} updated profile at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                            {activity.category === 'Update Password' && (
                                                <>
                                                    {user.username} updated password at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                            {activity.category === 'Upload Photo' && (
                                                <>
                                                    {user.username} uploaded photo at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                            {activity.category === 'Comment' && (
                                                <>
                                                    {user.username} commented on {activity.info.title} at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                            {activity.category === 'Update Comment' && (
                                                <>
                                                    {user.username} updated comment on {activity.info.title} at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                            {activity.category === 'Delete Comment' && (
                                                <>
                                                    {user.username} deleted comment on {activity.info.title} at {new Date(activity.entryTime).toDateString()}
                                                </>
                                            )}
                                        </li>
                                    ))}
                                    {activities.length > 5 && (
                                        <Link to={`/admin/users/activities/${user._id}`} className="btn btn-primary btn-block">
                                            See all...
                                        </Link>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Suspense>
        </div>
    );
};

export default UserProfile;
