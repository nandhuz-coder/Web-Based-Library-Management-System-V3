import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../../Loading/Loading';
import Alert from '../../partials/Header/alert/alert';
import AdminNav from '../../partials/Header/Admin-nav/admin-nav';

const Profile = ({ IfAdmin }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: null,
        confirmPassword: '',
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/admin/2/profile')
            .then(response => {
                setCurrentUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prevState => ({ ...prevState, [name]: value }));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Passwords do not match!')
            return;
        }

        axios.post('/admin/update-password', passwords)
            .then(response => {
                setSuccess('Password updated successfully');
            })
            .catch(error => {
                console.error('Error updating password:', error);
                setError('Error updating password');
            });
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const updatedProfile = {
            username: e.target.username.value,
            email: e.target.email.value,
        };

        axios.post('/api/admin/edit/profile', updatedProfile)
            .then(response => {
                setSuccess(response);
                setCurrentUser(updatedProfile);
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                setError(error);
            });
    };

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        axios.delete('/api/admin/delete-profile')
            .then(response => {
                setSuccess('Account deleted successfully');
                navigate('/auth/admin-login');
            })
            .catch(error => {
                console.error('Error deleting account:', error);
                setError('Error deleting account');
            });
    };


    const dismissAlert = (type) => {
        if (type === 'error') {
            setError('');
        } else if (type === 'success') {
            setSuccess('');
        }
    };


    if (!currentUser) {
        return <Loading />;
    }

    return (
        <>
            <IfAdmin />
            <Suspense fallback={<Loading />}>
                <AdminNav />
                <header id="main-header" className="py-2 bg-primary text-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <h1><i className="fa fa-user"></i> Profile</h1>
                            </div>
                        </div>
                    </div>
                </header>
                <Alert success={success} error={error} dismissAlert={dismissAlert} />
                <section id="profile" className="py-4 mb-4 bg-faded">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col">
                                <button onClick={() => navigate('/admin')} className="btn btn-secondary btn-block">
                                    <i className="fa fa-arrow-left"></i> Back To Dashboard
                                </button>
                            </div>
                            <div className="col">
                                <button className="btn btn-primary btn-block" data-toggle="modal" data-target="#userNameModal">
                                    <i className="fa fa-user"></i> Edit Profile
                                </button>
                            </div>
                            <div className="col">
                                <button className="btn btn-warning btn-block" data-toggle="modal" data-target="#passwordModal">
                                    <i className="fa fa-lock"></i> Update Password
                                </button>
                            </div>
                            <div className="col">
                                <button onClick={() => navigate('/auth/admin-signup')} className="btn btn-success btn-block">
                                    <i className="fa fa-plus"></i> Add New Admin
                                </button>
                            </div>
                            <div className="col">
                                <button className="btn btn-danger btn-block" data-toggle="modal" data-target="#deleteProfileModal">
                                    <i className="fa fa-close"></i> Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="profile-edit">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7 mx-auto" style={{ marginTop: 20, marginBottom: 20 }}>
                                <div className="card p-3" style={{ border: '1px solid black' }}>
                                    <div className="card-header" style={{ background: 'rgb(231, 192, 93)' }}>
                                        <h4 className="text-center">Admin Info</h4>
                                    </div>
                                    <div className="card-block" style={{ paddingTop: 20 }}>
                                        <p style={{ fontWeight: 'bold', color: 'darkblue', fontSize: 20 }}>User name : {currentUser.username}</p>
                                        <p style={{ fontWeight: 'bold', color: 'rgb(19, 80, 22)', fontSize: 20 }}>Email : {currentUser.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="modal fade" id="passwordModal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-warning text-white">
                                <h5 className="modal-title" id="passwordModalLabel">Edit Password</h5>
                                <button className="close" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handlePasswordSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="oldPassword" className="form-control-label">Old Password</label>
                                        <input type="password" name="oldPassword" id="oldPassword" className="form-control" value={passwords.oldPassword} onChange={handlePasswordChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="newPassword" className="form-control-label">New Password</label>
                                        <input type="password" name="newPassword" id="newPassword" className="form-control" value={passwords.newPassword} onChange={handlePasswordChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword" className="form-control-label">Confirm Password</label>
                                        <input type="password" name="confirmPassword" id="confirmPassword" className="form-control" value={passwords.confirmPassword} onChange={handlePasswordChange} />
                                        <span id="message" style={{ color: passwords.newPassword === passwords.confirmPassword ? 'green' : 'red' }}>{passwords.newPassword === passwords.confirmPassword ? 'Matched' : 'Not matched!'}</span>
                                    </div>
                                    <button id="button" className="btn btn-warning btn-block" disabled={passwords.newPassword !== passwords.confirmPassword}>Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="userNameModal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title" id="passwordModalLabel">Edit Profile</h5>
                                <button className="close" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleProfileUpdate}>
                                    <div className="form-group">
                                        <label htmlFor="username" className="form-control-label">Edit Username</label>
                                        <input name="username" type="text" className="form-control" defaultValue={currentUser.username} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-control-label">Edit Email</label>
                                        <input name="email" type="email" id="admin-edit-email" className="form-control" defaultValue={currentUser.email} />
                                    </div>
                                    <button className="btn btn-primary btn-block" id="update-profile-btn">Update!</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="deleteProfileModal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title" id="deleteProfileModalLabel">Once you press yes, you will lose the admin facility permanently. Are you sure?</h5>
                                <button className="close" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleDeleteAccount}>
                                    <input type="submit" value="Yes" className="btn btn-danger btn-block m-1" />
                                </form>
                                <button className="btn btn-success btn-block m-1" data-dismiss="modal">No</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Suspense>
        </>
    );
};

export default Profile;
