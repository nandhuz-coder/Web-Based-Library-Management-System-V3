import React, { useState } from 'react';
import axios from 'axios';
import './AdminLogin.css';
import Alert from '../../partials/Header/alert/alert';
const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/admin-login', {
                username, password
            }).then((response) => {
                if (response.status === 401) {
                    setError(response.data.error)
                    setSuccess('');
                } else if (response.status === 200) {
                    setSuccess(response.data.success)
                    setError('');
                    window.location.href = '/admin';
                }
            }).catch((err) => {
                setError(err)
                window.location.reload()
            })
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Failed to login');
            setSuccess('');
        }
    };

    return (
        <section id="adminLoginForm" className="admin-login-form">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card">
                            <div className="card-header text-center">
                                <h4>Admin Login</h4>
                            </div>
                            <div className="card-block">
                                <Alert error={error} success={success} />
                                <form className="p-3" onSubmit={handleLogin}>
                                    <div className="form-group">
                                        <label className="form-control-label">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            placeholder="Username"
                                            className="form-control"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-control-label">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="Password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block">
                                        Login
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

export default AdminLogin;
