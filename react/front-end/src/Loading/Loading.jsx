// Loading.jsx
import React from 'react';
import './Loading.css';

const Loading = () => {
    return (
        <div className="skeleton">
            <div className="skeleton-item" style={{ width: '60%' }}></div>
            <div className="skeleton-item" style={{ width: '80%' }}></div>
            <div className="skeleton-item" style={{ width: '40%' }}></div>
            <div className="skeleton-item" style={{ width: '90%' }}></div>
            <div className="skeleton-item" style={{ width: '50%' }}></div>
        </div>
    );
};

export default Loading;
