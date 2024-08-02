// Loading.jsx
import React from 'react';
import './Loading.css';

const Loading = () => {
    return (
        <div className="skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-paragraph">
                <div className="skeleton-line" style={{ width: '60%' }}></div>
                <div className="skeleton-line" style={{ width: '80%' }}></div>
                <div className="skeleton-line" style={{ width: '40%' }}></div>
                <div className="skeleton-line" style={{ width: '90%' }}></div>
                <div className="skeleton-line" style={{ width: '50%' }}></div>
            </div>
            <div className="skeleton-avatar"></div>
            <div className="skeleton-content">
                <div className="skeleton-line" style={{ width: '70%' }}></div>
                <div className="skeleton-line" style={{ width: '30%' }}></div>
            </div>
        </div>
    );
};

export default Loading;
