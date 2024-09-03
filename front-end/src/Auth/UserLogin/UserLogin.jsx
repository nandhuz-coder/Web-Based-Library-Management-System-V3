import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '../../partials/Header/alert/alert';
import Navbar from '../../partials/Header/nav/nav';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const UserLogin = ({ IfUser }) => {
    const navigate = useNavigate();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [otpRequired, setOtpRequired] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(60);
    const [attempts, setAttempts] = useState(0);
    const [otpVerified, setOtpVerified] = useState(false);
    const [Sendotp, setSendOtp] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [otpSecret, setOtpSecret] = useState('');

    useEffect(() => {
        axios.get('/api/auth/otp-login').then((response) => {
            setOtpRequired(response.data.otp);
        });
    }, []);

    useEffect(() => {
        let timer;
        if (cooldown) {
            timer = setInterval(() => {
                setCooldownTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setCooldown(false);
                        return 60;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    const generateOTP = async () => {
        if (cooldown) return;
        try {
            setSendOtp(true);
            const response = await axios.post('/api/auth/generate-otp', formData);
            if (response.data.error) return setError(response.data.error);
            else if (response.data.success) setSuccess(response.data.success);
            setOtpSecret(response.data.secret);
            setSendOtp(false);
            setOtpSent(true);
            setCooldown(true);
            setAttempts(0);
        } catch (error) {
            console.error('There was an error generating OTP:', error);
            setError('There was an error generating OTP.');
            setSendOtp(false);
        }
    };

    const matchOTP = async () => {
        if (attempts >= 5) {
            setError('Maximum verification attempts reached.');
            return;
        }
        try {
            setSendOtp(true);
            const response = await axios.post('/api/auth/verify-otp', { otp: otpInput, secret: otpSecret });
            if (response.data.valid) {
                setSuccess('OTP matched successfully!');
                setOtpSent(false);
                setOtpVerified(true);
            } else {
                setError('OTP did not match!');
                setOtpVerified(false);
            }
            setSendOtp(false);
        } catch (error) {
            console.error('There was an error matching OTP:', error);
            setError('There was an error matching OTP.');
            setSendOtp(false);
        }
        setAttempts(attempts + 1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOtpChange = (e) => {
        setOtpInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/user-login', formData);
            if (response.data.success) {
                setSuccess(response.data.success);
                setTimeout(() => {
                    navigate('/user/dashboard/1');
                }, 700);
            } else {
                setError(response.data.error);
            }
        } catch (error) {
            console.error('There was an error logging in:', error);
            setError('There was an error logging in.');
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
                                    {otpRequired && (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={generateOTP}
                                                disabled={cooldown || Sendotp}
                                                className="btn btn-primary btn-block"
                                            >
                                                {Sendotp ? (
                                                    <>
                                                        <div className="spinner" role="status"></div>
                                                        <span className="sr-only">Loading...</span>
                                                    </>
                                                ) : cooldown ? `Wait ${cooldownTime} seconds` : 'Get OTP'}
                                            </button>
                                            {otpSent && (
                                                <div className="form-group">
                                                    <label htmlFor="otp" className="form-control-label">OTP</label>
                                                    <input
                                                        type="text"
                                                        id="otp"
                                                        name="otp"
                                                        placeholder="OTP"
                                                        className="form-control"
                                                        required
                                                        value={otpInput}
                                                        onChange={handleOtpChange}
                                                        maxLength={6}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={matchOTP}
                                                        disabled={otpInput.length !== 6 || Sendotp}
                                                        className="btn btn-secondary btn-block"
                                                    >
                                                        {Sendotp ? (
                                                            <div className="spinner" role="status"></div>
                                                        ) : 'Verify OTP'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        id="submit_btn"
                                        className="btn btn-success btn-block"
                                        disabled={otpRequired && !otpVerified}
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