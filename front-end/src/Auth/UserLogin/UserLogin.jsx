import React, { useState } from 'react';
import axios from 'axios';
import Alert from '../../partials/Header/alert/alert';
import Navbar from '../../partials/Header/nav/nav';
import { useNavigate } from 'react-router-dom';

const UserLogin = ({ IfUser }) => {
    const navigate = useNavigate();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/user-login', formData);
            if (response.data.success) {
                setSuccess(response.data.success)
                navigate('/user/dashboard/1');
            }
            else setError(response.data.error);
        } catch (error) {
            console.error('There was an error logging in:', error);
            setError(error);
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
        <section
            style={{
                background: 'url("/image/other/2.jpg") no-repeat center center fixed',
                backgroundSize: '100% 100%',
                WebkitBackgroundSize: '100% 100%',
                MozBackgroundSize: '100% 100%',
                OBackgroundSize: '100% 100%',
                MsBackgroundSize: '100% 100%',
            }}
        >
            <IfUser />
            <Navbar />
            <Alert success={success} error={error} dismissAlert={dismissAlert} />
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card" style={{ marginTop: '5%', marginBottom: '5%' }}>
                            <div className="card-header text-center">
                                <h4>User Login</h4>
                            </div>
                            <div className="card-block">
                                <form className="p-3" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="username" className="form-control-label">Username</label>
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
                                    <button
                                        type="submit"
                                        id="submit_btn"
                                        className="btn btn-success btn-block"
                                    >
                                        Login!
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserLogin;
