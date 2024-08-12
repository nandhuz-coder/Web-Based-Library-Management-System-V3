import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import UserNav from '../../partials/Header/User-nav/user-nav';
import Alert from '../../partials/Header/alert/alert';
import Loading from '../../Loading/Loading';
import { useNavigate } from 'react-router-dom';

const UserProfile1 = ({ IsUser }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [Render, setRender] = useState(true);
    const [change, setChange] = useState(false);

    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '  ',
        confirmPassword: '',
    });

    useEffect(() => {
        axios.get('/user/2/profile')
            .then(response => {
                setCurrentUser(response.data.currentuser);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError('Failed to load user data.');
            })
            .finally(() => setRender(false));
    }, [change]);

    const dismissAlert = (type) => {
        if (type === 'error') {
            setError('');
        } else if (type === 'success') {
            setSuccess('');
        }
    };

    const ChangePhoto = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const photoInput = document.querySelector('input[name="photo"]');
        formData.append('image', photoInput.files[0]);

        axios.put('/api/user/changeimage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(() => {
            setSuccess('Profile photo updated successfully.');
            setChange(!change);
        }).catch(() => {
            setError('Failed to update profile photo.');
        });
    };


    const handleProfileUpdate = (e) => {
        e.preventDefault();
        const updatedProfile = {
            firstName: e.target.firstName.value,
            lastName: e.target.lastName.value,
            username: e.target.username.value,
            email: e.target.email.value,
            address: e.target.address.value,
        };
        axios.post('/api/user/profile/edit', updatedProfile)
            .then(response => {
                setSuccess(response.data.success);
                setCurrentUser(response.data.currentuser);
            }).catch(error => {
                console.error('Error updating profile:', error);
                setError(error);
            });
    };

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
        axios.post('/api/user/1/changepassword', passwords)
            .then(() => {
                setSuccess('Password updated successfully');
                navigate('/auth/user-login');
            }).catch(error => {
                console.error('Error updating password:', error);
                setError('Error updating password');
            });
    };

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        axios.delete('/api/user/1/delete').then(() => {
            setSuccess('Account deleted successfully');
            navigate('/auth/user-login');
        }).catch(error => {
            console.error('Error deleting account:', error);
            setError('Error deleting account');
        });
    };

    if (!currentUser || Render) {
        return <Loading />
    }

    return (
        <>
            <IsUser />
            <Suspense fallback={<Loading />}>
                <UserNav />
                <style>
                    {`
                    .card-header {
                        background: rgb(219, 167, 35);
                    }
                `}
                </style>
                <header id="main-header" className="py-2 bg-info text-white">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <h1><i className="fa fa-user"></i> Profile</h1>
                            </div>
                        </div>
                    </div>
                </header>

                <section id="actions" className="py-4 mb-4">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3 mr-auto">
                                <a href="/user/1" className="btn btn-light btn-block">
                                    <i className="fa fa-arrow-left"></i> Back To Dashboard
                                </a>
                            </div>

                            <div className="col-md-3">
                                <button
                                    className="btn btn-primary btn-block"
                                    data-toggle="modal"
                                    data-target="#changePasswordModal"
                                >
                                    <i className="fa fa-key"></i> Change Password
                                </button>
                            </div>

                            <div className="col-md-3">
                                <button
                                    className="btn btn-warning btn-block"
                                    data-toggle="modal"
                                    data-target="#updateProfileModal"
                                >
                                    <i className="fa fa-refresh"></i> Update Profile
                                </button>
                            </div>

                            {(currentUser.bookIssueInfo.length > 0 || currentUser.bookRequestInfo.length > 0 || currentUser.bookReturnInfo.length > 0) ? (
                                <div className="col-md-3">
                                    <button
                                        className="btn btn-danger btn-block"
                                        disabled
                                        title="You have to return all borrowed/renewed books first"
                                    >
                                        <i className="fa fa-remove"></i> Delete Profile
                                    </button>
                                </div>
                            ) : (
                                <div className="col-md-3">
                                    <button
                                        className="btn btn-danger btn-block"
                                        data-toggle="modal"
                                        data-target="#deleteProfileModal"
                                    >
                                        <i className="fa fa-remove"></i> Delete Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <Alert success={success} error={error} dismissAlert={dismissAlert} />

                <section className="mt-4">
                    <div className="container">
                        <div className="row" style={{ marginBottom: '20px' }}>
                            <div className="col-md-3">
                                <img
                                    src={`/images/user-profile/${currentUser.image}`}
                                    className="card-img-top rounded-circle"
                                    alt="User"
                                />
                                <button
                                    className="text-muted ml-5"
                                    data-toggle="modal"
                                    data-target="#changePhotoModal"
                                >
                                    <i className="fa fa-camera"></i> Change Photo
                                </button>
                            </div>
                            <div className="col-md-6" style={{ border: '1px solid black' }}>
                                <h4 className="text-center pb-3 card-header">Personal Informations</h4>

                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">First Name: {currentUser.firstName}</li>
                                    <li className="list-group-item">Last Name: {currentUser.lastName}</li>
                                    <li className="list-group-item">Username: {currentUser.username}</li>
                                    <li className="list-group-item">Joined: {new Date(currentUser.joined).toDateString()}</li>
                                    <li className="list-group-item">Email: {currentUser.email}</li>
                                    <li className="list-group-item">Address: {currentUser.address}</li>
                                    <li className="list-group-item text-danger font-weight-bold">
                                        Violation Flag: {currentUser.violationFlag.toString()}
                                    </li>
                                    <li className="list-group-item">Due Fines: ${currentUser.fines}</li>
                                </ul>
                            </div>

                            <div className="col-md-3">
                                <h4 className="text-center pb-3">Terms & Conditions</h4>
                                <ul>
                                    <li>Rule x should be abided by everyone</li>
                                    <li>Rule x should be abided by everyone</li>
                                    <li>Rule x should be abided by everyone</li>
                                    <li>Rule x should be abided by everyone</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Delete Profile Modal */}
                <div className="modal fade" id="deleteProfileModal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">
                                    Once you press yes, all of your issues, comments, and activities will be deleted permanently. Are you sure?
                                </h5>
                                <button className="close" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => handleDeleteAccount(e)}>
                                    <input type="submit" value="Yes" className="btn btn-danger btn-block m-1" />
                                </form>
                                <input type="button" value="No" data-dismiss="modal" className="btn btn-success btn-block m-1" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password Modal */}
                <div className="modal fade" id="changePasswordModal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Edit Password</h5>
                                <button className="close" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => handlePasswordSubmit(e)}>
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

                {/* Change Photo Modal */}
                <div className="modal fade" id="changePhotoModal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-warning text-white">
                                <h5 className="modal-title">Change Photo</h5>
                                <button className="close" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={ChangePhoto} encType="multipart/form-data">
                                    <div className="form-group">
                                        <label htmlFor="photo" className="form-control-label">Upload Image</label>
                                        <input type="file" name="photo" className="form-control-file" />
                                    </div>
                                    <button className="btn btn-primary btn-block">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update Profile Modal */}
                <div className="modal fade" id="updateProfileModal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-warning text-white">
                                <h5 className="modal-title">Update Profile</h5>
                                <button className="close" data-dismiss="modal"><span>&times;</span></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => handleProfileUpdate(e)}>
                                    <div className="form-group">
                                        <label htmlFor="firstName" className="form-control-label">First Name</label>
                                        <input type="text" name="firstName" className="form-control" defaultValue={currentUser.firstName} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName" className="form-control-label">Last Name</label>
                                        <input type="text" name="lastName" className="form-control" defaultValue={currentUser.lastName} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="username" className="form-control-label">Username</label>
                                        <input type="text" name="username" className="form-control" defaultValue={currentUser.username} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-control-label">Email</label>
                                        <input type="email" name="email" className="form-control" defaultValue={currentUser.email} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="address" className="form-control-label">Address</label>
                                        <input type="text" name="address" className="form-control" defaultValue={currentUser.address} />
                                    </div>
                                    <input type="submit" value="Submit" className="btn btn-warning btn-block" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Suspense>
        </>
    );
};

export default UserProfile1;
