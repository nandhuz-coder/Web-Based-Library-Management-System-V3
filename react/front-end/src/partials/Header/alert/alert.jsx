import React from 'react';

const Alert = ({ error, success, warning }) => {
    return (
        <div className="container my-2">
            {error && error.length > 0 && (
                <div className="alert alert-danger" id="alert-danger" role="alert">
                    {error}
                </div>
            )}
            {success && success.length > 0 && (
                <div className="alert alert-success" id="alert-success" role="alert">
                    {success}
                </div>
            )}
            {warning && warning.length > 0 && (
                <div className="alert alert-warning" id="alert-warning" role="alert">
                    {warning}
                </div>
            )}
        </div>
    );
}

export default Alert;
