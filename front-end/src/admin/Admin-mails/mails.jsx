import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../partials/Header/Admin-nav/admin-nav';
import Alert from '../../partials/Header/alert/alert';
import axios from 'axios';

const MailConfigPage = ({ IfAdmin }) => {
    const [mailConfigs, setMailConfigs] = useState([{ email: '', authKey: '', configured: false }]);
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
    const [isAddingMail, setIsAddingMail] = useState(false); // Track if adding new mail is allowed

    const dismissAlert = (type) => {
        if (type === 'error') {
            setError('');
        } else if (type === 'success') {
            setSuccess('');
        }
    };

    const handleToggle = (event) => {
        const { name, checked } = event.target;
        setToggles((prevToggles) => ({
            ...prevToggles,
            [name]: checked,
        }));
        if (!checked) {
            setSelectedMails((prevSelectedMails) => ({
                ...prevSelectedMails,
                [name]: '',
            }));
        }
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedMailConfigs = [...mailConfigs];
        updatedMailConfigs[index][name] = value;
        setMailConfigs(updatedMailConfigs);
    };

    const handleMailDelete = (index) => {
        const updatedMailConfigs = mailConfigs.filter((_, i) => i !== index);
        setMailConfigs(updatedMailConfigs);
        // Clear selection if the deleted mail was selected
        setSelectedMails((prevSelectedMails) => {
            const updatedSelections = { ...prevSelectedMails };
            Object.keys(updatedSelections).forEach((key) => {
                if (updatedSelections[key] === mailConfigs[index].email) {
                    updatedSelections[key] = '';
                }
            });
            return updatedSelections;
        });
    };

    const handleSelectionChange = (event) => {
        const { name, value } = event.target;
        setSelectedMails((prevSelectedMails) => ({
            ...prevSelectedMails,
            [name]: value,
        }));
    };

    const handleUpdate = () => {
        axios.post('/api/admin/mails/update', {
            toggles,
            mails: mailConfigs,
            selections: selectedMails,
        }).then((res) => {
            setSuccess('Configuration updated successfully!');
        }).catch((err) => {
            setError('Failed to update configuration.');
        });
    };

    const handleConfigure = (index) => {
        const updatedMailConfigs = [...mailConfigs];
        updatedMailConfigs[index].configured = true;
        setMailConfigs(updatedMailConfigs);
        setIsAddingMail(true); // Allow adding more mails once configured

        axios.post('/api/admin/mails/configure', { email: updatedMailConfigs[index].email })
            .then((res) => {
                setSuccess('Mail configured successfully!');
            })
            .catch((err) => {
                setError('Failed to configure mail.');
            });
    };

    const addMailConfig = () => {
        if (mailConfigs.every(mail => mail.configured)) { // Ensure all existing mails are configured
            setMailConfigs([...mailConfigs, { email: '', authKey: '', configured: false }]);
        } else {
            setError('Please configure all existing mails before adding new ones.');
        }
    };

    useEffect(() => {
        axios.get('/api/admin/mails/config').then((res) => {
            const data = res.data[0];
            setToggles(data.toggles);
            setMailConfigs(data.mails);
            const initialSelections = {};
            Object.keys(data.toggles).forEach((key) => {
                initialSelections[key] = data.mails.length ? data.mails[0].email : '';
            });
            setSelectedMails(initialSelections);
        });
    }, []);

    return (
        <>
            <AdminNavbar />
            <div className="container">
                <IfAdmin />
                <Alert success={success} error={error} dismissAlert={dismissAlert} />
                <h2>Mail Configuration</h2>
                <div className="card mb-4">
                    <div className="card-body">
                        <h4>Authenticate Mails (G-mail)</h4>
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
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2 d-flex align-items-center">
                                    {!config.configured ? (
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleConfigure(index)}
                                        >
                                            Configure
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleMailDelete(index)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isAddingMail && (
                            <button className="btn btn-primary" onClick={addMailConfig}>
                                Add Another Mail
                            </button>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-body">
                        <h4>Toggles</h4>
                        <form>
                            {Object.keys(toggles).map((toggleKey) => (
                                <div className="form-group form-check custom-control custom-switch" key={toggleKey}>
                                    <input
                                        type="checkbox"
                                        className="custom-control-input"
                                        id={`toggle-${toggleKey}`}
                                        name={toggleKey}
                                        checked={toggles[toggleKey]}
                                        onChange={handleToggle}
                                    />
                                    <label className="custom-control-label" htmlFor={`toggle-${toggleKey}`}>
                                        {toggleKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                    </label>
                                    <select
                                        className="form-control mt-2"
                                        name={toggleKey}
                                        value={selectedMails[toggleKey] || ''}
                                        onChange={handleSelectionChange}
                                        disabled={!toggles[toggleKey]}
                                    >
                                        <option value="">Select Mail</option>
                                        {mailConfigs
                                            .filter(mail => mail.configured) // Filter only configured mails
                                            .map((mail, index) => (
                                                <option key={index} value={mail.email}>
                                                    {mail.email}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            ))}
                            <button
                                className="btn btn-success mt-3"
                                type="button"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MailConfigPage;
