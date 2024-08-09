import React, { useState } from 'react';
import axios from 'axios';
import Alert from '../../partials/Header/alert/alert';
import Navbar from '../../partials/Header/nav/nav';

const UserSignUp = ({ IfUser }) => {
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        gender: '',
        address: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/user-signUp', formData);
            setSuccess(response.data.success)
        } catch (error) {
            console.error('There was an error signing up:', error);
            setSuccess(error)
        }
    };

    const dismissAlert = (type) => {
        if (type === 'error') {
            setError('');
        } else if (type === 'success') {
            setSuccess('');
        }
    };

    return (
        <div
            style={{
                background: 'url("/image/other/2.jpg") no-repeat center center fixed',
                backgroundSize: '100% 100%',
            }}
        >
            <IfUser />
            <Navbar />
            <section id="usersignUpForm">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card" style={{ marginTop: '5%', marginBottom: '5%' }}>
                                <div className="card-header text-center">
                                    <h4>User Sign Up</h4>
                                </div>
                                <Alert success={success} error={error} dismissAlert={dismissAlert} />
                                <div className="card-block">
                                    <form className="p-3" onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="firstname" className="form-control-label">First Name</label>
                                                    <input
                                                        type="text"
                                                        id="firstname"
                                                        name="firstName"
                                                        placeholder="First Name"
                                                        className="form-control"
                                                        required
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="lastname" className="form-control-label">Last Name</label>
                                                    <input
                                                        type="text"
                                                        id="lastname"
                                                        name="lastName"
                                                        placeholder="Last Name"
                                                        className="form-control"
                                                        required
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="username" className="form-control-label">Pick a username</label>
                                                    <input
                                                        type="text"
                                                        id="username"
                                                        name="username"
                                                        placeholder="Username"
                                                        className="form-control"
                                                        required
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="email" className="form-control-label">Email</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        placeholder="Email"
                                                        className="form-control"
                                                        required
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group">
                                                    <label htmlFor="password" className="form-control-label">Password</label>
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        placeholder="Password"
                                                        className="form-control"
                                                        required
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="gender" className="form-control-label">Gender</label>
                                                    <select
                                                        name="gender"
                                                        id="gender"
                                                        className="form-control"
                                                        value={formData.gender}
                                                        onChange={handleChange}
                                                    >
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="others">Others</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="address" className="form-control-label">Address</label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        id="address"
                                                        placeholder="Address"
                                                        className="form-control"
                                                        required
                                                        value={formData.address}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            id="btnsubmit"
                                            className="btn btn-primary btn-block"
                                            style={{ width: '50%', marginLeft: '25%' }}
                                        >
                                            Submit
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserSignUp;
