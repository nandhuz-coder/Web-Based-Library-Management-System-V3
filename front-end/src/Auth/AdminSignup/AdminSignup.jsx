import React, { useState } from 'react';
import axios from 'axios';
import Alerts from '../../partials/Header/alert/alert';
import NavBar from '../../partials/Header/nav/nav'
const AdminSignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        adminCode: '',
    });
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('/auth/admin-signup', formData)
            .then(res => {
                if (res.data.success) setSuccess(res.data.success)
                else setError(res.data.error)
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    adminCode: '',
                });
            })
            .catch(error => {
                setError(error)
                console.error('There was an error signing up!', error);
            });
    };

    const dismissAlert = (type) => {
        if (type === 'error') {
            setError('');
        } else if (type === 'success') {
            setSuccess('');
        }
    };

    return (
        <>
            <NavBar />
            <div className="container-background">
                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 offset-md-3" style={{ marginTop: 20 }}>
                                <div className="card">
                                    <div className="card-header text-center">
                                        <Alerts success={success} error={error} dismissAlert={dismissAlert} />
                                        <h4>Admin Sign Up</h4>
                                    </div>
                                    <div className="card-block">
                                        <form className="p-3" onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label className="form-control-label">Pick a username</label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    placeholder="Username"
                                                    className="form-control"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-control-label">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email"
                                                    className="form-control"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-control-label">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    placeholder="Password"
                                                    className="form-control"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-control-label">Secret Code</label>
                                                <input
                                                    type="text"
                                                    name="adminCode"
                                                    placeholder="Enter the secret code"
                                                    className="form-control"
                                                    value={formData.adminCode}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <button type="submit" className="btn btn-primary btn-block">
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
        </>
    );
};

export default AdminSignUp;
