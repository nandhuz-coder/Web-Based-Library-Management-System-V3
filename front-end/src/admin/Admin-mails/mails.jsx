import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../partials/Header/Admin-nav/admin-nav';
import Alert from '../../partials/Header/alert/alert';
import axios from 'axios';

const MailConfigPage = ({ IfAdmin }) => {
    const [mailConfigs, setMailConfigs] = useState([]);
    const [toggles, setToggles] = useState({
        requestBooks: false,
        issueBooks: false,
        passwordUpdateOtp: false,
        signupOtp: false,
        signinOtp: false,
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [selectedMails, setSelectedMails] = useState({});
    const [loading, setLoading] = useState(false);

    const getMails = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/admin/mails/config');
            const data = response.data[0];
            if (!data) {
                setError('No config found.');
                return;
            }
            const togglesData = {};
            Object.keys(data.toggles).forEach((key) => {
                togglesData[key] = data.toggles[key].switches;
            });
            setToggles(togglesData);

            const updatedMailConfigs = data.mails.map(mail => ({ ...mail, loading: false }));
            setMailConfigs(updatedMailConfigs);

            const initialSelections = {};
            Object.keys(data.toggles).forEach((key) => {
                const mail = data.toggles[key].mail;
                initialSelections[key] = mail || (updatedMailConfigs.length ? updatedMailConfigs[0].email : '');
            });
            setSelectedMails(initialSelections);
        } catch (err) {
            setError('Failed to fetch mail configurations.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (event) => {
        const { name, checked } = event.target;
        setToggles(prevToggles => ({
            ...prevToggles,
            [name]: checked,
        }));
        if (!checked) {
            setSelectedMails(prevSelectedMails => ({
                ...prevSelectedMails,
                [name]: '',
            }));
        }
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        setMailConfigs(prevConfigs => {
            const updatedConfigs = [...prevConfigs];
            updatedConfigs[index][name] = value;
            return updatedConfigs;
        });
    };

    const handleMailDelete = async (mail) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the mail configuration for ${mail}?`);
        if (!confirmDelete) return;
        try {
            const response = await axios.post('/api/admin/mails/delete', { email: mail });
            if (response.data.success) {
                setSuccess(response.data.success);
            } else {
                setError(response.data.error);
            }
            getMails();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete mail.');
        }
    };

    const handleSelectionChange = (event) => {
        const { name, value } = event.target;
        setSelectedMails(prevSelectedMails => ({
            ...prevSelectedMails,
            [name]: value,
        }));
    };

    const dismissAlert = (type) => {
        if (type === 'error') {
            setError('');
        } else if (type === 'success') {
            setSuccess('');
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/admin/mails/update', {
                toggles,
                mails: mailConfigs,
                selections: selectedMails,
            });
            if (response.data.success) {
                setSuccess(response.data.success);
            } else {
                setError(response.data.error);
            }
            getMails();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update mail configurations.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfigure = async (index) => {
        setMailConfigs(prevConfigs => {
            const updatedConfigs = [...prevConfigs];
            updatedConfigs[index].loading = true;
            return updatedConfigs;
        });
        try {
            const response = await axios.post('/api/admin/mails/configure', {
                email: mailConfigs[index].email,
                authKey: mailConfigs[index].authKey,
            });
            if (response.data.success) {
                setSuccess(response.data.success);
            } else {
                setError(response.data.error);
            }
            getMails();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to configure email.');
        } finally {
            setMailConfigs(prevConfigs => {
                const updatedConfigs = [...prevConfigs];
                updatedConfigs[index].loading = false;
                return updatedConfigs;
            });
        }
    };

    const addMailConfig = () => {
        if (mailConfigs.every(mail => mail.configured)) {
            setMailConfigs(prevConfigs => [
                ...prevConfigs,
                { email: '', authKey: '', configured: false, loading: false }
            ]);
        } else {
            setError('Please configure all existing mails before adding new ones.');
        }
    };

    useEffect(() => {
        getMails();
    }, []);

    return (
        <>
            < AdminNavbar />
            <div className="container mt-4">
                <IfAdmin />
                <Alert success={success} error={error} dismissAlert={dismissAlert} />
                <h2 className="mb-4">Mail Configuration</h2>
                <div className="card mb-4">
                    <div className="card-header bg-primary text-white">
                        <h4 className="mb-0">Authenticate Mails (G-mail)</h4>
                    </div>
                    <div className="card-body">
                        {mailConfigs.map((config, index) => (
                            <div className="row mb-3" key={index}>
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label htmlFor={`email-${index}`}>Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id={`email-${index}`}
                                            name="email"
                                            value={config.email}
                                            onChange={(event) => handleInputChange(index, event)}
                                            disabled={config.configured || config.loading}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label htmlFor={`authKey-${index}`}>Auth Key</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={`authKey-${index}`}
                                            name="authKey"
                                            value={config.authKey}
                                            onChange={(event) => handleInputChange(index, event)}
                                            disabled={config.configured || config.loading}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 d-flex align-items-center">
                                    {!config.configured ? (
                                        <button
                                            className={`btn ${config.loading ? 'btn-warning' : 'btn-success'} btn-block`}
                                            onClick={() => handleConfigure(index)}
                                            disabled={config.loading}
                                        >
                                            {config.loading ? (
                                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            ) : 'Configure'}
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-danger btn-block"
                                            onClick={() => handleMailDelete(config.email)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className="row">
                            <div className="col-md-6">
                                <button className="btn btn-secondary btn-block" onClick={addMailConfig}>
                                    Add Mail
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header bg-info text-white">
                        <h4 className="mb-0">Notification Settings</h4>
                    </div>
                    <div className="card-body">
                        {Object.keys(toggles).map((key) => (
                            <div className="form-group row mb-3" key={key}>
                                <label className="col-md-4 col-form-label text-capitalize">
                                    {key.replace(/([A-Z])/g, ' $1')}
                                </label>
                                <div className="col-md-4">
                                    <select
                                        className="form-control"
                                        name={key}
                                        value={selectedMails[key] || ''}
                                        onChange={handleSelectionChange}
                                        disabled={!toggles[key]}
                                    >
                                        <option value="" disabled>Select Mail</option>
                                        {mailConfigs.map((mailConfig, index) => (
                                            <option key={index} value={mailConfig.email} disabled={!mailConfig.configured}>
                                                {mailConfig.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={key}
                                            name={key}
                                            checked={toggles[key]}
                                            onChange={handleToggle}
                                        />
                                        <label className="form-check-label" htmlFor={key}>
                                            Enable
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className="btn btn-primary btn-lg d-block mx-auto" onClick={handleUpdate} disabled={loading}>
                            {loading ? (
                                <div className="spinner-border spinner-border-sm text-light" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : 'Update'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MailConfigPage;
