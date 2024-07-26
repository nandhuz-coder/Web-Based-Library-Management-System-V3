import React from 'react';

const Alert = ({ error, success, warning, dismissAlert }) => {
    return (
        <div className="container my-2 sticky-top">
            {error && error.length > 0 && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        aria-label="Close"
                        onClick={() => dismissAlert('error')}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
            {success && success.length > 0 && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {success}
                    <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        aria-label="Close"
                        onClick={() => dismissAlert('success')}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
            {warning && warning.length > 0 && (
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    {warning}
                    <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        aria-label="Close"
                        onClick={() => dismissAlert('warning')}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Alert;
