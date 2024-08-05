import React, { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Alert from '../../partials/Header/alert/alert';
import AdminNavbar from '../../partials/Header/Admin-nav/admin-nav';
import Loading from '../../Loading/Loading';

const UserActivities = ({ IfAdmin }) => {
    const { userId } = useParams()
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchCategory, setSearchCategory] = useState('');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`/admin/1/users/activities/${userId}`);
                setActivities(response.data.activities);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch activities');
                setLoading(false);
            }
        };

        fetchActivities();
    }, [userId]);

    const handleSearchCategoryChange = (e) => {
        setSearchCategory(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/admin/users/activities/${userId}`, { category: searchCategory });
            setActivities(response.data.activities);
            setSuccess('Activities filtered successfully');
        } catch (err) {
            setError('Failed to filter activities');
        }
    };

    const dismissAlert = (type) => {
        if (type === 'error') {
            setError('');
        } else if (type === 'success') {
            setSuccess('');
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <IfAdmin />
            <Suspense fallback={<Loading />}>
                <AdminNavbar />
                <Alert success={success} error={error} dismissAlert={dismissAlert} />

                <header id="main-header" className="py-2 bg-primary text-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <h1><i className="fa fa-pencil"></i> User Activities</h1>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ACTIONS */}
                <section id="actions" className="py-4 mb-4">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3 mr-auto">
                                <Link to="/admin" className="btn btn-light btn-block">
                                    <i className="fa fa-arrow-left"></i> Back To Dashboard
                                </Link>
                            </div>
                            <div className="col-md-6">
                                <form onSubmit={handleSearchSubmit}>
                                    <div className="input-group">
                                        <input
                                            name="category"
                                            type="text"
                                            className="form-control"
                                            placeholder="Search activities by category..."
                                            value={searchCategory}
                                            onChange={handleSearchCategoryChange}
                                        />
                                        <span className="input-group-btn">
                                            <button type="submit" className="btn btn-primary">Search</button>
                                        </span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Activities */}
                <section id="posts">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="card">
                                    <div className="card-header text-center">
                                        <h4>Recent Activities</h4>
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
                                                        {activity.category === "Issue" && (
                                                            <>
                                                                {activity.user_id.username || 'This user'} issued {activity.info.title}
                                                            </>
                                                        )}
                                                        {activity.category === "Return" && (
                                                            <>
                                                                {activity.user_id.username || 'This user'} returned {activity.info.title}
                                                            </>
                                                        )}
                                                        {activity.category === "Request" && (
                                                            <>
                                                                {activity.user_id.username || 'This user'} requested {activity.info.title}
                                                            </>
                                                        )}
                                                        {activity.category === "Decline" && (
                                                            <>
                                                                Admin declined {activity.info.title} request of {activity.user_id.username || 'This user'}
                                                            </>
                                                        )}
                                                        {activity.category === "Return apply" && (
                                                            <>
                                                                {activity.user_id.username || 'This user'} applied to return {activity.info.title}
                                                            </>
                                                        )}
                                                        {activity.category === "Return decline" && (
                                                            <>
                                                                Admin declined {activity.info.title} request to return {activity.user_id.username || 'This user'}
                                                            </>
                                                        )}
                                                        {activity.category === "Renew" && (
                                                            <>
                                                                {activity.user_id.username || 'This user'} renewed {activity.info.title}
                                                            </>
                                                        )}
                                                        {activity.category === "Update Profile" && (
                                                            <>
                                                                {activity.user_id.username || 'This user'} updated profile
                                                            </>
                                                        )}
                                                        {activity.category === "Update Password" && (
                                                            <>
                                                                {activity.user_id.username || 'This user'} updated password
                                                            </>
                                                        )}
                                                        {activity.category === "Upload Photo" && (
                                                            <>
                                                                {activity.user_id.username || 'This user'} updated/uploaded profile
                                                            </>
                                                        )}
                                                        {activity.category === "Comment" && (
                                                            <>
                                                                {activity.user_id.username || 'This user'} commented on {activity.info.title}
                                                            </>
                                                        )}
                                                        {activity.category === "Update Comment" && (
                                                            <>
                                                                {activity.user_id.username || 'This user'} updated comment on {activity.info.title}
                                                            </>
                                                        )}
                                                        {activity.category === "Delete Comment" && (
                                                            <>
                                                                {activity.user_id.username || 'This user'} deleted comment on {activity.info.title}
                                                            </>
                                                        )}
                                                    </td>
                                                    <td>{activity.category}</td>
                                                    <td>{new Date(activity.entryTime).toDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Suspense>
        </>
    );
};

export default UserActivities;
