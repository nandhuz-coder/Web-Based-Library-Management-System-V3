import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserNav from '../../partials/Header/User-nav/user-nav';
import Alert from '../../partials/Header/alert/alert';
import Loading from '../../Loading/Loading';

const UserProfile1 = ({ IsUser }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [Render, setRender] = useState(true);
    const [change, setChange] = useState(false);

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

    const handlePasswordChange = (e) => {
        setPasswordMatch(e.target.value === document.getElementById('password').value);
    };

    // ChangePhoto function in UserProfile1.js
    const ChangePhoto = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const photoInput = document.querySelector('input[name="photo"]');
        formData.append('image', photoInput.files[0]);

        axios.put('/api/user/changeimage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                setSuccess('Profile photo updated successfully.');
                setChange(!change);
            })
            .catch(error => {
                setError('Failed to update profile photo.');
            });
    };


    if (!currentUser || Render) {
        return <Loading />
    }

    return (
        <>
            <IsUser />
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

                        {currentUser.bookIssueInfo.length > 0 ? (
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
                            <form action="/user/1/delete-profile?_method=DELETE" method="POST">
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
                            <form action="/user/1/update-password?_method=PUT" method="POST">
                                <div className="form-group">
                                    <label htmlFor="oldPassword" className="form-control-label">Old Password</label>
                                    <input type="password" name="oldPassword" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password" className="form-control-label">New Password</label>
                                    <input id="password" type="password" name="password" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form-control-label">Confirm Password</label>
                                    <input id="confirmPassword" type="password" name="confirmPassword" className="form-control" onKeyUp={handlePasswordChange} />
                                    <span id="message" style={{ color: passwordMatch ? 'green' : 'red' }}>
                                        {passwordMatch ? 'Matched' : 'Not Matched'}
                                    </span>
                                </div>
                                <input type="submit" value="Submit" className="btn btn-primary btn-block" />
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
                            <form action="/user/1/update-profile?_method=PUT" method="POST">
                                <div className="form-group">
                                    <label htmlFor="firstName" className="form-control-label">First Name</label>
                                    <input type="text" name="firstName" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName" className="form-control-label">Last Name</label>
                                    <input type="text" name="lastName" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="username" className="form-control-label">Username</label>
                                    <input type="text" name="username" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email" className="form-control-label">Email</label>
                                    <input type="email" name="email" className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="address" className="form-control-label">Address</label>
                                    <input type="text" name="address" className="form-control" />
                                </div>
                                <input type="submit" value="Submit" className="btn btn-warning btn-block" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile1;
